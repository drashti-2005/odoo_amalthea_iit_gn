import mongoose, { Document, Schema } from 'mongoose';

export enum ExpenseStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PAID = 'paid'
}

export interface IExpense extends Document {
  _id: string;
  companyId: string;
  userId: string;
  categoryId: string;
  title: string;
  description?: string;
  amount: number;
  currency: string;
  exchangeRate?: number;
  amountInBaseCurrency?: number;
  expenseDate: Date;
  status: ExpenseStatus;
  approvalRuleId?: string;
  submittedAt?: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const expenseSchema = new Schema<IExpense>({
  companyId: {
    type: String,
    required: true,
    ref: 'Company'
  },
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  categoryId: {
    type: String,
    required: true,
    ref: 'Category'
  },
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  amount: {
    type: Number,
    required: true,
    min: 0.01
  },
  currency: {
    type: String,
    required: true,
    uppercase: true,
    enum: ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY']
  },
  exchangeRate: {
    type: Number,
    min: 0
  },
  amountInBaseCurrency: {
    type: Number,
    min: 0
  },
  expenseDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(value: Date) {
        return value <= new Date();
      },
      message: 'Expense date cannot be in the future'
    }
  },
  status: {
    type: String,
    enum: Object.values(ExpenseStatus),
    required: true,
    default: ExpenseStatus.DRAFT
  },
  approvalRuleId: {
    type: String,
    ref: 'ApprovalRule'
  },
  submittedAt: {
    type: Date
  },
  approvedAt: {
    type: Date
  },
  rejectedAt: {
    type: Date
  },
  rejectionReason: {
    type: String,
    trim: true,
    maxlength: 500
  }
}, {
  timestamps: true,
  versionKey: false
});

// Indexes
expenseSchema.index({ companyId: 1, status: 1 });
expenseSchema.index({ userId: 1, status: 1 });
expenseSchema.index({ categoryId: 1 });
expenseSchema.index({ approvalRuleId: 1 });
expenseSchema.index({ expenseDate: -1 });

export const Expense = mongoose.model<IExpense>('Expense', expenseSchema);