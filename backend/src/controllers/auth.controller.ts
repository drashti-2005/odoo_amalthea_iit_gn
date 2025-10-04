import { Request, Response } from 'express';
import { AuthService, SignupData, LoginData } from '../services/auth.service';
import { UserRole, User } from '../models/user.model';
import { EmailService } from '../services/email.service';

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
      
      // Get user information for the email
      const user = await AuthService.getUserById(id);
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      try {
        // Send password reset link via email
        await EmailService.sendPasswordResetLinkEmail(
          user.email,
          resetToken,
          user.name
        );

        res.status(200).json({
          success: true,
          message: 'Password reset instructions sent to user email',
          data: {
            resetLink: `${process.env.FRONTEND_URL}/reset-password/${resetToken}`
          }
        });
      } catch (emailError) {
        console.error('Failed to send password reset email:', emailError);
        res.status(500).json({
          success: false,
          message: 'Failed to send password reset email'
        });
      }
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to generate password reset token'
      });
    }
  }

  static async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      console.log('Reset Password API Call - Body:', req.body);
      const { token, password } = req.body;

      if (!token || !password) {
        console.log('Missing token or password in request');
        res.status(400).json({
          success: false,
          message: 'Token and password are required'
        });
        return;
      }

      console.log('Attempting to reset password with token:', token.substring(0, 10) + '...');
      // Verify token and update password
      const result = await AuthService.resetPassword(token, password);

      res.status(200).json({
        success: true,
        message: 'Password has been reset successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to reset password'
      });
    }
  }

  static async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({
          success: false,
          message: 'Email is required'
        });
        return;
      }

      // Find the user by email
      const user = await User.findOne({ email: email.toLowerCase(), isActive: true });
      
      // Don't reveal if user exists or not for security reasons
      if (!user) {
        res.status(200).json({
          success: true,
          message: 'If your email is registered, you will receive password reset instructions'
        });
        return;
      }

      // Generate reset token
      const resetToken = await AuthService.generatePasswordResetToken(user._id);

      try {
        // Send password reset link via email
        await EmailService.sendPasswordResetLinkEmail(
          user.email,
          resetToken,
          user.name
        );

        res.status(200).json({
          success: true,
          message: 'Password reset instructions sent to your email'
        });
      } catch (emailError) {
        console.error('Failed to send password reset email:', emailError);
        res.status(500).json({
          success: false,
          message: 'Failed to send password reset email'
        });
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while processing your request'
      });
    }
  }
}