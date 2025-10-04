import mongoose, { Document, Schema } from 'mongoose';

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  EMPLOYEE = 'employee'
}

export interface IUser extends Document {
  _id: string;
  companyId: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  managerId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  companyId: {
    type: String,
    required: true,
    ref: 'Company'
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 100
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    required: true,
    default: UserRole.EMPLOYEE
  },
  managerId: {
    type: String,
    ref: 'User',
    default: null
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
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ companyId: 1 });
userSchema.index({ managerId: 1 });

// Virtual for display name (keeping the same property name for compatibility)
userSchema.virtual('fullName').get(function(this: IUser) {
  return this.name;
});

// Transform output
userSchema.set('toJSON', {
  transform: function(doc, ret) {
    const { password, _id, ...userWithoutPassword } = ret;
    return {
      id: _id,
      ...userWithoutPassword
    };
  }
});

export const User = mongoose.model<IUser>('User', userSchema);