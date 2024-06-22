package dz.esisba.adminservice.events.notification;

import com.fasterxml.jackson.annotation.JsonFormat;
import dz.esisba.adminservice.enums.NotificationChannel;
import dz.esisba.adminservice.enums.NotificationTemplateCode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationEvent {
    private String uuid;
    private String subject;
    private String body;
    private String utilisateur;
    private NotificationChannel notificationChannel;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSSSSSSS")
    private LocalDateTime time;

}
