
import express from 'express';
import { registerUser, loginUser, verifyUser, forgotPassword, resetPassword, getMe,googleLogin} from '../controllers/authController.js';
const router = express.Router();
import authMiddleware from '../middleware/authMiddleware.js';

router.post('/signup', registerUser);
router.post('/verify', verifyUser);
router.post('/login', loginUser);
router.post('/forgot', forgotPassword);
router.post('/reset', resetPassword);
router.get('/me', authMiddleware, getMe);
router.post('/google-login',  googleLogin);




export default router;
