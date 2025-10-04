import { Response } from 'express';
import { User, UserRole } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export class UserController {
  static async createUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { email, name, role, managerId } = req.body;

      // Validate required fields
      if (!email || !name || !role) {
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

      // Validate manager if provided
      if (managerId) {
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

      const user = await AuthService.createUser(req.user.companyId, {
        email,
        name,
        role,
        managerId
      });

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: { user }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create user'
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

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const filter: any = {
        companyId: req.user.companyId,
        isActive: true
      };

      // If user is not admin, they can only see their team members
      if (req.user.role === UserRole.EMPLOYEE) {
        filter._id = req.user.userId;
      } else if (req.user.role === UserRole.MANAGER) {
        filter.$or = [
          { _id: req.user.userId },
          { managerId: req.user.userId }
        ];
      }

      const users = await User.find(filter)
        .select('-password')
        .populate('managerId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const totalUsers = await User.countDocuments(filter);
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
        companyId: req.user.companyId,
        isActive: true
      })
        .select('-password')
        .populate('managerId', 'name email');

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
      const { name, managerId } = req.body;

      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      // Check permissions - only admins can update users or users can update themselves
      if (req.user.role !== UserRole.ADMIN && req.user.userId !== id) {
        res.status(403).json({
          success: false,
          message: 'Insufficient permissions'
        });
        return;
      }

      const updateData: any = {};
      if (name) updateData.name = name;
      if (managerId && req.user.role === UserRole.ADMIN) {
        updateData.managerId = managerId;
      }

      const user = await User.findOneAndUpdate(
        {
          _id: id,
          companyId: req.user.companyId,
          isActive: true
        },
        updateData,
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: { user }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update user'
      });
    }
  }
}