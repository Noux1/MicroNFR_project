import nodemailer from 'nodemailer';
import Notification from '../models/Notification';
import User,{ UserAttributes } from '../models/User';

export const listNotificationsForUser = async (userId: string) => {
    try {
        
        const userExists = await User.findByPk(userId);
        if (!userExists) {
            console.log(`User with ID ${userId} not found`);
            return null; 
        }
        const notifications = await Notification.findAll({ where: { userId } });
        return notifications;
    } catch (error) {
        console.error('Error fetching notifications for user:', error);
        return null; 
    }
};


export const getUserEmailById = async (userId: string): Promise<string> => {
    try {
        const user = await User.findByPk(userId) as UserAttributes | null;

        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
        }

        return user.email;
    } catch (error) {
        console.error('Error fetching user email:', error);
        throw new Error('Failed to fetch user email');
    }
};
export async function sendEmail(userId: string, subject: string, text: string): Promise<void> {
  try {
      const userEmail = await getUserEmailById(userId);
      // Create a transporter object using SMTP
      const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
              user: process.env.EMAIL_USER || '',
              pass: process.env.EMAIL_PASS || '',
          },
      });

      
      await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: userEmail,
          subject,
          text,
      });

      console.log('Email sent successfully');
  } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
  }
}

export const createUser = async (userData: UserAttributes): Promise<UserAttributes> => {
    try {
        const user = await User.create(userData);
        return user.toJSON();
    } catch (error) {
        throw new Error('Error creating user: ' + error);
    }
};
export const deleteUser = async (userId: string): Promise<void> => {
    try {
        const user = await User.findByPk(userId);

        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
        }

        await user.destroy();
        console.log(`User with ID ${userId} deleted successfully`);
    } catch (error) {
        console.error('Error deleting user:', error);
        throw new Error('Failed to delete user');
    }
};
export const updateUser = async (userId: string, updatedData: Partial<UserAttributes>): Promise<UserAttributes | null> => {
    try {
        const user = await User.findByPk(userId);

        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
        }

        await user.update(updatedData);
        return user.toJSON() as UserAttributes;
    } catch (error) {
        console.error('Error updating user:', error);
        throw new Error('Failed to update user');
    }
};