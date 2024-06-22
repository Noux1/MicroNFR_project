package dz.esisba.adminservice.dto.authorityType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class AuthorityTypeRequest {
    private Long id;
    private String Libelle;
    private boolean actif;
}
