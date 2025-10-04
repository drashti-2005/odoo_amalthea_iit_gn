import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { User, UserRole } from '../models/user.model';
import { Expense, ExpenseStatus } from '../models/expense.model';
import { Category } from '../models/category.model';
import { Company } from '../models/company.model';
import dotenv from 'dotenv';

dotenv.config();

async function seedManagerData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');

    // Find or create company
    let company = await Company.findOne({ name: 'Tech Solutions Inc' });
    if (!company) {
      company = new Company({
        name: 'Tech Solutions Inc',
        baseCurrency: 'INR',
        country: 'IN'
      });
      await company.save();
      console.log('Company created:', company.name);
    }

    // Create manager user
    const managerEmail = 'manager1@gmail.com';
    let manager = await User.findOne({ email: managerEmail });
    if (!manager) {
      const hashedPassword = await bcrypt.hash('manager123', 10);
      manager = new User({
        companyId: company._id,
        email: managerEmail,
        password: hashedPassword,
        name: 'John Smith',
        role: UserRole.MANAGER,
        isActive: true
      });
      await manager.save();
      console.log('Manager created:', manager.name);
    }

    // Create/update employee users with manager reference
    const employees = [
      {
        email: 'user1@gmail.com',
        password: 'jwTM75&v^ZxQ',
        name: 'Sarah Johnson',
        role: UserRole.EMPLOYEE
      },
      {
        email: 'employee2@gmail.com', 
        password: 'employee123',
        name: 'Mike Davis',
        role: UserRole.EMPLOYEE
      },
      {
        email: 'employee3@gmail.com',
        password: 'employee123', 
        name: 'Lisa Wilson',
        role: UserRole.EMPLOYEE
      }
    ];

    for (const empData of employees) {
      let employee = await User.findOne({ email: empData.email });
      if (!employee) {
        const hashedPassword = await bcrypt.hash(empData.password, 10);
        employee = new User({
          companyId: company._id,
          email: empData.email,
          password: hashedPassword,
          name: empData.name,
          role: empData.role,
          managerId: manager._id, // Set manager reference
          isActive: true
        });
        await employee.save();
        console.log('Employee created:', employee.name);
      } else {
        // Update existing employee to have manager reference
        employee.managerId = manager._id;
        await employee.save();
        console.log('Employee updated with manager:', employee.name);
      }
    }

    // Create categories if they don't exist
    const categoryNames = ['Food', 'Travel', 'Office Supplies', 'Entertainment', 'Training', 'Fuel'];
    const createdCategories = [];
    
    for (const categoryName of categoryNames) {
      let category = await Category.findOne({ 
        name: categoryName, 
        companyId: company._id 
      });
      if (!category) {
        category = new Category({
          companyId: company._id,
          name: categoryName,
          description: `${categoryName} related expenses`,
          isActive: true
        });
        await category.save();
        console.log('Category created:', category.name);
      }
      createdCategories.push(category);
    }

    // Create some sample expenses for employees (with submitted status for manager approval)
    const employees_for_expenses = await User.find({ 
      managerId: manager._id,
      companyId: company._id,
      isActive: true 
    });

    const sampleExpenses = [
      {
        employeeEmail: 'user1@gmail.com',
        title: 'Team Lunch Meeting',
        description: 'Lunch with client to discuss project requirements',
        amount: 2500,
        currency: 'INR',
        categoryName: 'Food',
        status: ExpenseStatus.SUBMITTED,
        daysAgo: 2
      },
      {
        employeeEmail: 'user1@gmail.com',
        title: 'Office Stationary',
        description: 'Pens, notebooks and other office supplies',
        amount: 850,
        currency: 'INR',
        categoryName: 'Office Supplies',
        status: ExpenseStatus.SUBMITTED,
        daysAgo: 1
      },
      {
        employeeEmail: 'employee2@gmail.com',
        title: 'Travel to Mumbai',
        description: 'Flight tickets for client meeting in Mumbai',
        amount: 8500,
        currency: 'INR',
        categoryName: 'Travel',
        status: ExpenseStatus.SUBMITTED,
        daysAgo: 3
      },
      {
        employeeEmail: 'employee2@gmail.com',
        title: 'Fuel Expenses',
        description: 'Petrol for official travel',
        amount: 2200,
        currency: 'INR',
        categoryName: 'Fuel',
        status: ExpenseStatus.SUBMITTED,
        daysAgo: 1
      },
      {
        employeeEmail: 'employee3@gmail.com',
        title: 'Online Training Course',
        description: 'React.js advanced course on Udemy',
        amount: 1999,
        currency: 'INR',
        categoryName: 'Training',
        status: ExpenseStatus.SUBMITTED,
        daysAgo: 4
      },
      {
        employeeEmail: 'employee3@gmail.com',
        title: 'Client Entertainment',
        description: 'Dinner with potential client',
        amount: 3200,
        currency: 'INR',
        categoryName: 'Entertainment',
        status: ExpenseStatus.SUBMITTED,
        daysAgo: 2
      },
      // Some already approved expenses
      {
        employeeEmail: 'user1@gmail.com',
        title: 'Monthly Travel Pass',
        description: 'Metro travel pass for office commute',
        amount: 1500,
        currency: 'INR',
        categoryName: 'Travel',
        status: ExpenseStatus.APPROVED,
        daysAgo: 10
      },
      {
        employeeEmail: 'employee2@gmail.com',
        title: 'Team Building Activity',
        description: 'Team outing expenses',
        amount: 4500,
        currency: 'INR',
        categoryName: 'Entertainment',
        status: ExpenseStatus.APPROVED,
        daysAgo: 15
      }
    ];

    for (const expenseData of sampleExpenses) {
      const employee = employees_for_expenses.find(emp => emp.email === expenseData.employeeEmail);
      const category = createdCategories.find(cat => cat.name === expenseData.categoryName);
      
      if (employee && category) {
        // Check if expense already exists
        const existingExpense = await Expense.findOne({
          userId: employee._id,
          title: expenseData.title,
          companyId: company._id
        });

        if (!existingExpense) {
          const expenseDate = new Date();
          expenseDate.setDate(expenseDate.getDate() - expenseData.daysAgo);

          const expense = new Expense({
            companyId: company._id,
            userId: employee._id,
            categoryId: category._id,
            title: expenseData.title,
            description: expenseData.description,
            amount: expenseData.amount,
            currency: expenseData.currency,
            expenseDate: expenseDate,
            status: expenseData.status,
            submittedAt: expenseData.status !== ExpenseStatus.DRAFT ? expenseDate : undefined,
            approvedAt: expenseData.status === ExpenseStatus.APPROVED ? new Date(expenseDate.getTime() + 86400000) : undefined // Next day
          });
          
          await expense.save();
          console.log(`Expense created: ${expenseData.title} for ${employee.name}`);
        }
      }
    }

    console.log('✅ Manager data seeding completed successfully!');
    console.log('\n🔑 Login Credentials:');
    console.log('Manager: manager1@gmail.com / manager123');
    console.log('Employee 1: user1@gmail.com / jwTM75&v^ZxQ');
    console.log('Employee 2: employee2@gmail.com / employee123');
    console.log('Employee 3: employee3@gmail.com / employee123');

  } catch (error) {
    console.error('Error seeding manager data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seeding function
seedManagerData();