import { Response } from 'express';
import { Category } from '../models/category.model';
import { UserRole } from '../models/user.model';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export class CategoryController {
  static async createCategory(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { name, description } = req.body;

      // Validate required fields
      if (!name) {
        res.status(400).json({
          success: false,
          message: 'Category name is required'
        });
        return;
      }

      // Only admins can create categories
      if (!req.user || req.user.role !== UserRole.ADMIN) {
        res.status(403).json({
          success: false,
          message: 'Only admins can create categories'
        });
        return;
      }

      // Check if category already exists
      const existingCategory = await Category.findOne({
        companyId: req.user.companyId,
        name: name.trim(),
        isActive: true
      });

      if (existingCategory) {
        res.status(400).json({
          success: false,
          message: 'Category with this name already exists'
        });
        return;
      }

      const category = new Category({
        companyId: req.user.companyId,
        name: name.trim(),
        description: description?.trim(),
        isActive: true
      });

      await category.save();

      res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: { category }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create category'
      });
    }
  }

  static async getCategories(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const skip = (page - 1) * limit;

      const filter = {
        companyId: req.user.companyId,
        isActive: true
      };

      const categories = await Category.find(filter)
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit);

      const totalCategories = await Category.countDocuments(filter);
      const totalPages = Math.ceil(totalCategories / limit);

      res.status(200).json({
        success: true,
        message: 'Categories retrieved successfully',
        data: {
          categories,
          pagination: {
            currentPage: page,
            totalPages,
            totalCategories,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to retrieve categories'
      });
    }
  }

  static async getCategoryById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const category = await Category.findOne({
        _id: id,
        companyId: req.user.companyId,
        isActive: true
      });

      if (!category) {
        res.status(404).json({
          success: false,
          message: 'Category not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Category retrieved successfully',
        data: { category }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to retrieve category'
      });
    }
  }

  static async updateCategory(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, description, isActive } = req.body;

      // Only admins can update categories
      if (!req.user || req.user.role !== UserRole.ADMIN) {
        res.status(403).json({
          success: false,
          message: 'Only admins can update categories'
        });
        return;
      }

      const updateData: any = {};
      if (name) updateData.name = name.trim();
      if (description !== undefined) updateData.description = description?.trim();
      if (isActive !== undefined) updateData.isActive = isActive;

      // Check for duplicate name if name is being updated
      if (name) {
        const existingCategory = await Category.findOne({
          _id: { $ne: id },
          companyId: req.user.companyId,
          name: name.trim(),
          isActive: true
        });

        if (existingCategory) {
          res.status(400).json({
            success: false,
            message: 'Category with this name already exists'
          });
          return;
        }
      }

      const category = await Category.findOneAndUpdate(
        {
          _id: id,
          companyId: req.user.companyId
        },
        updateData,
        { new: true, runValidators: true }
      );

      if (!category) {
        res.status(404).json({
          success: false,
          message: 'Category not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Category updated successfully',
        data: { category }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update category'
      });
    }
  }

  static async deleteCategory(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Only admins can delete categories
      if (!req.user || req.user.role !== UserRole.ADMIN) {
        res.status(403).json({
          success: false,
          message: 'Only admins can delete categories'
        });
        return;
      }

      const category = await Category.findOneAndUpdate(
        {
          _id: id,
          companyId: req.user.companyId
        },
        { isActive: false },
        { new: true }
      );

      if (!category) {
        res.status(404).json({
          success: false,
          message: 'Category not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Category deleted successfully',
        data: { category }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete category'
      });
    }
  }
}