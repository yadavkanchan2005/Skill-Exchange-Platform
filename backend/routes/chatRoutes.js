
import express from 'express';
import upload from '../middleware/uploadPictureMiddleware.js';
import { getChatMessages, sendChatMessage, getAcceptedExchangeChats,markMessagesAsRead } from '../controllers/chatController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/accepted', authMiddleware, getAcceptedExchangeChats);
router.get('/:requestId', authMiddleware, getChatMessages);
router.post('/:requestId', authMiddleware, upload.single('file'), sendChatMessage);
router.put('/:requestId/read', authMiddleware, markMessagesAsRead);

export default router;
