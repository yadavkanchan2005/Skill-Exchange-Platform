import express from 'express';
import {
    sendExchangeRequest,
    acceptExchangeRequest,
    rejectExchangeRequest,
    completeExchangeRequest,
    getMyExchangeRequests,
    getExchangeRequestCounts,
    submitAnswers,
    getQuizResult,
    getPassedSkillsForUser,
} from '../controllers/exchangeController.js';

import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, sendExchangeRequest);
router.get('/', authMiddleware, getMyExchangeRequests);
router.get('/counts', authMiddleware, getExchangeRequestCounts);
router.put('/:id/accept', authMiddleware, acceptExchangeRequest);
router.put('/:id/reject', authMiddleware, rejectExchangeRequest);
router.put('/:id/complete', authMiddleware, completeExchangeRequest);
router.get('/:requestId/quiz-result', authMiddleware, getQuizResult);
router.post('/submit-answers', authMiddleware, submitAnswers);
router.get('/quiz/passed', authMiddleware, getPassedSkillsForUser);


export default router;
