import { Console } from 'console';
import { Server, Socket } from 'socket.io';

export const setupSocket = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        socket.on('join-room', (userId) => {
            socket.join(userId);
            console.log(`user ${userId} join to room`);
          });
    });
};
