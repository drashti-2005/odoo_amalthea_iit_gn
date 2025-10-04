# 📋 Expense Management System Backend

A comprehensive Node.js + Express + TypeScript backend for an expense management system with JWT authentication, approval workflows, and role-based access control.

## 🚀 Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Admin, Manager, Employee)
  - Company-based multi-tenancy
  - Password hashing with bcrypt

- **User Management**
  - Company and user creation
  - Hierarchical user management (Manager-Employee relationship)
  - User permissions and access control

- **Expense Management**
  - Create and submit expenses
  - Multi-currency support with automatic conversion
  - Receipt upload and management
  - Expense categorization

- **Approval Workflows**
  - Configurable approval rules
  - Sequential and parallel approval types
  - Approval history tracking
  - Automatic expense approval for small amounts

- **API Features**
  - RESTful API design
  - Input validation
  - Error handling
  - Request logging
  - Rate limiting and security headers

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/          # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── rule.controller.ts
│   │   ├── expense.controller.ts
│   │   ├── approval.controller.ts
│   │   └── category.controller.ts
│   ├── models/              # MongoDB schemas
│   │   ├── company.model.ts
│   │   ├── user.model.ts
│   │   ├── approvalRule.model.ts
│   │   ├── approverAssignment.model.ts
│   │   ├── expense.model.ts
│   │   ├── expenseApprovalLog.model.ts
│   │   ├── receipt.model.ts
│   │   └── category.model.ts
│   ├── services/            # Business logic
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   └── expense.service.ts
│   ├── routes/              # API routes
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── rule.routes.ts
│   │   ├── expense.routes.ts
│   │   ├── approval.routes.ts
│   │   └── category.routes.ts
│   ├── middlewares/         # Custom middleware
│   │   ├── auth.middleware.ts
│   │   ├── errorHandler.ts
│   │   ├── notFoundHandler.ts
│   │   └── logger.middleware.ts
│   ├── utils/               # Utility functions
│   │   ├── jwt.ts
│   │   ├── currency.ts
│   │   ├── validators.ts
│   │   ├── logger.ts
│   │   └── constants.ts
│   ├── config/              # Configuration
│   │   └── database.ts
│   ├── types/               # TypeScript types
│   │   ├── api.ts
│   │   └── user.ts
│   ├── tests/               # Test files
│   │   ├── auth.test.ts
│   │   ├── health.test.ts
│   │   └── setup.ts
│   └── index.ts             # Application entry point
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create company and admin user
- `POST /api/auth/login` - User login
- `POST /api/auth/users/:id/send-password` - Generate password reset token

### Users (🔒 Protected)
- `POST /api/users` - Create user (Admin only)
- `GET /api/users` - List users (with role-based filtering)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user

### Categories (🔒 Protected)
- `POST /api/categories` - Create category (Admin only)
- `GET /api/categories` - List categories
- `GET /api/categories/:id` - Get category by ID
- `PUT /api/categories/:id` - Update category (Admin only)
- `DELETE /api/categories/:id` - Delete category (Admin only)

### Approval Rules (🔒 Protected)
- `POST /api/approval-rules` - Create approval rule (Admin only)
- `GET /api/approval-rules` - List approval rules
- `GET /api/approval-rules/:id` - Get approval rule by ID
- `PUT /api/approval-rules/:id` - Update approval rule (Admin only)

### Expenses (🔒 Protected)
- `POST /api/expenses` - Create expense
- `POST /api/expenses/:id/submit` - Submit expense for approval
- `POST /api/expenses/:id/receipts` - Upload receipt
- `GET /api/expenses` - List expenses (with filtering)
- `GET /api/expenses/:id` - Get expense by ID

### Approvals (🔒 Protected)
- `GET /api/approvals/pending` - Get pending approvals (Managers/Admins only)
- `POST /api/approvals/:log_id/approve` - Approve expense
- `POST /api/approvals/:log_id/reject` - Reject expense
- `GET /api/approvals/history/:expenseId` - Get approval history

### Health Check
- `GET /api/health` - Health check endpoint

## 🛠 Dependencies

### Production Dependencies
```json
{
  "express": "^5.1.0",
  "mongoose": "^8.19.0",
  "bcryptjs": "^3.0.2",
  "jsonwebtoken": "^9.0.2",
  "cors": "^2.8.5",
  "helmet": "^8.1.0",
  "morgan": "^1.10.1",
  "winston": "^3.18.3",
  "dotenv": "^17.2.3",
  "express-rate-limit": "^8.1.0",
  "express-validator": "^7.2.1"
}
```

### Development Dependencies
```json
{
  "typescript": "latest",
  "ts-node": "latest",
  "nodemon": "^3.1.10",
  "@types/express": "^5.0.3",
  "@types/bcryptjs": "^2.4.6",
  "@types/jsonwebtoken": "^9.0.10",
  "@types/cors": "^2.8.19",
  "@types/morgan": "^1.9.10",
  "@types/node": "^24.6.2",
  "jest": "^30.2.0",
  "@types/jest": "^30.0.0",
  "eslint": "^9.37.0",
  "@typescript-eslint/parser": "^8.45.0",
  "@typescript-eslint/eslint-plugin": "^8.45.0",
  "prettier": "latest"
}
```

## 🗄️ Data Models

### Company
- Company information
- Base currency setting
- Multi-tenant isolation

### User
- User authentication data
- Role-based permissions (Admin, Manager, Employee)
- Manager-employee relationships
- Company association

### Expense
- Expense details (amount, currency, date, description)
- Status tracking (Draft, Submitted, Approved, Rejected, Paid)
- Category association
- Currency conversion to base currency

### Approval Rules
- Amount-based approval thresholds
- Category-specific rules
- Sequential vs parallel approval workflows
- Configurable approver assignments

### Approval Logs
- Approval history tracking
- Approver actions and comments
- Timeline of approval process

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Role-Based Access Control**: Admin, Manager, Employee roles
- **Input Validation**: Comprehensive request validation
- **Rate Limiting**: Protection against brute force attacks
- **Security Headers**: Helmet.js for security headers
- **CORS**: Cross-origin request handling

## 🌍 Multi-Currency Support

- Automatic currency conversion using live exchange rates
- Support for major currencies (USD, EUR, GBP, INR, JPY, AUD, CAD, CHF, CNY)
- Base currency configuration per company
- Exchange rate caching and error handling

## 🔄 Approval Workflows

### Sequential Approval
- Approvals must be completed in order
- Next approver is notified only after previous approval
- Suitable for hierarchical approval processes

### Parallel Approval
- All approvers can approve simultaneously
- All approvals must be completed for final approval
- Suitable for consensus-based approvals

## 📊 Example Protected Route Usage

```typescript
// Example: Protected route that requires authentication
app.use('/api/users', authenticateToken, userRoutes);

// Example: Admin-only route
app.use('/api/approval-rules', authenticateToken, requireAdmin, ruleRoutes);

// Example: Manager or Admin route
app.use('/api/approvals/pending', authenticateToken, requireManagerOrAdmin, approvalController);
```

## 🚦 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Environment Variables**
   ```bash
   cp .env.example .env
   # Configure your MongoDB connection and JWT secret
   ```

3. **Build the Project**
   ```bash
   npm run build
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Run Tests**
   ```bash
   npm test
   ```

## 📝 API Response Format

All API responses follow a consistent format:

```json
{
  "success": true|false,
  "message": "Descriptive message",
  "data": {
    // Response data
  }
}
```

## 🔧 Configuration

### Environment Variables
- `PORT` - Server port (default: 3000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRES_IN` - JWT expiration time (default: 7d)
- `NODE_ENV` - Environment (development/production)

This backend provides a solid foundation for an expense management system with enterprise-grade features including authentication, authorization, approval workflows, and comprehensive API endpoints.