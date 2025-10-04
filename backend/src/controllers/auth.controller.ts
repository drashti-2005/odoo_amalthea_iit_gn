import { Request, Response } from 'express';
import { AuthService, SignupData, LoginData } from '../services/auth.service';
import { UserRole } from '../models/user.model';

export class AuthController {
  static async signup(req: Request, res: Response): Promise<void> {
    try {
      const signupData: SignupData = req.body;

      // Validate required fields
      const { name, baseCurrency, email, password, country } = signupData;
      if (!name || !baseCurrency || !email || !password || !country) {
        res.status(400).json({
          success: false,
          message: 'All fields are required'
        });
        return;
      }

      // Validate email format
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
        return;
      }

      // Validate password length
      if (password.length < 6) {
        res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters long'
        });
        return;
      }

      const result = await AuthService.signup(signupData);

      res.status(201).json({
        success: true,
        message: 'Company and admin user created successfully',
        data: {
          user: result.user,
          company: result.company,
          token: result.token
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Signup failed'
      });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const loginData: LoginData = req.body;

      // Validate required fields
      const { email, password } = loginData;
      if (!email || !password) {
        res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
        return;
      }

      const result = await AuthService.login(loginData);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: result.user,
          company: result.company,
          token: result.token,
          passwordChangeRequired: result.passwordChangeRequired
        }
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : 'Login failed'
      });
    }
  }

  static async sendPassword(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
        return;
      }

      const resetToken = await AuthService.generatePasswordResetToken(id);

      // In a real application, you would send this token via email
      // For now, we'll just return it in the response
      res.status(200).json({
        success: true,
        message: 'Password reset token generated',
        data: {
          resetToken,
          // In production, this would be sent via email
          resetLink: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to generate password reset token'
      });
    }
  }
}