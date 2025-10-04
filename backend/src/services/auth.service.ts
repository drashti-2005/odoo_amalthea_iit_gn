import bcrypt from 'bcryptjs';
import { User, IUser, UserRole } from '../models/user.model';
import { Company, ICompany } from '../models/company.model';
import { signToken, generateResetToken } from '../utils/jwt';

export interface SignupData {
  companyName: string;
  baseCurrency: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: IUser;
  company: ICompany;
  token: string;
}

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static async signup(signupData: SignupData): Promise<AuthResponse> {
    const { companyName, baseCurrency, email, password, firstName, lastName } = signupData;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create company
    const company = new Company({
      name: companyName,
      baseCurrency
    });
    await company.save();

    // Hash password
    const hashedPassword = await this.hashPassword(password);

    // Create admin user
    const user = new User({
      companyId: company._id,
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName,
      lastName,
      role: UserRole.ADMIN,
      isActive: true
    });
    await user.save();

    // Generate JWT token
    const token = signToken(user);

    return {
      user,
      company,
      token
    };
  }

  static async login(loginData: LoginData): Promise<AuthResponse> {
    const { email, password } = loginData;

    // Find user by email
    const user = await User.findOne({ 
      email: email.toLowerCase(),
      isActive: true 
    }).select('+password');

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await this.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Get company details
    const company = await Company.findById(user.companyId);
    if (!company) {
      throw new Error('Company not found');
    }

    // Generate JWT token
    const token = signToken(user);

    // Remove password from user object
    user.password = undefined as any;

    return {
      user,
      company,
      token
    };
  }

  static async generatePasswordResetToken(userId: string): Promise<string> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return generateResetToken(userId);
  }

  static async createUser(
    companyId: string,
    userData: {
      email: string;
      firstName: string;
      lastName: string;
      role: UserRole;
      managerId?: string;
    }
  ): Promise<IUser> {
    const { email, firstName, lastName, role, managerId } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Generate a temporary password (should be changed on first login)
    const temporaryPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await this.hashPassword(temporaryPassword);

    const user = new User({
      companyId,
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName,
      lastName,
      role,
      managerId,
      isActive: true
    });

    await user.save();
    return user;
  }
}