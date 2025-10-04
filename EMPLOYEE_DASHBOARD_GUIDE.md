# Employee Dashboard Testing Guide

## Overview
The system now supports role-based dashboards that redirect users to appropriate interfaces based on their role.

## Testing Instructions

### 1. Employee Dashboard Test
- Navigate to: http://localhost:5173/login
- Use email: `employee@test.com` (or any email containing "employee")
- Use any password (development mode uses mock authentication)
- **Expected Result**: User should be redirected to Employee Dashboard with:
  - Welcome message with employee name
  - Employee-specific navigation (Dashboard, My Expenses, New Expense)
  - Quick action cards for expense management
  - Dashboard stats (pending, approved, etc.)
  - Recent activity feed

### 2. Manager Dashboard Test
- Use email: `manager@test.com` (or any email containing "manager")
- **Expected Result**: User should see Admin Dashboard (managers currently use admin interface)

### 3. Admin Dashboard Test  
- Use email: `admin@test.com` (or any other email)
- **Expected Result**: User should see full Admin Dashboard with all features

## Role-Based Features

### Employee Role Access:
- ✅ Dashboard (Employee-specific)
- ✅ My Expenses
- ✅ New Expense
- ❌ Approvals (Manager/Admin only)
- ❌ Reports (Manager/Admin only)
- ❌ Users (Admin only)
- ❌ Approval Rules (Admin only)
- ❌ Categories (Admin only)

### Manager Role Access:
- ✅ Dashboard (Admin interface)
- ✅ My Expenses
- ✅ New Expense
- ✅ Approvals
- ✅ Reports
- ❌ Users (Admin only)
- ❌ Approval Rules (Admin only)
- ❌ Categories (Admin only)

### Admin Role Access:
- ✅ All features available

## Database Integration
- Employee users can be created via the Users management interface
- The system connects to the actual users table in MongoDB
- Employee login will work with real user accounts when backend authentication is properly configured
- Currently using mock authentication for development/testing

## Next Steps
To connect to real employee users from the database:
1. Ensure backend authentication endpoints are working
2. Update AuthContext to use real API responses instead of mock data
3. Test with actual employee user accounts created via the admin interface