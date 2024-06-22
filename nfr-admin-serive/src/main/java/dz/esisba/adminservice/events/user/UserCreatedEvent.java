package dz.esisba.adminservice.events.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserCreatedEvent {
    private String uuid;
    private String userName;
    private String firstName;
    private String lastName;
    private String email;
    private String action;
    private String phoneNumber;
}
