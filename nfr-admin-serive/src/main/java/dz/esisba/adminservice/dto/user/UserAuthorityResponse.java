package dz.esisba.adminservice.dto.user;

import dz.esisba.adminservice.dto.authority.AuthorityResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserAuthorityResponse {
    private Long id;
    private AuthorityResponse authorityResponse;
    private boolean granted;
}
