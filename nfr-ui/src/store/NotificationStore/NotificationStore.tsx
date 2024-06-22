import axios from "axios";
import { create } from "zustand";
import { axiosInstance2 } from "../../utils/AxiosInstance";

export type NotificationType = {
    id:number;
    userId: number;
    notificationChannel: string;
    subject: string;
    body: string;
    time: Date;
    seen: boolean;
    

}
type NotificationState = {
    notifications: NotificationType[],
    getAllNotifications: () => Promise<void>
    getNotificationById: (notificationId: number) => Promise<NotificationType>
    getNotificationByUserId: (userId: number) => Promise<void>

}
export const useNotificationStore = create<NotificationState>(
    (set) => (
        {
            notifications: [],
            getAllNotifications: async () => {
                try {
                    const response = await axiosInstance2.get('/notifications');
                    const notifications = response.data.notifications; // Access the "notifications" array from the response
                    set({ notifications }); 
                } catch (error) {
                    console.error('Failed to get notifications', error);
                }
            },
            getNotificationById: async (id) => {
                try {
                    const response = await axiosInstance2.get(`/notifications/${id}`);
                    const notif = response.data.notification;
                    return notif;
                } catch (error) {
                    console.error('Failed to get notification', error);
                }
            },
            getNotificationByUserId: async (userId) => {
                try {
                    const response = await axiosInstance2.get(`/users/${userId}/notifications`);
                    const notifs = response.data.notifications;
                    return notifs;
                } catch (error) {
                    console.error('Failed to get notification for user', error);
                }
            }
            
            
        }
    )
);
