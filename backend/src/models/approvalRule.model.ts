import mongoose, { Document, Schema } from 'mongoose';

export enum ApprovalType {
  SEQUENTIAL = 'sequential',
  PARALLEL = 'parallel'
}

export interface IApprovalRule extends Document {
  _id: string;
  companyId: string;
  name: string;
  minAmount: number;
  maxAmount?: number;
  categoryIds?: string[];
  approvalType: ApprovalType;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const approvalRuleSchema = new Schema<IApprovalRule>({
  companyId: {
    type: String,
    required: true,
    ref: 'Company'
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  minAmount: {
    type: Number,
    required: true,
    min: 0
  },
  maxAmount: {
    type: Number,
    min: 0,
    validate: {
      validator: function(this: IApprovalRule, value: number) {
        return !value || value >= this.minAmount;
      },
      message: 'Maximum amount must be greater than or equal to minimum amount'
    }
  },
  categoryIds: [{
    type: String,
    ref: 'Category'
  }],
  approvalType: {
    type: String,
    enum: Object.values(ApprovalType),
    required: true,
    default: ApprovalType.SEQUENTIAL
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  versionKey: false
});

// Indexes
approvalRuleSchema.index({ companyId: 1, minAmount: 1 });
approvalRuleSchema.index({ companyId: 1, isActive: 1 });

export const ApprovalRule = mongoose.model<IApprovalRule>('ApprovalRule', approvalRuleSchema);