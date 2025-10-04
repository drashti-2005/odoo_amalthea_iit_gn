import { Router } from 'express';
import { ExpenseController } from '../controllers/expense.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// All expense routes require authentication
router.use(authenticateToken);

// Create expense
router.post('/', ExpenseController.createExpense);

// Submit expense for approval
router.post('/:id/submit', ExpenseController.submitExpense);

// Upload receipt
router.post('/:id/receipts', ExpenseController.uploadReceipt);

// Get expenses (with filtering)
router.get('/', ExpenseController.getExpenses);

// Manager approval endpoints (must be before /:id route)
router.get('/approval-requests', ExpenseController.getApprovalRequests);
router.put('/:expenseId/approve', ExpenseController.approveExpense);
router.put('/:expenseId/reject', ExpenseController.rejectExpense);

// Get expense by ID
router.get('/:id', ExpenseController.getExpenseById);

export default router;