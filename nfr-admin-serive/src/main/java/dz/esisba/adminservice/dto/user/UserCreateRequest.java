package dz.esisba.adminservice.dto.user;
import dz.esisba.adminservice.enums.keycloakRequiredAction;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserCreateRequest {

    private String userName;
    private String email;
    private String phoneNumber;
    private String firstName;
    private String lastName;
    private String password;
    private Boolean temporary;
    private Boolean emailVerified;
    private Boolean actif;
    private List<keycloakRequiredAction> requiredActions;
    private Long groupId;
}
