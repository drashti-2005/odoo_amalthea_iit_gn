import { Response } from 'express';
import { Expense, ExpenseStatus } from '../models/expense.model';
import { Receipt } from '../models/receipt.model';
import { ApprovalRule } from '../models/approvalRule.model';
import { ApproverAssignment } from '../models/approverAssignment.model';
import { ExpenseApprovalLog, ApprovalStatus } from '../models/expenseApprovalLog.model';
import { Company } from '../models/company.model';
import { Category } from '../models/category.model';
import { convertCurrency } from '../utils/currency';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export class ExpenseController {
  static async createExpense(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const {
        categoryId,
        title,
        description,
        amount,
        currency,
        expenseDate
      } = req.body;

      // Validate required fields
      if (!categoryId || !title || !amount || !currency || !expenseDate) {
        res.status(400).json({
          success: false,
          message: 'CategoryId, title, amount, currency, and expenseDate are required'
        });
        return;
      }

      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      // Validate category exists in user's company
      const category = await Category.findOne({
        _id: categoryId,
        companyId: req.user.companyId,
        isActive: true
      });

      if (!category) {
        res.status(400).json({
          success: false,
          message: 'Invalid category'
        });
        return;
      }

      // Create expense in draft status
      const expense = new Expense({
        companyId: req.user.companyId,
        userId: req.user.userId,
        categoryId,
        title,
        description,
        amount,
        currency,
        expenseDate: new Date(expenseDate),
        status: ExpenseStatus.DRAFT
      });

      await expense.save();

      const populatedExpense = await Expense.findById(expense._id)
        .populate('categoryId', 'name')
        .populate('userId', 'name email');

      res.status(201).json({
        success: true,
        message: 'Expense created successfully',
        data: { expense: populatedExpense }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create expense'
      });
    }
  }

  static async submitExpense(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      // Find expense
      const expense = await Expense.findOne({
        _id: id,
        userId: req.user.userId,
        status: ExpenseStatus.DRAFT
      });

      if (!expense) {
        res.status(404).json({
          success: false,
          message: 'Expense not found or already submitted'
        });
        return;
      }

      // Get company details for base currency
      const company = await Company.findById(req.user.companyId);
      if (!company) {
        res.status(400).json({
          success: false,
          message: 'Company not found'
        });
        return;
      }

      // Convert to base currency if different
      let exchangeRate = 1;
      let amountInBaseCurrency = expense.amount;

      if (expense.currency !== company.baseCurrency) {
        try {
          amountInBaseCurrency = await convertCurrency(
            expense.amount,
            expense.currency,
            company.baseCurrency
          );
          exchangeRate = amountInBaseCurrency / expense.amount;
        } catch (error) {
          res.status(400).json({
            success: false,
            message: 'Failed to fetch exchange rate'
          });
          return;
        }
      }

      // Find applicable approval rule
      const approvalRule = await ApprovalRule.findOne({
        companyId: req.user.companyId,
        minAmount: { $lte: amountInBaseCurrency },
        $and: [
          {
            $or: [
              { maxAmount: { $gte: amountInBaseCurrency } },
              { maxAmount: null }
            ]
          },
          {
            $or: [
              { categoryIds: { $in: [expense.categoryId] } },
              { categoryIds: { $size: 0 } },
              { categoryIds: null }
            ]
          }
        ],
        isActive: true
      }).sort({ minAmount: -1 });

      // Update expense
      expense.status = ExpenseStatus.SUBMITTED;
      expense.submittedAt = new Date();
      expense.exchangeRate = exchangeRate;
      expense.amountInBaseCurrency = amountInBaseCurrency;
      expense.approvalRuleId = approvalRule?._id;

      await expense.save();

      // Create approval logs if approval rule exists
      if (approvalRule) {
        const approvers = await ApproverAssignment.find({
          approvalRuleId: approvalRule._id,
          isActive: true
        }).sort({ order: 1 });

        const approvalLogs = approvers.map(approver => ({
          expenseId: expense._id,
          approvalRuleId: approvalRule._id,
          approverId: approver.userId,
          order: approver.order,
          status: ApprovalStatus.PENDING
        }));

        await ExpenseApprovalLog.insertMany(approvalLogs);
      } else {
        // Auto-approve if no approval rule
        expense.status = ExpenseStatus.APPROVED;
        expense.approvedAt = new Date();
        await expense.save();
      }

      const populatedExpense = await Expense.findById(expense._id)
        .populate('categoryId', 'name')
        .populate('userId', 'name email')
        .populate('approvalRuleId', 'name approvalType');

      res.status(200).json({
        success: true,
        message: 'Expense submitted successfully',
        data: { expense: populatedExpense }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to submit expense'
      });
    }
  }

  static async uploadReceipt(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      // Find expense
      const expense = await Expense.findOne({
        _id: id,
        userId: req.user.userId
      });

      if (!expense) {
        res.status(404).json({
          success: false,
          message: 'Expense not found'
        });
        return;
      }

      // In a real application, you would use multer middleware to handle file upload
      // For this example, we'll simulate file upload
      const { fileName, originalName, mimeType, fileSize, filePath } = req.body;

      if (!fileName || !originalName || !mimeType || !fileSize || !filePath) {
        res.status(400).json({
          success: false,
          message: 'File upload information is required'
        });
        return;
      }

      // Create receipt record
      const receipt = new Receipt({
        expenseId: expense._id,
        fileName,
        originalName,
        mimeType,
        fileSize,
        filePath,
        uploadedAt: new Date()
      });

      await receipt.save();

      res.status(201).json({
        success: true,
        message: 'Receipt uploaded successfully',
        data: { receipt }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to upload receipt'
      });
    }
  }

  static async getExpenses(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;
      const status = req.query.status as ExpenseStatus;

      const filter: any = {
        companyId: req.user.companyId
      };

      // Users can only see their own expenses unless they're managers/admins
      if (req.user.role === 'employee') {
        filter.userId = req.user.userId;
      }

      if (status && Object.values(ExpenseStatus).includes(status)) {
        filter.status = status;
      }

      const expenses = await Expense.find(filter)
        .populate('categoryId', 'name')
        .populate('userId', 'name email')
        .populate('approvalRuleId', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const totalExpenses = await Expense.countDocuments(filter);
      const totalPages = Math.ceil(totalExpenses / limit);

      // Get receipts for each expense
      const expensesWithReceipts = await Promise.all(
        expenses.map(async (expense) => {
          const receipts = await Receipt.find({ expenseId: expense._id });
          return {
            ...expense.toJSON(),
            receipts
          };
        })
      );

      res.status(200).json({
        success: true,
        message: 'Expenses retrieved successfully',
        data: {
          expenses: expensesWithReceipts,
          pagination: {
            currentPage: page,
            totalPages,
            totalExpenses,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to retrieve expenses'
      });
    }
  }

  static async getExpenseById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const filter: any = {
        _id: id,
        companyId: req.user.companyId
      };

      // Users can only see their own expenses unless they're managers/admins
      if (req.user.role === 'employee') {
        filter.userId = req.user.userId;
      }

      const expense = await Expense.findOne(filter)
        .populate('categoryId', 'name')
        .populate('userId', 'name email')
        .populate('approvalRuleId', 'name approvalType');

      if (!expense) {
        res.status(404).json({
          success: false,
          message: 'Expense not found'
        });
        return;
      }

      // Get receipts and approval logs
      const receipts = await Receipt.find({ expenseId: id });
      const approvalLogs = await ExpenseApprovalLog.find({ expenseId: id })
        .populate('approverId', 'name email')
        .sort({ order: 1 });

      res.status(200).json({
        success: true,
        message: 'Expense retrieved successfully',
        data: {
          expense,
          receipts,
          approvalLogs
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to retrieve expense'
      });
    }
  }
}