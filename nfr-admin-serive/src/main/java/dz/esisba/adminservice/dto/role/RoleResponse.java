package dz.esisba.adminservice.dto.role;

import dz.esisba.adminservice.dto.authority.AuthorityResponse;
import dz.esisba.adminservice.dto.module.ModuleResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RoleResponse {
    private Long id;
    private String libelle;
    private Set<AuthorityResponse> authorityResponses;
    private ModuleResponse moduleResponse;
    private boolean actif;
}