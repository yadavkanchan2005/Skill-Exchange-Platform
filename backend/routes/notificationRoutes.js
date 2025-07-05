

import express from 'express';
import { getUserNotifications, markNotificationAsRead, createNotification } from '../controllers/notificationController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getUserNotifications);
router.put('/:id/read', authMiddleware, markNotificationAsRead);
router.post('/', authMiddleware, createNotification);

export default router;
