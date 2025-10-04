import { Router } from 'express';
import { RuleController } from '../controllers/rule.controller';
import { authenticateToken, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();

// All approval rule routes require authentication
router.use(authenticateToken);

// Create approval rule (admin only)
router.post('/', requireAdmin, RuleController.createApprovalRule);

// Get approval rules
router.get('/', RuleController.getApprovalRules);

// Get approval rule by ID
router.get('/:id', RuleController.getApprovalRuleById);

// Update approval rule (admin only)
router.put('/:id', requireAdmin, RuleController.updateApprovalRule);

export default router;