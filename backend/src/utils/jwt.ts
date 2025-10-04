import jwt from 'jsonwebtoken';
import { IUser } from '../models/user.model';

export interface JWTPayload {
  userId: string;
  companyId: string;
  email: string;
  role: string;
}

export const signToken = (user: IUser): string => {
  const payload: JWTPayload = {
    userId: user._id,
    companyId: user.companyId,
    email: user.email,
    role: user.role
  };

  const secret = process.env.JWT_SECRET || 'your-secret-key';
  
  return jwt.sign(payload, secret, { expiresIn: '7d' });
};

export const verifyToken = (token: string): JWTPayload => {
  const secret = process.env.JWT_SECRET || 'your-secret-key';
  return jwt.verify(token, secret) as JWTPayload;
};

export const generateResetToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET || 'your-secret-key';
  const payload = { userId, type: 'password-reset' };
  
  return jwt.sign(payload, secret, { expiresIn: '1h' });
};