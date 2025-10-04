import mongoose, { Document, Schema } from 'mongoose';

export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export interface IExpenseApprovalLog extends Document {
  _id: string;
  expenseId: string;
  approvalRuleId: string;
  approverId: string;
  order: number;
  status: ApprovalStatus;
  comments?: string;
  approvedAt?: Date;
  rejectedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const expenseApprovalLogSchema = new Schema<IExpenseApprovalLog>({
  expenseId: {
    type: String,
    required: true,
    ref: 'Expense'
  },
  approvalRuleId: {
    type: String,
    required: true,
    ref: 'ApprovalRule'
  },
  approverId: {
    type: String,
    required: true,
    ref: 'User'
  },
  order: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: Object.values(ApprovalStatus),
    required: true,
    default: ApprovalStatus.PENDING
  },
  comments: {
    type: String,
    trim: true,
    maxlength: 500
  },
  approvedAt: {
    type: Date
  },
  rejectedAt: {
    type: Date
  }
}, {
  timestamps: true,
  versionKey: false
});

// Indexes
expenseApprovalLogSchema.index({ expenseId: 1, order: 1 });
expenseApprovalLogSchema.index({ approverId: 1, status: 1 });
expenseApprovalLogSchema.index({ approvalRuleId: 1 });

export const ExpenseApprovalLog = mongoose.model<IExpenseApprovalLog>('ExpenseApprovalLog', expenseApprovalLogSchema);