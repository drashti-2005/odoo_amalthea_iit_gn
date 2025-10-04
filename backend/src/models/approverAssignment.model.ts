import mongoose, { Document, Schema } from 'mongoose';

export interface IApproverAssignment extends Document {
  _id: string;
  approvalRuleId: string;
  userId: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const approverAssignmentSchema = new Schema<IApproverAssignment>({
  approvalRuleId: {
    type: String,
    required: true,
    ref: 'ApprovalRule'
  },
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  order: {
    type: Number,
    required: true,
    min: 1
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
approverAssignmentSchema.index({ approvalRuleId: 1, order: 1 });
approverAssignmentSchema.index({ userId: 1 });
approverAssignmentSchema.index({ approvalRuleId: 1, userId: 1 }, { unique: true });

export const ApproverAssignment = mongoose.model<IApproverAssignment>('ApproverAssignment', approverAssignmentSchema);