import io from 'socket.io-client';

const socket = io('http://localhost:3030');

export const setupSocket = () => {
    socket.on('connect', () => {
        console.log('Connected to server.');
    });
    

    socket.on('disconnect', () => {
        console.log('Disconnected from server.');
    });



    return socket; 
};

