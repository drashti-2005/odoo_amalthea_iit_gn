import { Response } from 'express';
import { ExpenseApprovalLog, ApprovalStatus } from '../models/expenseApprovalLog.model';
import { Expense, ExpenseStatus } from '../models/expense.model';
import { ApprovalRule, ApprovalType } from '../models/approvalRule.model';
import { UserRole } from '../models/user.model';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export class ApprovalController {
  static async getPendingApprovals(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      // Only managers and admins can view pending approvals
      if (req.user.role === UserRole.EMPLOYEE) {
        res.status(403).json({
          success: false,
          message: 'Only managers and admins can view pending approvals'
        });
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      // Find pending approval logs for this user
      const pendingApprovals = await ExpenseApprovalLog.find({
        approverId: req.user.userId,
        status: ApprovalStatus.PENDING
      })
        .populate({
          path: 'expenseId',
          populate: [
            { path: 'userId', select: 'name email' },
            { path: 'categoryId', select: 'name' }
          ]
        })
        .populate('approvalRuleId', 'name approvalType')
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limit);

      const totalApprovals = await ExpenseApprovalLog.countDocuments({
        approverId: req.user.userId,
        status: ApprovalStatus.PENDING
      });

      const totalPages = Math.ceil(totalApprovals / limit);

      res.status(200).json({
        success: true,
        message: 'Pending approvals retrieved successfully',
        data: {
          approvals: pendingApprovals,
          pagination: {
            currentPage: page,
            totalPages,
            totalApprovals,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to retrieve pending approvals'
      });
    }
  }

  static async approveExpense(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { log_id } = req.params;
      const { comments } = req.body;

      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      // Find the approval log
      const approvalLog = await ExpenseApprovalLog.findOne({
        _id: log_id,
        approverId: req.user.userId,
        status: ApprovalStatus.PENDING
      });

      if (!approvalLog) {
        res.status(404).json({
          success: false,
          message: 'Approval log not found or already processed'
        });
        return;
      }

      // Get the expense and approval rule
      const expense = await Expense.findById(approvalLog.expenseId);
      const approvalRule = await ApprovalRule.findById(approvalLog.approvalRuleId);

      if (!expense || !approvalRule) {
        res.status(404).json({
          success: false,
          message: 'Expense or approval rule not found'
        });
        return;
      }

      // Update approval log
      approvalLog.status = ApprovalStatus.APPROVED;
      approvalLog.comments = comments;
      approvalLog.approvedAt = new Date();
      await approvalLog.save();

      // Check if this completes the approval process
      await this.checkAndUpdateExpenseStatus(expense._id, approvalRule);

      const updatedExpense = await Expense.findById(expense._id)
        .populate('categoryId', 'name')
        .populate('userId', 'name email');

      res.status(200).json({
        success: true,
        message: 'Expense approved successfully',
        data: {
          expense: updatedExpense,
          approvalLog
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to approve expense'
      });
    }
  }

  static async rejectExpense(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { log_id } = req.params;
      const { comments } = req.body;

      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      if (!comments || comments.trim().length === 0) {
        res.status(400).json({
          success: false,
          message: 'Rejection reason is required'
        });
        return;
      }

      // Find the approval log
      const approvalLog = await ExpenseApprovalLog.findOne({
        _id: log_id,
        approverId: req.user.userId,
        status: ApprovalStatus.PENDING
      });

      if (!approvalLog) {
        res.status(404).json({
          success: false,
          message: 'Approval log not found or already processed'
        });
        return;
      }

      // Update approval log
      approvalLog.status = ApprovalStatus.REJECTED;
      approvalLog.comments = comments;
      approvalLog.rejectedAt = new Date();
      await approvalLog.save();

      // Reject the entire expense immediately
      const expense = await Expense.findByIdAndUpdate(
        approvalLog.expenseId,
        {
          status: ExpenseStatus.REJECTED,
          rejectedAt: new Date(),
          rejectionReason: comments
        },
        { new: true }
      )
        .populate('categoryId', 'name')
        .populate('userId', 'name email');

      // Update all other pending approval logs for this expense
      await ExpenseApprovalLog.updateMany(
        {
          expenseId: approvalLog.expenseId,
          status: ApprovalStatus.PENDING
        },
        {
          status: ApprovalStatus.REJECTED,
          comments: 'Rejected by another approver',
          rejectedAt: new Date()
        }
      );

      res.status(200).json({
        success: true,
        message: 'Expense rejected successfully',
        data: {
          expense,
          approvalLog
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to reject expense'
      });
    }
  }

  static async getApprovalHistory(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { expenseId } = req.params;

      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      // Verify access to expense
      const expense = await Expense.findOne({
        _id: expenseId,
        companyId: req.user.companyId
      });

      if (!expense) {
        res.status(404).json({
          success: false,
          message: 'Expense not found'
        });
        return;
      }

      // Check permissions - users can only see their own expenses unless they're managers/admins
      if (req.user.role === UserRole.EMPLOYEE && expense.userId !== req.user.userId) {
        res.status(403).json({
          success: false,
          message: 'Insufficient permissions'
        });
        return;
      }

      const approvalLogs = await ExpenseApprovalLog.find({ expenseId })
        .populate('approverId', 'name email role')
        .populate('approvalRuleId', 'name approvalType')
        .sort({ order: 1, createdAt: 1 });

      res.status(200).json({
        success: true,
        message: 'Approval history retrieved successfully',
        data: { approvalLogs }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to retrieve approval history'
      });
    }
  }

  private static async checkAndUpdateExpenseStatus(expenseId: string, approvalRule: any): Promise<void> {
    const allLogs = await ExpenseApprovalLog.find({ expenseId }).sort({ order: 1 });

    if (approvalRule.approvalType === ApprovalType.SEQUENTIAL) {
      // Sequential: Check if current order is approved, then check if all previous orders are approved
      const currentApprovedLog = allLogs.find(log => log.status === ApprovalStatus.APPROVED);
      if (currentApprovedLog) {
        const currentOrder = currentApprovedLog.order;
        const previousLogs = allLogs.filter(log => log.order < currentOrder);
        const allPreviousApproved = previousLogs.every(log => log.status === ApprovalStatus.APPROVED);
        
        if (allPreviousApproved) {
          const nextPendingLog = allLogs.find(log => 
            log.order > currentOrder && log.status === ApprovalStatus.PENDING
          );
          
          if (!nextPendingLog) {
            // All approvals complete
            await Expense.findByIdAndUpdate(expenseId, {
              status: ExpenseStatus.APPROVED,
              approvedAt: new Date()
            });
          }
        }
      }
    } else {
      // Parallel: Check if all logs are approved
      const allApproved = allLogs.every(log => log.status === ApprovalStatus.APPROVED);
      if (allApproved && allLogs.length > 0) {
        await Expense.findByIdAndUpdate(expenseId, {
          status: ExpenseStatus.APPROVED,
          approvedAt: new Date()
        });
      }
    }
  }
}