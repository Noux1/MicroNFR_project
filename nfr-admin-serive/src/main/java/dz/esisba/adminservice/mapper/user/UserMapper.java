package dz.esisba.adminservice.mapper.user;

import dz.esisba.adminservice.dto.module.ModuleResponse;
import dz.esisba.adminservice.dto.role.RoleResponse;
import dz.esisba.adminservice.dto.user.UserAuthorityResponse;
import dz.esisba.adminservice.dto.user.UserCreateRequest;
import dz.esisba.adminservice.dto.user.UserRequest;
import dz.esisba.adminservice.dto.user.UserResponse;
import dz.esisba.adminservice.entity.Group;
import dz.esisba.adminservice.entity.User;
import dz.esisba.adminservice.entity.UserAuthority;
import dz.esisba.adminservice.mapper.authority.AuthorityMapper;
import dz.esisba.adminservice.mapper.group.GroupMapper;
import dz.esisba.adminservice.mapper.module.ModuleMapper;
import dz.esisba.adminservice.mapper.role.RoleMapper;
import dz.esisba.adminservice.repository.GroupRepository;
import dz.esisba.adminservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.NoSuchElementException;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class UserMapper {

    private final GroupMapper groupMapper;

    private final GroupRepository groupRepository;


    private final RoleMapper roleMapper;

    private final ModuleMapper moduleMapper;

    private final AuthorityMapper authorityMapper;
    public User requestToEntity(UserRequest request) {
        Group group = groupRepository.findById(request.getGroupId())
                .orElseThrow(() -> new NoSuchElementException("Group not found with id: " + request.getGroupId()));
        return User.builder()
                .userName(request.getUserName())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .actif(request.getActif())
                .group(group)
                .phoneNumber(request.getPhoneNumber())
                .build();
    }
    public User requestToEntity(UserCreateRequest request){
        Group group = groupRepository.findById(request.getGroupId())
                .orElseThrow(() -> new NoSuchElementException("Group not found with id: " + request.getGroupId()));
        return User.builder()
                .userName(request.getUserName())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .actif(request.getActif())
                .group(group)
                .build();
    }

    public UserResponse entityToResponse(User entity) {
        Set<ModuleResponse> moduleResponses = new HashSet<>();
        if(entity.getModules() != null && !entity.getModules().isEmpty()) {
            entity.getModules().forEach(module -> moduleResponses.add(moduleMapper.entityToResponse(module)));
        }
        Set<RoleResponse> roleResponses = new HashSet<>();
        if(entity.getRoles() != null && !entity.getRoles().isEmpty()) {
            entity.getRoles().forEach(role -> roleResponses.add(roleMapper.entityToResponse(role)));
        }
        Set<UserAuthorityResponse> authorityResponses = new HashSet<>();
        if(entity.getUserAuthorities() != null && !entity.getUserAuthorities().isEmpty()) {
            entity.getUserAuthorities().forEach(authority -> authorityResponses.add(userAuthorityToResponse(authority)));
        }
        return UserResponse.builder()
                .id(entity.getIdUser())
                .uuid(entity.getUuid())
                .userName(entity.getUserName())
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .email(entity.getEmail())
                .phoneNumber(entity.getPhoneNumber())
                .actif(entity.getActif())
                .authorityResponses(authorityResponses)
                .roleResponses(roleResponses)
                .moduleResponses(moduleResponses)
                .groupResponse(groupMapper.entityToResponse(entity.getGroup()))
                .build();

    }
    private UserAuthorityResponse userAuthorityToResponse(UserAuthority entity) {
        return UserAuthorityResponse.builder()
                .id(entity.getIdUserAuthority())
                .authorityResponse(authorityMapper.entityToResponse(entity.getAuthority()))
                .granted(entity.isGranted())
                .build();
    }

}