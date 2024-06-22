import { Request, Response } from 'express';
import { listNotificationsForUser, sendEmail, createUser, deleteUser,updateUser } from '../services/userService';
import { producer } from './notificationController';
import { UserAttributes } from '../models/User';
import { io } from '../index';

export const getNotificationsForUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const notifications = await listNotificationsForUser(userId);

        res.json({ notifications });

        
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};


export async function sendEmailNotification(req: Request, res: Response): Promise<void> {
    const userId = req.params.userId; 
    const { subject, body } = req.body;

    try {
        await sendEmail(userId, subject, body);
        res.status(200).json({ message: 'Email sent successfully' });
        await producer.produce({
            utilisateur: "1",
            entityName: "notification",
            entityId: 1,
            action: 'sendEmailNotification',
            date: new Date(),
            moduleName: "ms-notification",
            description: "description"
        });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
}

export const addUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userData: UserAttributes = req.body;
        const newUser = await createUser(userData);

        // Emit event to join the user to a room
        io.emit('joinRoom', newUser.uuid);

        res.status(201).json(newUser);
    } catch (error:any) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteUserById = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.userId;

    try {
        await deleteUser(userId);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};

export const updateUserById = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.userId;
    const updatedData: Partial<UserAttributes> = req.body;

    try {
        const updatedUser = await updateUser(userId, updatedData);
        res.status(200).json(updatedUser);
    } catch (error: any) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: error.message });
    }
};