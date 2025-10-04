import mongoose, { Document, Schema } from 'mongoose';

export interface IReceipt extends Document {
  _id: string;
  expenseId: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  filePath: string;
  uploadedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const receiptSchema = new Schema<IReceipt>({
  expenseId: {
    type: String,
    required: true,
    ref: 'Expense'
  },
  fileName: {
    type: String,
    required: true,
    trim: true
  },
  originalName: {
    type: String,
    required: true,
    trim: true
  },
  mimeType: {
    type: String,
    required: true,
    enum: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'image/webp']
  },
  fileSize: {
    type: Number,
    required: true,
    min: 1,
    max: 5 * 1024 * 1024 // 5MB limit
  },
  filePath: {
    type: String,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  versionKey: false
});

// Indexes
receiptSchema.index({ expenseId: 1 });
receiptSchema.index({ uploadedAt: -1 });

export const Receipt = mongoose.model<IReceipt>('Receipt', receiptSchema);