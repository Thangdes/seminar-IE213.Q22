import express from 'express';
import { changePassword, getMe, updateMe } from '../controllers/userController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/me', requireAuth, getMe);
router.patch('/me', requireAuth, updateMe);
router.patch('/me/password', requireAuth, changePassword);

export default router;
