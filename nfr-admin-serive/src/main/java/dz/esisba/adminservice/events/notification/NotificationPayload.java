package dz.esisba.adminservice.events.notification;

import dz.esisba.adminservice.enums.NotificationChannel;
import dz.esisba.adminservice.enums.NotificationTemplateCode;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationPayload {
    private String uuid;
    private NotificationTemplateCode templateCode;
    private NotificationChannel channel;
    private LocalDateTime time;
}
