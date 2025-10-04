import { Router } from 'express';
import { UserController } from '../controllers/enhanced-user.controller';
import { authenticateToken, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();

// All user routes require authentication
router.use(authenticateToken);

// Create user (admin only)
router.post('/', requireAdmin, UserController.createUser);

// Get users (with pagination and filtering)
router.get('/', UserController.getUsers);

// Get managers (for dropdown selections)
router.get('/managers', UserController.getManagers);

// Get user by ID
router.get('/:id', UserController.getUserById);

// Update user
router.put('/:id', UserController.updateUser);

// Reset user password (admin only)
router.post('/:id/reset-password', requireAdmin, UserController.resetUserPassword);

export default router;