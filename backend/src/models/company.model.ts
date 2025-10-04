import mongoose, { Document, Schema } from 'mongoose';

export interface ICompany extends Document {
  _id: string;
  name: string;
  baseCurrency: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
}

const companySchema = new Schema<ICompany>({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  baseCurrency: {
    type: String,
    required: true,
    uppercase: true,
    default: 'USD'
  },
  country: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true,
  versionKey: false
});

companySchema.index({ name: 1 });

export const Company = mongoose.model<ICompany>('Company', companySchema);