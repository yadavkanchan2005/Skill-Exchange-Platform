
import {
    listAllUsers,
    removeUser,
    toggleUserStatus,
    listAllSkills,
    removeSkill,
    listAllExchangeRequests,
    removeExchangeRequest
} from '../controllers/adminController.js';

import { protect } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/isAdmin.js';

const router = express.Router();


router.use(protect, isAdmin);

// User Routes
router.get('/users', listAllUsers);
router.delete('/users/:id', removeUser);
router.patch('/users/:id/toggle', toggleUserStatus);

// Skill Routes
router.get('/skills', listAllSkills);
router.delete('/skills/:id', removeSkill);

// Exchange Request Routes
router.get('/exchanges', listAllExchangeRequests);
router.delete('/exchanges/:id', removeExchangeRequest);

export default router;
