
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import exchangeRoutes from './routes/exchangeRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import chatRoutes from "./routes/chatRoutes.js";





const app = express();


app.use(cors({
    origin: 'https://skill-exchange-platform-frontend.onrender.com',
    credentials: true,
}));
app.use(express.json());


app.use('/uploads', express.static('uploads')); 

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/skills', skillRoutes);
app.use('/exchanges', exchangeRoutes);
app.use('/notifications', notificationRoutes);
app.use('/chat', chatRoutes);




export default app;
