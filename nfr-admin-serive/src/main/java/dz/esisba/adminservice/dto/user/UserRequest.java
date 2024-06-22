package dz.esisba.adminservice.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserRequest {
    private Long  id;

    private String uuid;

    private String userName;

    private String firstName;

    private String lastName;

    private String email;

    private String phoneNumber;

    private Boolean actif;

    private Long groupId;
}