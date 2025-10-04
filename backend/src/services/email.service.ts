// Email service - using console.log for now (replace with actual email service like nodemailer)
export class EmailService {
  /**
   * Send temporary password to user email
   */
  static async sendTemporaryPassword(email: string, temporaryPassword: string, userName: string): Promise<void> {
    try {
      // TODO: Replace with actual email service (nodemailer, sendgrid, etc.)
      console.log('=== EMAIL SENT ===');
      console.log(`To: ${email}`);
      console.log(`Subject: Your temporary password for ExpenseFlow`);
      console.log(`
        Hi ${userName},

        Your account has been created in the ExpenseFlow system.

        Here are your login credentials:
        Email: ${email}
        Temporary Password: ${temporaryPassword}

        Please log in and change your password immediately for security purposes.

        Login URL: ${process.env.FRONTEND_URL}/login

        Best regards,
        ExpenseFlow Team
      `);
      console.log('==================');

      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
      console.log('=== PASSWORD RESET EMAIL ===');
      console.log(`To: ${email}`);
      console.log(`Subject: Your password has been reset`);
      console.log(`
        Hi ${userName},

        Your password has been reset by an administrator.

        Your new temporary password is: ${newPassword}

        Please log in and change your password immediately.

        Login URL: ${process.env.FRONTEND_URL}/login

        Best regards,
        ExpenseFlow Team
      `);
      console.log('============================');

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }
}