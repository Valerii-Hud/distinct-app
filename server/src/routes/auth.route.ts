import express from 'express';
import {
  checkAuth,
  login,
  logout,
  signup,
  updateProfile,
  verify,
} from '../controllers/auth.controller';
import { protectRoute } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

router.post('/verify/:userId', verify);

router.get('/check', protectRoute, checkAuth);
router.put('/update-profile', protectRoute, updateProfile);

export default router;
