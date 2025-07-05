import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadPictureMiddleware.js';
import { getUserProfile, updateUserProfile, deleteUserProfile, createProfile, uploadProfilePicture,getUserProgress} from '../controllers/userController.js';


const router = express.Router();


router.get('/profile', authMiddleware, getUserProfile);
router.post('/profile', authMiddleware, createProfile);
router.put('/upload-img', authMiddleware, upload.single('profilePicture'), uploadProfilePicture);
router.put('/profile', authMiddleware, updateUserProfile);
router.delete('/profile/delete', authMiddleware, deleteUserProfile);
router.get("/progress", authMiddleware, getUserProgress);



export default router;

