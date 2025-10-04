import { User, IUser } from '../models/user.model';
import { Company } from '../models/company.model';

export class UserService {
  static async getUsersByCompany(companyId: string): Promise<IUser[]> {
    return User.find({
      companyId,
      isActive: true
    })
      .select('-password')
      .populate('managerId', 'name email')
      .sort({ createdAt: -1 });
  }

  static async getUserById(id: string, companyId: string): Promise<IUser | null> {
    return User.findOne({
      _id: id,
      companyId,
      isActive: true
    })
      .select('-password')
      .populate('managerId', 'name email');
  }

  static async getManagersAndAdmins(companyId: string): Promise<IUser[]> {
    return User.find({
      companyId,
      role: { $in: ['manager', 'admin'] },
      isActive: true
    })
      .select('-password')
      .sort({ firstName: 1, lastName: 1 });
  }

  static async getUsersUnderManager(managerId: string, companyId: string): Promise<IUser[]> {
    return User.find({
      managerId,
      companyId,
      isActive: true
    })
      .select('-password')
      .sort({ firstName: 1, lastName: 1 });
  }

  static async deactivateUser(userId: string, companyId: string): Promise<IUser | null> {
    return User.findOneAndUpdate(
      {
        _id: userId,
        companyId
      },
      { isActive: false },
      { new: true }
    ).select('-password');
  }

  static async updateUserRole(userId: string, companyId: string, newRole: string, managerId?: string): Promise<IUser | null> {
    const updateData: any = { role: newRole };
    if (managerId) {
      updateData.managerId = managerId;
    }

    return User.findOneAndUpdate(
      {
        _id: userId,
        companyId,
        isActive: true
      },
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
  }

  static async validateUserBelongsToCompany(userId: string, companyId: string): Promise<boolean> {
    const user = await User.findOne({
      _id: userId,
      companyId,
      isActive: true
    });
    return !!user;
  }
}