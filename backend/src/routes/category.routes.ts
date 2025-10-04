import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';
import { authenticateToken, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();

// All category routes require authentication
router.use(authenticateToken);

// Create category (admin only)
router.post('/', requireAdmin, CategoryController.createCategory);

// Get categories
router.get('/', CategoryController.getCategories);

// Get category by ID
router.get('/:id', CategoryController.getCategoryById);

// Update category (admin only)
router.put('/:id', requireAdmin, CategoryController.updateCategory);

// Delete category (admin only)
router.delete('/:id', requireAdmin, CategoryController.deleteCategory);

export default router;