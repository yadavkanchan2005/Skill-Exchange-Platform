import express from 'express';
import {
    createSkill,
    getAllSkills,
    updateSkill,
    deleteSkill,
    getMySkills,
    getSkillById,
    getExploreSkills,
    getQuestionsBySkill,
    addQuestionsToSkill,
    updateQuestionById,
    deleteQuestionById
} from '../controllers/skillController.js';

import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/explore', authMiddleware, getExploreSkills);
router.post('/', authMiddleware, createSkill);
router.get('/', getAllSkills);
router.put('/:id', authMiddleware, updateSkill);
router.delete('/:id', authMiddleware, deleteSkill);
router.get('/my-skills', authMiddleware, getMySkills);
router.get('/:id', authMiddleware, getSkillById);
router.post('/add-questions/:id', authMiddleware, addQuestionsToSkill);
router.get('/questions/:id', authMiddleware, getQuestionsBySkill);
router.put('/questions/:id',authMiddleware, updateQuestionById);
router.delete('/questions/:id',authMiddleware, deleteQuestionById);


export default router;
