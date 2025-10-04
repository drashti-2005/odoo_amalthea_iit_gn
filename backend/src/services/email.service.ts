import transporter from '../config/nodemailer.config';

// Email service using nodemailer
export class EmailService {
  // Use the configured transporter from nodemailer.config.ts

  /**
   * Send temporary password to user email
   */
  static async sendTemporaryPassword(email: string, temporaryPassword: string, userName: string): Promise<void> {
    try {
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Your temporary password for ExpenseFlow',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
            <h2 style="color: #2c3e50;">Welcome to ExpenseFlow</h2>
            <p>Hi ${userName},</p>
            
            <p>Your account has been created in the ExpenseFlow system.</p>
            
            <p>Here are your login credentials:</p>
            <ul>
              <li><strong>Email:</strong> ${email}</li>
              <li><strong>Temporary Password:</strong> ${temporaryPassword}</li>
            </ul>
            
            <p><strong>Please log in and change your password immediately for security purposes.</strong></p>
            
            <p><a href="${process.env.FRONTEND_URL}/login" style="background-color: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Login to ExpenseFlow</a></p>
            
            <p>Best regards,<br>ExpenseFlow Team</p>
          </div>
        `,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent: ', info.messageId);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new Error('Failed to send email');
    }
  }

  /**
   * Send password reset email
   */
  static async sendPasswordResetEmail(email: string, newPassword: string, userName: string): Promise<void> {
    try {
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Your password has been reset',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
            <h2 style="color: #2c3e50;">Password Reset Notification</h2>
            <p>Hi ${userName},</p>
            
            <p>Your password has been reset by an administrator.</p>
            
            <p>Your new temporary password is: <strong>${newPassword}</strong></p>
            
            <p><strong>Please log in and change your password immediately.</strong></p>
            
            <p><a href="${process.env.FRONTEND_URL}/login" style="background-color: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Login to ExpenseFlow</a></p>
            
            <p>Best regards,<br>ExpenseFlow Team</p>
          </div>
        `,
      };
      
      const info = await transporter.sendMail(mailOptions);
      console.log('Password reset email sent: ', info.messageId);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  /**
   * Send password reset link email
   */
  static async sendPasswordResetLinkEmail(email: string, resetToken: string, userName: string): Promise<void> {
    try {
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
      
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Reset Your Password - ExpenseFlow',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
            <h2 style="color: #2c3e50;">Password Reset Request</h2>
            <p>Hi ${userName},</p>
            
            <p>You requested to reset your password.</p>
            
            <p>Please click the button below to reset your password:</p>
            
            <p><a href="${resetUrl}" style="background-color: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 15px 0;">Reset Your Password</a></p>
            
            <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
            
            <p>This link will expire in 1 hour for security reasons.</p>
            
            <p>Best regards,<br>ExpenseFlow Team</p>
          </div>
        `,
      };
      
      const info = await transporter.sendMail(mailOptions);
      console.log('Password reset link email sent: ', info.messageId);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to send password reset link email:', error);
      throw new Error('Failed to send password reset link email');
    }
  }
}