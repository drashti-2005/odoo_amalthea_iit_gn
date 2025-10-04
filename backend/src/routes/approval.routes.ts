import { Router } from 'express';
import { ApprovalController } from '../controllers/approval.controller';
import { authenticateToken, requireManagerOrAdmin } from '../middlewares/auth.middleware';

const router = Router();

// All approval routes require authentication
router.use(authenticateToken);

// Get pending approvals (managers and admins only)
router.get('/pending', requireManagerOrAdmin, ApprovalController.getPendingApprovals);

// Approve expense
router.post('/:log_id/approve', requireManagerOrAdmin, ApprovalController.approveExpense);

// Reject expense
router.post('/:log_id/reject', requireManagerOrAdmin, ApprovalController.rejectExpense);

// Get approval history for an expense
router.get('/history/:expenseId', ApprovalController.getApprovalHistory);

export default router;