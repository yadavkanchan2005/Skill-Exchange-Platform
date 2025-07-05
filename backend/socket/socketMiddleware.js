
import { Server } from 'socket.io';

let io;
const onlineUsers = new Map(); // userId => socket.id

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: 'http://localhost:3001',
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });

    io.on('connection', (socket) => {
        console.log('Socket connected:', socket.id);

        // Join personal room and track user
        socket.on('join', (userId) => {
            socket.join(userId);
            onlineUsers.set(userId, socket.id);
            console.log(`User ${userId} joined. Online users:`, [...onlineUsers.keys()]);

            // Broadcast online status
             socket.broadcast.emit('userOnline', userId);
        });

        // Typing indicator
        socket.on('typing', ({ recipientId, threadId, isTyping }) => {
            const recipientSocketId = onlineUsers.get(recipientId);
            if (recipientSocketId) {
                io.to(recipientSocketId).emit('typing', { threadId, isTyping });
            }
        });

        // New message
        socket.on('sendMessage', ({ message, recipientId }) => {
            const recipientSocketId = onlineUsers.get(recipientId);
            if (recipientSocketId) {
                io.to(recipientSocketId).emit('newMessage', message);
            }
        });

        // Message read
        socket.on('markAsRead', ({ threadId, userId }) => {
            const senderSocketId = onlineUsers.get(userId);
            if (senderSocketId) {
                io.to(senderSocketId).emit('messageRead', { threadId });
            }
        });

        // Handle disconnect
        socket.on('disconnect', () => {
            for (const [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    onlineUsers.delete(userId);
                    console.log(`User ${userId} disconnected`);
                    socket.broadcast.emit('userOffline', userId);
                    break;
                }
            }
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};
