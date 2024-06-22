import { producer } from './../controllers/notificationController';
import { NotificationChannel } from '../enums/NotificationChannel';
import Notification from '../models/Notification';
import User from '../models/User';
import { io } from '../index';
import { sendEmail } from './userService';



export const listAllNotifications = async () => {
    try {
        // Query the database to get all notifications for all users
        const notifications = await Notification.findAll();
        return notifications;
    } catch (error) {
        throw new Error('Error fetching notifications');
    }
};
export const listNotificationsForUser = async (userId: number) => {
    try {
      const notifications = await Notification.findAll({ where: { userId } });
      return notifications;
    } catch (error) {
      throw new Error('Error fetching notifications for user');
    }
  };
export const getNotificationById = async (notificationId: number) => {
    try {
        const notification = await Notification.findByPk(notificationId, {
            include: {
              model: User,
              as: 'user' // Assuming 'user' is the alias used in the association
            }
          });
          
        if (!notification) {
            throw new Error('Notification not found');
        }
        return notification;
    } catch (error) {
        throw new Error('Error fetching notification');
    }
};

export const deleteNotificationById = async (notificationId: number) => {
    try {
        const notification = await Notification.findByPk(notificationId);
        if (!notification) {
            throw new Error('Notification not found');
        }
        await notification.destroy();
        return true;
    
    } catch (error) {
        throw new Error('Error deleting notification');
    }
};
export const sendNotificationViaSocket = async (userId: string, notification: any) => {
  await io.to(userId).emit('notification', notification);
};
export const createNewNotification = async (userId: string, notificationChannel: NotificationChannel, subject: string, body: string, time: Date,utilisateur: string) => {
  try {
      const newNotification = await Notification.create({ userId, notificationChannel, subject, body, time });
        if (notificationChannel === NotificationChannel.EMAIL) {
          await sendEmail(userId, subject, body);
      } else if (notificationChannel === NotificationChannel.IN_APP) {
          await sendNotificationViaSocket(userId,newNotification);
      } else {
          await sendEmail(userId, subject, body);
          await sendNotificationViaSocket(userId, newNotification);
      }
      // Send event to Kafka for auditing
      const eventData = { utilisateur: utilisateur, entityName: "notification", entityId: newNotification.dataValues.id, action: 'createNotification', date: new Date(), moduleName: "ms-notification", description: `To notify about ${body}` };
      await producer.produce(eventData);

      
  } catch (error) {
      console.error('Error creating notification:', error);
      throw new Error('Error creating notification');
  }
};

export const markNotificationAsRead = async (notificationId: number)=>{
    try {
      const notification = await Notification.findByPk(notificationId);
      if (notification) {
        await notification.update({ seen: true });
      } else {
        throw new Error(`Notification with id ${notificationId} not found.`);
      }
    } catch (error) {
      throw error;
    }
  }


