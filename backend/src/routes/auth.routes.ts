import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

// Public routes
router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);

// Password reset
router.post('/users/:id/send-password', AuthController.sendPassword);

export default router;