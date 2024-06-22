package dz.esisba.adminservice.dto.user;

import dz.esisba.adminservice.dto.authority.AuthorityResponse;
import dz.esisba.adminservice.dto.group.GroupResponse;
import dz.esisba.adminservice.dto.module.ModuleResponse;
import dz.esisba.adminservice.dto.role.RoleResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResponse {
    private Long  id;
    private String uuid;
    private String userName;
    private String email;
    private String phoneNumber;
    private String firstName;
    private String lastName;
    private Boolean actif;
    private Set<ModuleResponse> moduleResponses;
    private Set<RoleResponse> roleResponses;
    private Set<UserAuthorityResponse> authorityResponses;
    private GroupResponse groupResponse;
}

