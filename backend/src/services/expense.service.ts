import { Expense, ExpenseStatus } from '../models/expense.model';
import { ApprovalRule } from '../models/approvalRule.model';
import { ApproverAssignment } from '../models/approverAssignment.model';
import { ExpenseApprovalLog, ApprovalStatus } from '../models/expenseApprovalLog.model';
import { Company } from '../models/company.model';
import { convertCurrency } from '../utils/currency';

export class ExpenseService {
  static async getExpensesByUser(
    userId: string,
    companyId: string,
    filters: {
      status?: ExpenseStatus;
      page?: number;
      limit?: number;
    } = {}
  ): Promise<{ expenses: any[]; total: number }> {
    const { status, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const filter: any = {
      userId,
      companyId
    };

    if (status) {
      filter.status = status;
    }

    const expenses = await Expense.find(filter)
      .populate('categoryId', 'name')
      .populate('approvalRuleId', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Expense.countDocuments(filter);

    return { expenses, total };
  }

  static async getExpensesByCompany(
    companyId: string,
    filters: {
      status?: ExpenseStatus;
      userId?: string;
      page?: number;
      limit?: number;
    } = {}
  ): Promise<{ expenses: any[]; total: number }> {
    const { status, userId, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const filter: any = { companyId };

    if (status) {
      filter.status = status;
    }

    if (userId) {
      filter.userId = userId;
    }

    const expenses = await Expense.find(filter)
      .populate('categoryId', 'name')
      .populate('userId', 'name email')
      .populate('approvalRuleId', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Expense.countDocuments(filter);

    return { expenses, total };
  }

  static async findApplicableApprovalRule(
    companyId: string,
    amount: number,
    baseCurrency: string,
    expenseCurrency: string,
    categoryId: string
  ): Promise<any | null> {
    // Convert amount to base currency if needed
    let amountInBaseCurrency = amount;
    if (expenseCurrency !== baseCurrency) {
      amountInBaseCurrency = await convertCurrency(amount, expenseCurrency, baseCurrency);
    }

    const approvalRule = await ApprovalRule.findOne({
      companyId,
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
            { categoryIds: { $in: [categoryId] } },
            { categoryIds: { $size: 0 } },
            { categoryIds: null }
          ]
        }
      ],
      isActive: true
    }).sort({ minAmount: -1 });

    return approvalRule;
  }

  static async createApprovalLogs(
    expenseId: string,
    approvalRuleId: string
  ): Promise<void> {
    const approvers = await ApproverAssignment.find({
      approvalRuleId,
      isActive: true
    }).sort({ order: 1 });

    const approvalLogs = approvers.map(approver => ({
      expenseId,
      approvalRuleId,
      approverId: approver.userId,
      order: approver.order,
      status: ApprovalStatus.PENDING
    }));

    await ExpenseApprovalLog.insertMany(approvalLogs);
  }

  static async getExpenseApprovalStatus(expenseId: string): Promise<{
    totalApprovers: number;
    completedApprovals: number;
    pendingApprovals: number;
    isCompleted: boolean;
  }> {
    const logs = await ExpenseApprovalLog.find({ expenseId });

    const totalApprovers = logs.length;
    const completedApprovals = logs.filter(log => 
      log.status === ApprovalStatus.APPROVED || log.status === ApprovalStatus.REJECTED
    ).length;
    const pendingApprovals = logs.filter(log => 
      log.status === ApprovalStatus.PENDING
    ).length;

    const isCompleted = pendingApprovals === 0 && totalApprovers > 0;

    return {
      totalApprovers,
      completedApprovals,
      pendingApprovals,
      isCompleted
    };
  }

  static async getExpensesByManager(
    managerId: string,
    companyId: string,
    status?: ExpenseStatus
  ): Promise<any[]> {
    // Get all users under this manager
    const filter: any = {
      companyId,
      managerId
    };

    if (status) {
      filter.status = status;
    }

    return Expense.find(filter)
      .populate('categoryId', 'name')
      .populate('userId', 'name email')
      .populate('approvalRuleId', 'name')
      .sort({ createdAt: -1 });
  }

  static async calculateExpenseStatistics(
    companyId: string,
    userId?: string
  ): Promise<{
    totalExpenses: number;
    approvedExpenses: number;
    pendingExpenses: number;
    rejectedExpenses: number;
    totalAmount: number;
    approvedAmount: number;
  }> {
    const filter: any = { companyId };
    if (userId) {
      filter.userId = userId;
    }

    const pipeline = [
      { $match: filter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amountInBaseCurrency' }
        }
      }
    ];

    const results = await Expense.aggregate(pipeline);

    const stats = {
      totalExpenses: 0,
      approvedExpenses: 0,
      pendingExpenses: 0,
      rejectedExpenses: 0,
      totalAmount: 0,
      approvedAmount: 0
    };

    results.forEach(result => {
      stats.totalExpenses += result.count;
      stats.totalAmount += result.totalAmount || 0;

      switch (result._id) {
        case ExpenseStatus.APPROVED:
          stats.approvedExpenses = result.count;
          stats.approvedAmount = result.totalAmount || 0;
          break;
        case ExpenseStatus.SUBMITTED:
          stats.pendingExpenses = result.count;
          break;
        case ExpenseStatus.REJECTED:
          stats.rejectedExpenses = result.count;
          break;
      }
    });

    return stats;
  }
}