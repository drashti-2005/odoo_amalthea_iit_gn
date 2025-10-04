import { Response } from 'express';
import { ApprovalRule, ApprovalType } from '../models/approvalRule.model';
import { ApproverAssignment } from '../models/approverAssignment.model';
import { User, UserRole } from '../models/user.model';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export class RuleController {
  static async createApprovalRule(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const {
        name,
        minAmount,
        maxAmount,
        categoryIds,
        approvalType,
        approvers
      } = req.body;

      // Validate required fields
      if (!name || minAmount === undefined || !approvalType || !approvers || !Array.isArray(approvers)) {
        res.status(400).json({
          success: false,
          message: 'Name, minAmount, approvalType, and approvers are required'
        });
        return;
      }

      // Only admins can create approval rules
      if (!req.user || req.user.role !== UserRole.ADMIN) {
        res.status(403).json({
          success: false,
          message: 'Only admins can create approval rules'
        });
        return;
      }

      // Validate approval type
      if (!Object.values(ApprovalType).includes(approvalType)) {
        res.status(400).json({
          success: false,
          message: 'Invalid approval type'
        });
        return;
      }

      // Validate approvers
      if (approvers.length === 0) {
        res.status(400).json({
          success: false,
          message: 'At least one approver is required'
        });
        return;
      }

      // Validate that all approvers exist and are managers/admins
      const approverIds = approvers.map((approver: any) => approver.userId);
      const validApprovers = await User.find({
        _id: { $in: approverIds },
        companyId: req.user.companyId,
        role: { $in: [UserRole.MANAGER, UserRole.ADMIN] },
        isActive: true
      });

      if (validApprovers.length !== approverIds.length) {
        res.status(400).json({
          success: false,
          message: 'One or more approvers are invalid or not managers/admins'
        });
        return;
      }

      // Create approval rule
      const approvalRule = new ApprovalRule({
        companyId: req.user.companyId,
        name,
        minAmount,
        maxAmount,
        categoryIds,
        approvalType,
        isActive: true
      });

      await approvalRule.save();

      // Create approver assignments
      const approverAssignments = approvers.map((approver: any, index: number) => ({
        approvalRuleId: approvalRule._id,
        userId: approver.userId,
        order: approver.order || (index + 1),
        isActive: true
      }));

      await ApproverAssignment.insertMany(approverAssignments);

      // Fetch the complete rule with approvers
      const completeRule = await ApprovalRule.findById(approvalRule._id);
      const assignments = await ApproverAssignment.find({
        approvalRuleId: approvalRule._id,
        isActive: true
      })
        .populate('userId', 'name email role')
        .sort({ order: 1 });

      res.status(201).json({
        success: true,
        message: 'Approval rule created successfully',
        data: {
          approvalRule: completeRule,
          approvers: assignments
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create approval rule'
      });
    }
  }

  static async getApprovalRules(req: AuthenticatedRequest, res: Response): Promise<void> {
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

      const filter = {
        companyId: req.user.companyId,
        isActive: true
      };

      const approvalRules = await ApprovalRule.find(filter)
        .sort({ minAmount: 1 })
        .skip(skip)
        .limit(limit);

      const totalRules = await ApprovalRule.countDocuments(filter);
      const totalPages = Math.ceil(totalRules / limit);

      // Get approvers for each rule
      const rulesWithApprovers = await Promise.all(
        approvalRules.map(async (rule) => {
          const approvers = await ApproverAssignment.find({
            approvalRuleId: rule._id,
            isActive: true
          })
            .populate('userId', 'name email role')
            .sort({ order: 1 });

          return {
            ...rule.toJSON(),
            approvers
          };
        })
      );

      res.status(200).json({
        success: true,
        message: 'Approval rules retrieved successfully',
        data: {
          approvalRules: rulesWithApprovers,
          pagination: {
            currentPage: page,
            totalPages,
            totalRules,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to retrieve approval rules'
      });
    }
  }

  static async getApprovalRuleById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const approvalRule = await ApprovalRule.findOne({
        _id: id,
        companyId: req.user.companyId,
        isActive: true
      });

      if (!approvalRule) {
        res.status(404).json({
          success: false,
          message: 'Approval rule not found'
        });
        return;
      }

      const approvers = await ApproverAssignment.find({
        approvalRuleId: id,
        isActive: true
      })
        .populate('userId', 'name email role')
        .sort({ order: 1 });

      res.status(200).json({
        success: true,
        message: 'Approval rule retrieved successfully',
        data: {
          approvalRule,
          approvers
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to retrieve approval rule'
      });
    }
  }

  static async updateApprovalRule(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, minAmount, maxAmount, categoryIds, approvalType, isActive } = req.body;

      // Only admins can update approval rules
      if (!req.user || req.user.role !== UserRole.ADMIN) {
        res.status(403).json({
          success: false,
          message: 'Only admins can update approval rules'
        });
        return;
      }

      const updateData: any = {};
      if (name) updateData.name = name;
      if (minAmount !== undefined) updateData.minAmount = minAmount;
      if (maxAmount !== undefined) updateData.maxAmount = maxAmount;
      if (categoryIds) updateData.categoryIds = categoryIds;
      if (approvalType) updateData.approvalType = approvalType;
      if (isActive !== undefined) updateData.isActive = isActive;

      const approvalRule = await ApprovalRule.findOneAndUpdate(
        {
          _id: id,
          companyId: req.user.companyId
        },
        updateData,
        { new: true, runValidators: true }
      );

      if (!approvalRule) {
        res.status(404).json({
          success: false,
          message: 'Approval rule not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Approval rule updated successfully',
        data: { approvalRule }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update approval rule'
      });
    }
  }
}