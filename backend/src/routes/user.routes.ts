import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticateToken, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();

// All user routes require authentication
router.use(authenticateToken);

// Create user (admin only)
router.post('/', requireAdmin, UserController.createUser);

// Get users (with role-based filtering)
router.get('/', UserController.getUsers);

// Get user by ID
router.get('/:id', UserController.getUserById);

// Update user
router.put('/:id', UserController.updateUser);

export default router;