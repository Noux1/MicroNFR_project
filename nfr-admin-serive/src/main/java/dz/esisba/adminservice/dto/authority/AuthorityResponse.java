package dz.esisba.adminservice.dto.authority;

import dz.esisba.adminservice.dto.authorityType.AuthorityTypeResponse;
import dz.esisba.adminservice.dto.module.ModuleResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthorityResponse {
    private Long id;
    private String libelle;
    private boolean actif;
    private AuthorityTypeResponse authorityTypeResponse;
    private ModuleResponse moduleResponse;
}
