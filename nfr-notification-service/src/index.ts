import express from 'express';
import http, { Server } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import App from './services/expressApp';
import { connectToDatabase } from './config/database';
import { setupSocket } from '../src/config/setupSocket';
import { consume as consumeUserEvents } from './events/UserConsumer'; 
import { consume as consumeNotificationEvents } from './events/NotifConsumer'; 
const eurekaHelper = require('./eureka-helper'); // Assuming eureka-helper registers with Eureka

let io: any;

const StartServer = async () => {
    const app = express();
    await connectToDatabase();
    await App(app);

    // Start Kafka consumer for user events
    consumeUserEvents();
    // Start Kafka consumer for notification events
    consumeNotificationEvents();

    const server = http.createServer(app);
    io = new SocketIOServer(server
        , {
        cors: {
            origin: '*',
        }
    }
);
    setupSocket(io);

    const PORT = process.env.PORT || 3030;
    eurekaHelper.registerWithEureka('ms-notifications', PORT);
    server.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
};

StartServer();

export { io }; 
