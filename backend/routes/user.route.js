import express from 'express';
import { signupUser, loginUser, logoutUser, getMe } from '../controllers/user.controller.js';
import authMiddleware  from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', authMiddleware, getMe);


export default router;
