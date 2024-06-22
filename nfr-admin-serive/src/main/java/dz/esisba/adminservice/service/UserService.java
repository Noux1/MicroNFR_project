package dz.esisba.adminservice.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import dz.esisba.adminservice.dto.user.UserCreateRequest;
import dz.esisba.adminservice.dto.user.UserRequest;
import dz.esisba.adminservice.dto.user.UserResponse;
import dz.esisba.adminservice.entity.*;
import dz.esisba.adminservice.entity.Module;
import dz.esisba.adminservice.enums.NotificationChannel;
import dz.esisba.adminservice.enums.NotificationTemplateCode;
import dz.esisba.adminservice.events.notification.NotificationEvent;
import dz.esisba.adminservice.events.notification.NotificationPayload;
import dz.esisba.adminservice.events.user.UserCreatedEvent;
import dz.esisba.adminservice.events.user.UserDeleteEvent;
import dz.esisba.adminservice.events.user.UserUpdatedEvent;
import dz.esisba.adminservice.mapper.user.UserMapper;
import dz.esisba.adminservice.repository.*;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.w3c.dom.html.HTMLImageElement;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {
    private final UserRepository userRepository;

    private final UserMapper userMapper;

    private final ModuleRepository moduleRepository;

    private final AuthorityRepository authorityRepository;

    private final RoleRepository roleRepository;

    private final UserAuthorityRepository userAuthorityRepository;

    private final KeycloakService keycloakService;

    private final KafkaTemplate<String, Object> kafkaTemplate;

    private final GroupRepository groupRepository;

    @Autowired
    public UserService(UserRepository userRepository
            , UserMapper userMapper , RoleRepository roleRepository
            , ModuleRepository moduleRepository , AuthorityRepository authorityRepository
            ,UserAuthorityRepository userAuthorityRepository
            ,KeycloakService keycloakService , KafkaTemplate<String, Object> kafkaTemplate ,
                       GroupRepository groupRepository){
        this.userMapper = userMapper;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.authorityRepository = authorityRepository;
        this.moduleRepository = moduleRepository;
        this.userAuthorityRepository =  userAuthorityRepository;
        this.keycloakService = keycloakService;
        this.kafkaTemplate = kafkaTemplate;
        this.groupRepository = groupRepository;
    }
    public String getUsername(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        JwtAuthenticationToken jwtAuthentication = (JwtAuthenticationToken) authentication;
        Jwt jwt = jwtAuthentication.getToken();
        String username = (String) jwt.getClaims().get("preferred_username");
        return username;
    }
//  String  username = "noux";

    public List<UserResponse> getAll() {
        List<User> allUsers= userRepository.findAll();
        return allUsers.stream()
                .map(userMapper::entityToResponse)
                .collect(Collectors.toList());
    }

    public UserResponse createUser(UserCreateRequest request) {
        String uuid = keycloakService.createUser(request);
        if (uuid == null  || uuid.isEmpty()) {
            throw new RuntimeException("Could not create Keycloak User");
        }
        try {
            User newUser = userMapper.requestToEntity(request);
            newUser.setUuid(uuid);
            User savedUser = userRepository.save(newUser);
            if (savedUser.getIdUser() == null) {
                throw new RuntimeException("Could not create user in Local database");
            }
            UserCreatedEvent userCreatedEvent = UserCreatedEvent.builder()
                    .uuid(savedUser.getUuid())
                    .userName(savedUser.getUserName())
                    .email(savedUser.getEmail())
                    .firstName(savedUser.getFirstName())
                    .lastName(savedUser.getLastName())
                    .action("addUser")
                    .phoneNumber(savedUser.getPhoneNumber())
                    .build();

            kafkaTemplate.send("UserTopic", userCreatedEvent);
//            System.out.println(userCreatedEvent);
            return userMapper.entityToResponse(savedUser);

        } catch (Exception e) {
            keycloakService.deleteUser(uuid);
            throw e;
        }

    }

    public User getOneByUsername(String username){
        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> new NoSuchElementException("User not found with username: " + username));
        return user;
    }


    public UserResponse getUserById(Long id ){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("User not found with id: " + id));
        return userMapper.entityToResponse(user);
    }

    public UserResponse updateUser(UserRequest request , Long id){
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("User not found with id: " + id));
        Group group = groupRepository.findById(request.getGroupId())
                .orElseThrow(() -> new NoSuchElementException("Group not found with id: " + request.getGroupId()));
        keycloakService.updateUser(existingUser.getUuid(),request);
        existingUser.setFirstName(request.getFirstName());
        existingUser.setLastName(request.getLastName());
        existingUser.setEmail(request.getEmail());
        existingUser.setGroup(group);
        User updatedUser= userRepository.save(existingUser);

        UserUpdatedEvent userUpdatedEvent = UserUpdatedEvent.builder()
                .uuid(updatedUser.getUuid())
                .email(updatedUser.getEmail())
                .firstName(updatedUser.getFirstName())
                .lastName(updatedUser.getLastName())
                .action("updateUser")
                .build();
        kafkaTemplate.send("UserTopic", userUpdatedEvent);
//        System.out.println(userUpdatedEvent);
        return userMapper.entityToResponse(updatedUser);
    }


    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("User not found with id: " + id));
        keycloakService.deleteUser(user.getUuid());
        userRepository.delete(user);
        UserDeleteEvent userDeleteEvent = UserDeleteEvent.builder()
                .uuid(user.getUuid())
                .action("deleteUser")
                .build();
        kafkaTemplate.send("UserTopic", userDeleteEvent);
    }

    public UserResponse enableDisableUser(Long id , Boolean enable){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("User not found with id: " + id));
        user.setActif(enable);
        keycloakService.enableDisableUser(user.getUuid(),enable);
        String status ="";
        if (enable){
            status = "activated";
        }else{
            status = "deactivated";
        }
        NotificationEvent notificationEvent = NotificationEvent.builder()
                .uuid(user.getUuid())
                .subject(" Enable/disable user ")
                .body("Your account is "+ status)
                .notificationChannel(NotificationChannel.EMAIL)
                .time(LocalDateTime.now())
                .utilisateur(this.getUsername())
                .utilisateur(this.getUsername())
                .build();
        kafkaTemplate.send("NotificationTopic", notificationEvent);
        return userMapper.entityToResponse(user);
    }


    public UserResponse addModuleToUser(Long userId , Long moduleId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found with id: " + userId));
        Module module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new NoSuchElementException("module not found with id: " + moduleId));
        user.addModule(module);
        NotificationEvent notificationEvent = NotificationEvent.builder()
                .uuid(user.getUuid())
                .subject(" Add module " )
                .body(" Add module " + module.getModuleName() + " to user with username " + user.getUserName())
                .notificationChannel(NotificationChannel.ALL)
                .time(LocalDateTime.now())
                .utilisateur(this.getUsername())
                .utilisateur(this.getUsername())
                .build();
        kafkaTemplate.send("NotificationTopic", notificationEvent);
        return userMapper.entityToResponse(user);
    }


    public UserResponse removeModuleFromUser(Long userId , Long moduleId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found with id: " + userId));
        Module module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new NoSuchElementException("module not found with id: " + moduleId));
        user.removeModule(module);
        NotificationEvent notificationEvent = NotificationEvent.builder()
                .uuid(user.getUuid())
                .subject(" Remove module ")
                .body(" remove module " + module.getModuleName() + " to user with username " + user.getUserName())
                .notificationChannel(NotificationChannel.ALL)
                .time(LocalDateTime.now())
                .utilisateur(this.getUsername())
                .utilisateur(this.getUsername())
                .build();
        kafkaTemplate.send("NotificationTopic", notificationEvent);
        return userMapper.entityToResponse(user);
    }


    public void userRequiredActions(Long userId, String[] requiredActions) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found with id: " + userId));
        keycloakService.userRequiredAction(user.getUuid(), requiredActions);
        NotificationEvent notificationEvent = NotificationEvent.builder()
                .uuid(user.getUuid())
                .subject("Add required actions ")
                .body(" Add this required actions : "+ Arrays.toString(requiredActions) + " to user with username "+ user.getUserName())
                .notificationChannel(NotificationChannel.ALL)
                .time(LocalDateTime.now())
                .utilisateur(this.getUsername())
                .utilisateur(this.getUsername())
                .build();
        kafkaTemplate.send("NotificationTopic", notificationEvent);
    }


    public UserResponse addRoleToUser(Long userId , Long roleId ){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found with id: " + userId));
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new NoSuchElementException("role not found with id: " + roleId));

            user.addRole(role);
            NotificationEvent notificationEvent = NotificationEvent.builder()
                    .uuid(user.getUuid())
                    .subject("Add Role")
                    .body("Add Role " + role.getLibelle() + " to user with username " + user.getUserName())
                    .notificationChannel(NotificationChannel.ALL)
                    .time(LocalDateTime.now())
                    .utilisateur(this.getUsername())
                    .build();
            kafkaTemplate.send("NotificationTopic", notificationEvent);
            return userMapper.entityToResponse(user);





    }


    public UserResponse removeRoleFromUser(Long userId , Long roleId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found with id: " + userId));
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new NoSuchElementException("Role not found with id: " + roleId));
        user.removeRole(role);
        NotificationEvent notificationEvent = NotificationEvent.builder()
                .uuid(user.getUuid())
                .subject("Remove Role ")
                .body("Remove Role "+ role.getLibelle() +" from user with username " +user.getUserName())
                .notificationChannel(NotificationChannel.ALL)
                .time(LocalDateTime.now())
                .utilisateur(this.getUsername())
                .utilisateur(this.getUsername())
                .build();
        kafkaTemplate.send("NotificationTopic", notificationEvent);

        return userMapper.entityToResponse(user);
    }


    public UserResponse grantAuthorityToUser(Long userId , Long authorityId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found with id: " + userId));
        Authority authority = authorityRepository.findById(authorityId)
                .orElseThrow(() -> new NoSuchElementException("Authority not found with id: " + authorityId));
        if (user.getModules().stream().anyMatch(module -> module.getIdModule().equals(authority.getModule().getIdModule()))){
            if (user.getUserAuthorities().stream().anyMatch(userAuthority -> userAuthority.getAuthority().getIdAuthority().equals(authority.getIdAuthority()))) {
                UserAuthority userAuth = user.getUserAuthorities().stream()
                        .filter(userAuthority -> userAuthority.getAuthority().getIdAuthority().equals(authority.getIdAuthority()))
                        .findAny()
                        .get();
                userAuth.setGranted(Boolean.TRUE);
                userAuthorityRepository.save(userAuth);
            } else {
                UserAuthority userAuthority = UserAuthority.builder()
                        .authority(authority)
                        .user(user)
                        .granted(Boolean.TRUE)
                        .build();
                user.addAuthority(userAuthority);
                userAuthorityRepository.save(userAuthority);
            }
        } else {
            throw new RuntimeException("this user haven't the access to the module of the authority");
        }

        NotificationEvent notificationEvent = NotificationEvent.builder()
                .uuid(user.getUuid())
                .subject(" Grant Authority ")
                .notificationChannel(NotificationChannel.ALL)
                .body(" Grant Authority " + authority.getLibelle() + " to user with username " + user.getUserName())
                .time(LocalDateTime.now())
                .utilisateur(this.getUsername())
                .utilisateur(this.getUsername())
                .build();

        kafkaTemplate.send("NotificationTopic", notificationEvent);

        System.out.println(notificationEvent);
        return userMapper.entityToResponse((user));
    }


//    public UserResponse grantAuthorityToUser(Long userId , Long authorityId){
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new NoSuchElementException("User not found with id: " + userId));
//        Authority authority = authorityRepository.findById(authorityId)
//                .orElseThrow(() -> new NoSuchElementException("Authority not found with id: " + authorityId));
//        if (user.getModules().contains(authority.getModule())){
//            if (user.getUserAuthorities().stream().anyMatch(userAuthority -> userAuthority.getAuthority().equals(authority))) {
//                user.getUserAuthorities().stream()
//                        .filter(userAuthority -> userAuthority.getAuthority().getIdAuthority().equals(authority.getIdAuthority())
//                                && userAuthority.getUser().getIdUser().equals(user.getIdUser()))
//                        .forEach(userAuthority -> userAuthority.setGranted(Boolean.TRUE));
//            } else {
//                UserAuthority userAuthority = UserAuthority.builder()
//                        .authority(authority)
//                        .user(user)
//                        .granted(Boolean.TRUE)
//                        .build();
//                user.addAuthority(userAuthority);
//
//            }
//        } else {
//            throw new RuntimeException("this user haven't the access to the module of the authority");
//        }
//        return userMapper.entityToResponse((user));
//    }


    public UserResponse revokeAuthorityToUser(Long userId , Long authorityId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found with id: " + userId));
        Authority authority = authorityRepository.findById(authorityId)
                .orElseThrow(() -> new NoSuchElementException("Authority not found with id: " + authorityId));
        if (user.getModules().stream().anyMatch(module -> module.getIdModule().equals(authority.getModule().getIdModule()))){
            if (user.getUserAuthorities().stream().anyMatch(userAuthority -> userAuthority.getAuthority().getIdAuthority().equals(authority.getIdAuthority()))) {
                UserAuthority userAuth = user.getUserAuthorities().stream()
                        .filter(userAuthority -> userAuthority.getAuthority().getIdAuthority().equals(authority.getIdAuthority()))
                        .findAny()
                        .get();
                userAuth.setGranted(Boolean.FALSE);
                userAuthorityRepository.save(userAuth);
            } else {
                UserAuthority userAuthority = UserAuthority.builder()
                        .authority(authority)
                        .user(user)
                        .granted(Boolean.FALSE)
                        .build();
                user.addAuthority(userAuthority);
                userAuthorityRepository.save(userAuthority);
            }
        } else {
            throw new RuntimeException("this user haven't the access to the module of the authority");
        }
        NotificationEvent notificationEvent = NotificationEvent.builder()
                .uuid(user.getUuid())
                .subject(" Revoke authority ")
                .body(" Revoke authority " + authority.getLibelle() + " from user with username " + user.getUserName())
                .notificationChannel(NotificationChannel.ALL)
                .time(LocalDateTime.now())
                .utilisateur(this.getUsername())
                .utilisateur(this.getUsername())
                .build();
        kafkaTemplate.send("NotificationTopic", notificationEvent);
        return userMapper.entityToResponse((user));
    }
//    public UserResponse revokeAuthorityToUser(Long userId , Long authorityId) {
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new NoSuchElementException("User not found with id: " + userId));
//        Authority authority = authorityRepository.findById(authorityId)
//                .orElseThrow(() -> new NoSuchElementException("Authority not found with id: " + authorityId));
//        if (user.getModules().contains(authority.getModule())) {
//            if (user.getUserAuthorities().stream().anyMatch(userAuthority -> userAuthority.getAuthority().equals(authority))) {
//                UserAuthority userAuth = user.getUserAuthorities().stream()
//                        .filter(userAuthority -> userAuthority.getAuthority().getIdAuthority().equals(authority.getIdAuthority())
//                                && userAuthority.getUser().getIdUser().equals(user.getIdUser()))
//                        .findFirst().get();
//                userAuth.setGranted(false);
//                userAuthorityRepository.save(userAuth);
//            } else {
//                UserAuthority userAuthority = UserAuthority.builder()
//                        .authority(authority)
//                        .user(user)
//                        .granted(Boolean.FALSE)
//                        .build();
//                user.addAuthority(userAuthority);
//                userAuthorityRepository.save(userAuthority);
//            }
//
//        } else {
//            throw new RuntimeException("this user haven't the access to the module of the authority");
//        }
//        return userMapper.entityToResponse(user);
//    }


    //    public UserResponse removeAuthorityFromUser(Long userId , Long authorityId){
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new NoSuchElementException("User not found with id: " + userId));
//
//        UserAuthority userAuthority = userAuthorityRepository.findUserAuthorityByUser_IdUserAndAuthority_IdAuthority(userId , authorityId)
//                .orElseThrow(() -> new NoSuchElementException("Authority not found with id: " + authorityId + "in user with id: " + userId));
//        if (user.getUserAuthorities() != null) {
//            user.getUserAuthorities().removeIf(userAuthority1 -> userAuthority1.equals(userAuthority));
////            user.removeAuthority(userAuthority);
//        }
//
//        return userMapper.entityToResponse(user);
//
//    }
    public UserResponse removeAuthorityFromUser(Long userId , Long authorityId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found with id: " + userId));
        Authority authority = authorityRepository.findById(authorityId)
                .orElseThrow(() -> new NoSuchElementException("Authority not found with id: " + authorityId));
        UserAuthority userAuthority = userAuthorityRepository.findUserAuthorityByUser_IdUserAndAuthority_IdAuthority(userId , authorityId)
                .orElseThrow(() -> new NoSuchElementException("Authority not found with id: " + authorityId + "in user with id: " + userId));
        if (user.getUserAuthorities() != null) {
            user.getUserAuthorities().removeIf(userAuthority1 -> userAuthority1.equals(userAuthority));
            userAuthorityRepository.delete(userAuthority);
        }
        NotificationEvent notificationEvent = NotificationEvent.builder()
                .uuid(user.getUuid())
                .subject(" Remove authority ")
                .body(" Remove authority " + authority.getLibelle() + " from user with username " + user.getUserName())
                .notificationChannel(NotificationChannel.ALL)
                .time(LocalDateTime.now())
                .utilisateur(this.getUsername())
                .utilisateur(this.getUsername())
                .build();
        kafkaTemplate.send("NotificationTopic", notificationEvent);
        return userMapper.entityToResponse(user);
    }
//    public UserResponse addUserToGroup(Long userId, Long groupId) {
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new NoSuchElementException("User not found with id: " + userId));
//        Group group = groupRepository.findById(groupId)
//                .orElseThrow(() -> new NoSuchElementException("Group not found with groupId: " + groupId));
//        user.setGroup(group);
//        user = userRepository.save(user);
//        return userMapper.entityToResponse(user);
//    }


    public UserResponse getUserByUuid(String uuid)
    {
        User user = userRepository.findUserByUuid(uuid)
                .orElseThrow(() -> new NoSuchElementException("user not found with uuid " + uuid ));
        return userMapper.entityToResponse(user);
    }
}
