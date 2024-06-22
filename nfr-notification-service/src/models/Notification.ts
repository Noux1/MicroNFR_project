import { DataTypes, Model } from 'sequelize';
import { NotificationChannel } from '../enums/NotificationChannel';
import { sequelize } from '../config/database';
import User from './User';

interface NotificationAttributes {
    id?: number;
    userId: string; // Change the type to string for UUID
    notificationChannel: NotificationChannel;
    subject: string;
    body: string;
    time: Date;
    seen?: boolean; 
}

const Notification = sequelize.define<Model<NotificationAttributes>>('Notification', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.STRING, 
        allowNull: false,
        references: {
            model: User,
            key: 'uuid', 
        },
    },
    notificationChannel: {
        type: DataTypes.ENUM(...Object.values(NotificationChannel)),
        allowNull: false
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false
    },
    body: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    time: {
        type: DataTypes.DATE,
        allowNull: false,
        
    },
    seen: {
        type: DataTypes.BOOLEAN, 
        allowNull: false,
        defaultValue: false 
    },
}, {
    modelName: 'Notification',
});
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default Notification;
