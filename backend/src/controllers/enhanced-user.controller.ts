import { Response } from 'express';
import { User, UserRole } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { EmailService } from '../services/email.service';
import { PasswordUtils } from '../utils/password';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export class UserController {
  static async createUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      console.log('CreateUser request body:', req.body);
      console.log('CreateUser request user:', req.user);
      
      const { email, name, role, managerId } = req.body;

      // Validate required fields
      if (!email || !name || !role) {
        console.log('Missing required fields:', { email: !!email, name: !!name, role: !!role });
        res.status(400).json({
          success: false,
          message: 'Email, name, and role are required'
        });
        return;
      }

      // Validate role
      if (!Object.values(UserRole).includes(role)) {
        res.status(400).json({
          success: false,
          message: 'Invalid role'
        });
        return;
      }

      // Only admins can create users
      if (!req.user || req.user.role !== UserRole.ADMIN) {
        res.status(403).json({
          success: false,
          message: 'Only admins can create users'
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

      // Check if user already exists
      const existingUser = await User.findOne({ 
        email: email.toLowerCase(),
        companyId: req.user.companyId 
      });
      
      if (existingUser) {
        res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
        return;
      }

      // Validate manager if provided (skip validation for mock company in development)
      if (managerId && role === UserRole.EMPLOYEE && req.user.companyId !== 'mock-company-id') {
        const manager = await User.findOne({
          _id: managerId,
          companyId: req.user.companyId,
          role: { $in: [UserRole.MANAGER, UserRole.ADMIN] },
          isActive: true
        });

        if (!manager) {
          res.status(400).json({
            success: false,
            message: 'Invalid manager ID'
          });
          return;
        }
      }

      // Generate temporary password
      const temporaryPassword = PasswordUtils.generateRandomPassword();
      const hashedPassword = await AuthService.hashPassword(temporaryPassword);

      // Create user
      const user = new User({
        companyId: req.user.companyId,
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        role,
        managerId: (role === UserRole.EMPLOYEE && managerId) ? managerId : undefined,
        isActive: true
      });

      await user.save();

      // Send temporary password email
      try {
        await EmailService.sendTemporaryPassword(email, temporaryPassword, name);
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
        // Continue even if email fails
      }

      // Remove password from response
      const userResponse = await User.findById(user._id)
        .select('-password')
        .populate('managerId', 'name email');

      res.status(201).json({
        success: true,
        message: 'User created successfully and password sent to email',
        data: { user: userResponse }
      });
    } catch (error) {
      console.error('CreateUser error:', error);
      
      // Handle specific MongoDB errors
      if (error instanceof Error && error.message.includes('E11000') && error.message.includes('email')) {
        res.status(400).json({
          success: false,
          message: 'A user with this email already exists'
        });
        return;
      }
      
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create user',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  static async getUsers(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      // Extract query parameters
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
      const search = req.query.search as string || '';
      const roleFilter = req.query.role as string;
      const isActiveFilter = req.query.isActive as string;

      const skip = (page - 1) * limit;

      // Build filter
      const filter: any = {
        companyId: req.user.companyId
      };

      // Search filter
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }

      // Role filter
      if (roleFilter && Object.values(UserRole).includes(roleFilter as UserRole)) {
        filter.role = roleFilter;
      }

      // Active status filter
      if (isActiveFilter !== undefined) {
        filter.isActive = isActiveFilter === 'true';
      } else {
        filter.isActive = true; // Default to active users only
      }

      // Apply role-based access control
      if (req.user.role === UserRole.EMPLOYEE) {
        filter._id = req.user.userId;
      } else if (req.user.role === UserRole.MANAGER) {
        filter.$or = [
          { _id: req.user.userId },
          { managerId: req.user.userId }
        ];
      }

      // Get users with pagination
      const [users, totalUsers] = await Promise.all([
        User.find(filter)
          .select('-password')
          .populate('managerId', 'name email role')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        User.countDocuments(filter)
      ]);

      const totalPages = Math.ceil(totalUsers / limit);

      res.status(200).json({
        success: true,
        message: 'Users retrieved successfully',
        data: {
          users,
          pagination: {
            currentPage: page,
            totalPages,
            totalUsers,
            limit,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to retrieve users'
      });
    }
  }

  static async getUserById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const user = await User.findOne({
        _id: id,
        companyId: req.user.companyId
      })
        .select('-password')
        .populate('managerId', 'name email role');

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      // Check permissions
      if (req.user.role === UserRole.EMPLOYEE && req.user.userId !== id) {
        res.status(403).json({
          success: false,
          message: 'Insufficient permissions'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'User retrieved successfully',
        data: { user }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to retrieve user'
      });
    }
  }

  static async updateUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, role, managerId, isActive } = req.body;

      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      // Find the user to update
      const userToUpdate = await User.findOne({
        _id: id,
        companyId: req.user.companyId
      });

      if (!userToUpdate) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      // Check permissions
      const canUpdate = req.user.role === UserRole.ADMIN || 
                       (req.user.userId === id && !role && !managerId && isActive === undefined);

      if (!canUpdate) {
        res.status(403).json({
          success: false,
          message: 'Insufficient permissions to update this user'
        });
        return;
      }

      // Prepare update data
      const updateData: any = {};
      
      if (name) updateData.name = name;
      
      // Only admins can change role, manager, and active status
      if (req.user.role === UserRole.ADMIN) {
        if (role && Object.values(UserRole).includes(role)) {
          updateData.role = role;
        }
        
        if (managerId !== undefined) {
          if (managerId && role === UserRole.EMPLOYEE) {
            // Validate manager exists
            const manager = await User.findOne({
              _id: managerId,
              companyId: req.user.companyId,
              role: { $in: [UserRole.MANAGER, UserRole.ADMIN] },
              isActive: true
            });
            
            if (!manager) {
              res.status(400).json({
                success: false,
                message: 'Invalid manager ID'
              });
              return;
            }
            updateData.managerId = managerId;
          } else {
            updateData.managerId = null;
          }
        }
        
        if (isActive !== undefined) {
          updateData.isActive = isActive;
        }
      }

      const updatedUser = await User.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      )
        .select('-password')
        .populate('managerId', 'name email role');

      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: { user: updatedUser }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update user'
      });
    }
  }

  static async resetUserPassword(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!req.user || req.user.role !== UserRole.ADMIN) {
        res.status(403).json({
          success: false,
          message: 'Only admins can reset passwords'
        });
        return;
      }

      // Find the user
      const user = await User.findOne({
        _id: id,
        companyId: req.user.companyId,
        isActive: true
      });

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      // Generate new password
      const newPassword = PasswordUtils.generateRandomPassword();
      const hashedPassword = await AuthService.hashPassword(newPassword);

      // Update user password and require password change on next login
      await User.findByIdAndUpdate(id, { 
        password: hashedPassword,
        passwordChangeRequired: true
      });

      // Send password reset email
      try {
        await EmailService.sendPasswordResetEmail(user.email, newPassword, user.name);
      } catch (emailError) {
        console.error('Failed to send password reset email:', emailError);
        res.status(500).json({
          success: false,
          message: 'Password reset but failed to send email'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Password reset successfully and sent to user email'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to reset password'
      });
    }
  }

  static async getManagers(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const managers = await User.find({
        companyId: req.user.companyId,
        role: { $in: [UserRole.MANAGER, UserRole.ADMIN] },
        isActive: true
      })
        .select('name email role')
        .sort({ name: 1 });

      res.status(200).json({
        success: true,
        message: 'Managers retrieved successfully',
        data: { managers }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to retrieve managers'
      });
    }
  }
}