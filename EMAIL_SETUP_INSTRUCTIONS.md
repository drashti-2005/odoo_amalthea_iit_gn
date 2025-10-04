# Email Setup Instructions

To send emails with auto-generated passwords, you need to:

1. Update the SMTP settings in the .env file with your Gmail account details:

   ```
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password_here
   ```

2. To get an App Password for Gmail:

   a. Go to your Google Account at https://myaccount.google.com/
   b. Navigate to "Security"
   c. Under "Signing in to Google," select "2-Step Verification" (you need this enabled)
   d. At the bottom of the page, select "App passwords"
   e. Generate a new app password for "Mail" and "Other (Custom name)" - name it "ExpenseFlow"
   f. Copy the generated 16-character password and use it for SMTP_PASS

3. After updating the .env file with your email and app password, the system will:
   - Send an email with auto-generated password when an admin adds a new user
   - Send an email when an admin resets a user's password
   - Prompt users to change their temporary password on first login

Note: DO NOT use your regular Gmail password. App passwords are specifically designed for this purpose and are more secure.
