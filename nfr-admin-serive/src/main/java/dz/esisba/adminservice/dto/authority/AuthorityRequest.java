package dz.esisba.adminservice.dto.authority;

import dz.esisba.adminservice.entity.AuthorityType;
import dz.esisba.adminservice.entity.Module;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class AuthorityRequest {
    private Long id;
    private String libelle;
    private boolean actif;
    private Long authorityTypeId;
    private Long moduleId;
}
