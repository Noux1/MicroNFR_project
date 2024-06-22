import { Request, Response } from 'express';
import { listAllNotifications, getNotificationById, markNotificationAsRead ,deleteNotificationById, createNewNotification,sendNotificationViaSocket } from '../services/notificationService';
import { NotifProducer } from '../events/NotifProducer';
import {sendEmail} from '../services/userService';
import { NotificationChannel } from '../enums/NotificationChannel';

// Kafka producer for audit microservice
export const producer = new NotifProducer('auditLogTopic');


// Function to generate dynamic description based on action and entity
// export function generateDescription(action: string, entityId?: number): string {
//     switch (action) {
//         case 'createNotification':
//             return `Notification with ID ${entityId} was created.`;
//         case 'readNotification':
//             return `Notification with ID ${entityId} was read.`;
//         case 'deleteNotification':
//             return `Notification with ID ${entityId} was deleted.`;
//         default:
//             return `Notification with ID ${entityId} was ${action}.`;
//     }
// }

export const getAllNotifications = async (req: Request, res: Response) => {
    try {
        const notifications = await listAllNotifications();
        res.json({ notifications });

    
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};


// export const createNotification = async (req: Request, res: Response) => {
//     try {
//         const { userId, notificationChannel, subject, body,time } = req.body;
//         const newNotification = await createNewNotification(userId, notificationChannel, subject, body,time);
//         res.status(201).json(newNotification);

//         if (notificationChannel === NotificationChannel.EMAIL) {
//             await sendEmail(userId, subject, body);
//         } else if(notificationChannel === NotificationChannel.IN_APP) {
//             await sendNotificationViaSocket(userId,subject,body,time)
            
//         }else{
//             await sendEmail(userId, subject, body);
//             await sendNotificationViaSocket(userId,subject,body,time)
//         }

//         // Send event to Kafka for auditing
//         const eventData = { user: "1", entityName: "notification", entityId: newNotification.dataValues.id, action: 'createNotification', date: new Date(), moduleName: "ms-notification", description: generateDescription('createNotification', newNotification.dataValues.id) };
//         await producer.produce(eventData);

        
//     } catch (error: any) {
//         res.status(500).json({ error: error.message });
//     }
// };

export const getNotification = async (req: Request, res: Response) => {
    try {
        const notificationId = parseInt(req.params.notificationId);
        const notification = await getNotificationById(notificationId);
        res.json({ notification });
        
        
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// export const deleteNotification = async (req: Request, res: Response) => {
//     try {
//         const notificationId = parseInt(req.params.notificationId, 10);
//         await deleteNotificationById(notificationId);
//         res.json({ message: 'Notification deleted successfully' });
//         const eventData = { utilisateur: "1", entityName: "Notification", entityId: notificationId, action: 'deleteNotification', date: new Date(), moduleName: "ms-notification", description: generateDescription('deleteNotification', notificationId) };
//         await producer.produce(eventData);
        
//     } catch (error: any) {
//         res.status(500).json({ error: error.message });
//     }
// };
export const ReadNotification= async(req: Request, res: Response)=>{
    const notificationId = parseInt(req.params.id,10);

    try {
      await markNotificationAsRead(notificationId);
      res.status(200).json({ message: 'Notification marked as read successfully.' });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
