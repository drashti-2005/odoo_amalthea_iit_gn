import mongoose from 'mongoose';
import { User } from '../models/user.model';
import { Expense, ExpenseStatus } from '../models/expense.model';
import { Category } from '../models/category.model';
import { Company } from '../models/company.model';
import { Receipt } from '../models/receipt.model';
import dotenv from 'dotenv';

dotenv.config();

async function seedEmployeeData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');

    // Find or create the user
    let user = await User.findOne({ email: 'user1@gmail.com' });
    if (!user) {
      console.log('User not found, creating...');
      // Create company first
      const company = new Company({
        name: 'Tech Solutions Inc',
        baseCurrency: 'USD',
        country: 'US'
      });
      await company.save();

      // Create user
      user = new User({
        companyId: company._id,
        email: 'user1@gmail.com',
        password: '$2b$10$hashedpassword', // This would be properly hashed
        name: 'Sarah Johnson',
        role: 'employee',
        isActive: true
      });
      await user.save();
    }

    console.log('User found/created:', user.name);

    // Create categories if they don't exist
    const categories = [
      { name: 'Food', companyId: user.companyId },
      { name: 'Travel', companyId: user.companyId },
      { name: 'Office Supplies', companyId: user.companyId },
      { name: 'Entertainment', companyId: user.companyId },
      { name: 'Training', companyId: user.companyId }
    ];

    for (const cat of categories) {
      const existing = await Category.findOne({ name: cat.name, companyId: cat.companyId });
      if (!existing) {
        await Category.create(cat);
      }
    }

    const allCategories = await Category.find({ companyId: user.companyId });
    console.log('Categories ready:', allCategories.length);

    // Clear existing expenses for this user
    await Expense.deleteMany({ userId: user._id });
    console.log('Cleared existing expenses');

    // Create dummy expenses
    const dummyExpenses = [
      {
        companyId: user.companyId,
        userId: user._id,
        categoryId: allCategories.find(c => c.name === 'Food')?._id,
        title: 'Restaurant bill',
        description: 'Team lunch meeting',
        amount: 5000,
        currency: 'INR',
        exchangeRate: 0.012, // INR to USD
        amountInBaseCurrency: 60,
        expenseDate: new Date('2025-10-04'),
        status: ExpenseStatus.DRAFT,
        createdAt: new Date('2025-10-04'),
        updatedAt: new Date('2025-10-04')
      },
      {
        companyId: user.companyId,
        userId: user._id,
        categoryId: allCategories.find(c => c.name === 'Food')?._id,
        title: 'Coffee meeting',
        description: 'Client discussion over coffee',
        amount: 33674,
        currency: 'INR',
        exchangeRate: 0.012,
        amountInBaseCurrency: 404,
        expenseDate: new Date('2025-10-03'),
        status: ExpenseStatus.SUBMITTED,
        submittedAt: new Date('2025-10-03'),
        createdAt: new Date('2025-10-03'),
        updatedAt: new Date('2025-10-03')
      },
      {
        companyId: user.companyId,
        userId: user._id,
        categoryId: allCategories.find(c => c.name === 'Travel')?._id,
        title: 'Taxi fare',
        description: 'Airport to hotel transfer',
        amount: 500,
        currency: 'INR',
        exchangeRate: 0.012,
        amountInBaseCurrency: 6,
        expenseDate: new Date('2025-10-02'),
        status: ExpenseStatus.APPROVED,
        submittedAt: new Date('2025-10-02'),
        approvedAt: new Date('2025-10-02'),
        createdAt: new Date('2025-10-02'),
        updatedAt: new Date('2025-10-02')
      },
      {
        companyId: user.companyId,
        userId: user._id,
        categoryId: allCategories.find(c => c.name === 'Office Supplies')?._id,
        title: 'Stationery purchase',
        description: 'Notebooks and pens for team',
        amount: 1250,
        currency: 'INR',
        exchangeRate: 0.012,
        amountInBaseCurrency: 15,
        expenseDate: new Date('2025-10-01'),
        status: ExpenseStatus.APPROVED,
        submittedAt: new Date('2025-10-01'),
        approvedAt: new Date('2025-10-01'),
        createdAt: new Date('2025-10-01'),
        updatedAt: new Date('2025-10-01')
      },
      {
        companyId: user.companyId,
        userId: user._id,
        categoryId: allCategories.find(c => c.name === 'Travel')?._id,
        title: 'Flight booking',
        description: 'Business trip to Mumbai',
        amount: 8500,
        currency: 'INR',
        exchangeRate: 0.012,
        amountInBaseCurrency: 102,
        expenseDate: new Date('2025-09-30'),
        status: ExpenseStatus.PAID,
        submittedAt: new Date('2025-09-30'),
        approvedAt: new Date('2025-09-30'),
        createdAt: new Date('2025-09-30'),
        updatedAt: new Date('2025-09-30')
      },
      {
        companyId: user.companyId,
        userId: user._id,
        categoryId: allCategories.find(c => c.name === 'Training')?._id,
        title: 'Online course',
        description: 'Professional development certification',
        amount: 15000,
        currency: 'INR',
        exchangeRate: 0.012,
        amountInBaseCurrency: 180,
        expenseDate: new Date('2025-09-28'),
        status: ExpenseStatus.APPROVED,
        submittedAt: new Date('2025-09-28'),
        approvedAt: new Date('2025-09-29'),
        createdAt: new Date('2025-09-28'),
        updatedAt: new Date('2025-09-29')
      }
    ];

    for (const expenseData of dummyExpenses) {
      await Expense.create(expenseData);
    }

    console.log('Created', dummyExpenses.length, 'dummy expenses');
    console.log('Seed data created successfully!');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the seed function
seedEmployeeData();