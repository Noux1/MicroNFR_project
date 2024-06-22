package dz.esisba.adminservice.controller;

import dz.esisba.adminservice.dto.user.UserCreateRequest;
import dz.esisba.adminservice.dto.user.UserRequest;
import dz.esisba.adminservice.dto.user.UserResponse;
import dz.esisba.adminservice.enums.keycloakRequiredAction;
import dz.esisba.adminservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import javax.persistence.EntityNotFoundException;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/v1/user")
public class UserController {
    private final UserService userService;


    @Autowired
    public UserController(UserService userService ){
        this.userService= userService;

    }

    @GetMapping()
    @PreAuthorize("hasAuthority('USER_GET_ALL')")
    public ResponseEntity<Object> getAll(){
        try{
            List<UserResponse> response = userService.getAll();
            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (EntityNotFoundException e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_FOUND);
        }
        catch (RuntimeException e){
            return new ResponseEntity<>(e.getMessage() , HttpStatus.NOT_ACCEPTABLE);
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('USER_GET_ID')")
    public ResponseEntity<Object> getUserById(@PathVariable Long id) {
        try {
            UserResponse response = userService.getUserById(id);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_ACCEPTABLE);
        }
        catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping()
    @PreAuthorize("hasAuthority('USER_CREATE')")
    public ResponseEntity<Object> CreateUser(@RequestBody UserCreateRequest request) {
     try{
        UserResponse response = userService.createUser(request);
     return new ResponseEntity<>(response , HttpStatus.OK);
     } catch (EntityNotFoundException e) {
         return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
     } catch (RuntimeException e) {
         return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_ACCEPTABLE);
     }
     catch (Exception e) {
         return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
     }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('USER_UPDATE')")
    public ResponseEntity<Object> UpdateUser(@PathVariable Long id , @RequestBody UserRequest request){
        try{
            UserResponse response = userService.updateUser(request , id);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_ACCEPTABLE);
        }
        catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('USER_DELETE')")
    public ResponseEntity<Object> DeleteUser(@PathVariable Long id){
        try{
            userService.deleteUser(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_ACCEPTABLE);
        }
        catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PostMapping("/required-actions/{id}")
    @PreAuthorize("hasAuthority('USER_REQUIRED_ACTIONS_ADD')")
    public ResponseEntity<Object> addRequiredActions(@RequestBody keycloakRequiredAction[] requiredActions,
                                                     @PathVariable Long id) {

        try {
            userService.userRequiredActions(id, Arrays.stream(requiredActions).map(Enum::toString).toArray(String[]::new));
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_ACCEPTABLE);
        }
        catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PatchMapping("/enable-disableUser/{id}")
    @PreAuthorize("hasAuthority('USER_ENABLE_DISABLE')")
    public ResponseEntity<Object> EnableDisableUser(@PathVariable Long id , @RequestBody UserRequest request){
        try{
            UserResponse response = userService.enableDisableUser(id , request.getActif());
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_ACCEPTABLE);
        }
        catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

        @PutMapping("/{userId}/module/{moduleId}")
        @PreAuthorize("hasAuthority('USER_MODULE_ADD')")
        public ResponseEntity<Object> AddModuleToUser(@PathVariable Long userId , @PathVariable Long moduleId){
            try {
                UserResponse response = userService.addModuleToUser(userId,moduleId);
                return new ResponseEntity<>(response, HttpStatus.OK);
            } catch (EntityNotFoundException e) {
                return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
            } catch (RuntimeException e) {
                return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_ACCEPTABLE);
            }
            catch (Exception e) {
                return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }


    @DeleteMapping("/{userId}/module/{moduleId}")
    @PreAuthorize("hasAuthority('USER_MODULE_REMOVE')")
    public ResponseEntity<Object> RemoveModuleFromUser(@PathVariable Long userId , @PathVariable Long moduleId){
        try {
            UserResponse response = userService.removeModuleFromUser(userId , moduleId);
            return new ResponseEntity<>(response , HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_ACCEPTABLE);
        }
            catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
    @PutMapping("/{userId}/role/{roleId}")
    @PreAuthorize("hasAuthority('USER_ROLE_ADD')")
    public ResponseEntity<Object> AddRoleToUser(@PathVariable Long userId , @PathVariable Long roleId){
            try{
            UserResponse response = userService.addRoleToUser(userId , roleId);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_ACCEPTABLE);
        }
        catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{userId}/role/{roleId}")
    @PreAuthorize("hasAuthority('USER_ROLE_REMOVE')")
    public ResponseEntity<Object> RemoveRoleFromUser(@PathVariable Long userId , @PathVariable Long roleId){
        try{
            UserResponse response = userService.removeRoleFromUser(userId, roleId);
            return new ResponseEntity<>(response , HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_ACCEPTABLE);
        }
        catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{userId}/authority/grant/{authorityId}")
    @PreAuthorize("hasAuthority('USER_AUTHORITY_GRANT')")
    public ResponseEntity<Object> GrantAuthorityToUser(@PathVariable Long userId , @PathVariable Long authorityId){
        try{
            UserResponse response = userService.grantAuthorityToUser(userId, authorityId);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_ACCEPTABLE);
        }
        catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{userId}/authority/revoke/{authorityId}")
    @PreAuthorize("hasAuthority('USER_AUTHORITY_REVOKE')")
    public ResponseEntity<Object> RevokeAuthorityToUser(@PathVariable Long userId , @PathVariable Long authorityId){
        try{
            UserResponse response = userService.revokeAuthorityToUser(userId,authorityId);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_ACCEPTABLE);
        }
        catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{userId}/authority/{authorityId}")
    @PreAuthorize("hasAuthority('USER_AUTHORITY_REMOVE')")
    public ResponseEntity<Object> RemoveAuthorityFromUser(@PathVariable Long userId , @PathVariable Long authorityId){
        try{
            UserResponse response = userService.removeAuthorityFromUser(userId,authorityId);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_ACCEPTABLE);
        }
        catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/uuid/{uuid}")
    @PreAuthorize("hasAuthority('USER_GET_UUID')")
    public ResponseEntity<Object> GetUserByUuid(@PathVariable String uuid ){
        try{
            UserResponse response = userService.getUserByUuid(uuid);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_ACCEPTABLE);
        }
        catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
