# API Documentation for Frontend Developer

## Base URL
```
http://localhost:3000/api
```

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Common Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## Endpoints

### Health Check

#### GET /health
Check if the server is running.

**Authentication:** Not required

**Response:**
```json
{
  "success": true,
  "message": "Server is healthy",
  "data": {
    "status": "ok",
    "timestamp": "2025-10-04T00:00:00.000Z"
  }
}
```

---

## Authentication Routes (Base: /auth)

### POST /auth/signup
Create a new company and admin user.

**Authentication:** Not required

**Request Body:**
```json
{
  "name": "Company Name",
  "baseCurrency": "USD",
  "email": "admin@company.com",
  "password": "password123",
  "country": "United States"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Company and admin user created successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "Admin Name",
      "email": "admin@company.com",
      "role": "admin",
      "companyId": "company_id"
    },
    "company": {
      "_id": "company_id",
      "name": "Company Name",
      "baseCurrency": "USD",
      "country": "United States"
    },
    "token": "jwt_token_here"
  }
}
```

### POST /auth/login
Login with email and password.

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "user@company.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "User Name",
      "email": "user@company.com",
      "role": "employee",
      "companyId": "company_id"
    },
    "company": {
      "_id": "company_id",
      "name": "Company Name",
      "baseCurrency": "USD"
    },
    "token": "jwt_token_here"
  }
}
```

### POST /auth/users/:id/send-password
Send password to a user (password reset functionality).

**Authentication:** Not required

**URL Parameters:**
- `id` (string): User ID

**Response:**
```json
{
  "success": true,
  "message": "Password sent successfully"
}
```

---

## User Routes (Base: /users)

**Authentication:** Required for all routes

### POST /users
Create a new user (Admin only).

**Required Role:** Admin

**Request Body:**
```json
{
  "name": "Employee Name",
  "email": "employee@company.com",
  "password": "password123",
  "role": "employee",
  "managerId": "manager_user_id" // Optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "Employee Name",
      "email": "employee@company.com",
      "role": "employee",
      "companyId": "company_id",
      "isActive": true
    }
  }
}
```

### GET /users
Get users with optional filtering.

**Query Parameters:**
- `role` (optional): Filter by role (admin, manager, employee)
- `isActive` (optional): Filter by active status (true/false)
- `page` (optional): Page number for pagination
- `limit` (optional): Number of users per page

**Response:**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [
      {
        "_id": "user_id",
        "name": "User Name",
        "email": "user@company.com",
        "role": "employee",
        "isActive": true,
        "managerId": "manager_id"
      }
    ]
  }
}
```

### GET /users/:id
Get user by ID.

**URL Parameters:**
- `id` (string): User ID

**Response:**
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "User Name",
      "email": "user@company.com",
      "role": "employee",
      "isActive": true,
      "managerId": "manager_id"
    }
  }
}
```

### PUT /users/:id
Update user information.

**URL Parameters:**
- `id` (string): User ID

**Request Body:**
```json
{
  "name": "Updated Name",
  "role": "manager",
  "managerId": "new_manager_id",
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "Updated Name",
      "email": "user@company.com",
      "role": "manager",
      "isActive": true
    }
  }
}
```

---

## Category Routes (Base: /categories)

**Authentication:** Required for all routes

### POST /categories
Create a new expense category (Admin only).

**Required Role:** Admin

**Request Body:**
```json
{
  "name": "Travel",
  "description": "Travel related expenses",
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "category": {
      "_id": "category_id",
      "name": "Travel",
      "description": "Travel related expenses",
      "companyId": "company_id",
      "isActive": true
    }
  }
}
```

### GET /categories
Get all categories for the company.

**Response:**
```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": {
    "categories": [
      {
        "_id": "category_id",
        "name": "Travel",
        "description": "Travel related expenses",
        "isActive": true
      }
    ]
  }
}
```

### GET /categories/:id
Get category by ID.

**URL Parameters:**
- `id` (string): Category ID

**Response:**
```json
{
  "success": true,
  "message": "Category retrieved successfully",
  "data": {
    "category": {
      "_id": "category_id",
      "name": "Travel",
      "description": "Travel related expenses",
      "isActive": true
    }
  }
}
```

### PUT /categories/:id
Update category (Admin only).

**Required Role:** Admin

**URL Parameters:**
- `id` (string): Category ID

**Request Body:**
```json
{
  "name": "Updated Travel",
  "description": "Updated description",
  "isActive": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "category": {
      "_id": "category_id",
      "name": "Updated Travel",
      "description": "Updated description",
      "isActive": false
    }
  }
}
```

### DELETE /categories/:id
Delete category (Admin only).

**Required Role:** Admin

**URL Parameters:**
- `id` (string): Category ID

**Response:**
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

---

## Expense Routes (Base: /expenses)

**Authentication:** Required for all routes

### POST /expenses
Create a new expense (draft status).

**Request Body:**
```json
{
  "categoryId": "category_id",
  "title": "Lunch Meeting",
  "description": "Business lunch with client",
  "amount": 150.50,
  "currency": "USD",
  "expenseDate": "2025-10-04T12:00:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Expense created successfully",
  "data": {
    "expense": {
      "_id": "expense_id",
      "title": "Lunch Meeting",
      "description": "Business lunch with client",
      "amount": 150.50,
      "currency": "USD",
      "status": "draft",
      "expenseDate": "2025-10-04T12:00:00.000Z",
      "categoryId": {
        "_id": "category_id",
        "name": "Meals"
      },
      "userId": {
        "_id": "user_id",
        "name": "User Name",
        "email": "user@company.com"
      }
    }
  }
}
```

### POST /expenses/:id/submit
Submit expense for approval.

**URL Parameters:**
- `id` (string): Expense ID

**Response:**
```json
{
  "success": true,
  "message": "Expense submitted for approval successfully",
  "data": {
    "expense": {
      "_id": "expense_id",
      "title": "Lunch Meeting",
      "status": "submitted",
      "submittedAt": "2025-10-04T14:00:00.000Z"
    }
  }
}
```

### POST /expenses/:id/receipts
Upload receipt for expense.

**URL Parameters:**
- `id` (string): Expense ID

**Request Body:** (FormData or JSON with base64)
```json
{
  "filename": "receipt.jpg",
  "data": "base64_encoded_image_data",
  "mimeType": "image/jpeg"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Receipt uploaded successfully",
  "data": {
    "receipt": {
      "_id": "receipt_id",
      "expenseId": "expense_id",
      "filename": "receipt.jpg",
      "url": "storage_url_or_path"
    }
  }
}
```

### GET /expenses
Get expenses with filtering options.

**Query Parameters:**
- `status` (optional): Filter by status (draft, submitted, approved, rejected, paid)
- `categoryId` (optional): Filter by category
- `startDate` (optional): Filter expenses from this date
- `endDate` (optional): Filter expenses until this date
- `page` (optional): Page number for pagination
- `limit` (optional): Number of expenses per page

**Response:**
```json
{
  "success": true,
  "message": "Expenses retrieved successfully",
  "data": {
    "expenses": [
      {
        "_id": "expense_id",
        "title": "Lunch Meeting",
        "amount": 150.50,
        "currency": "USD",
        "status": "submitted",
        "expenseDate": "2025-10-04T12:00:00.000Z",
        "categoryId": {
          "_id": "category_id",
          "name": "Meals"
        }
      }
    ]
  }
}
```

### GET /expenses/:id
Get expense by ID with full details.

**URL Parameters:**
- `id` (string): Expense ID

**Response:**
```json
{
  "success": true,
  "message": "Expense retrieved successfully",
  "data": {
    "expense": {
      "_id": "expense_id",
      "title": "Lunch Meeting",
      "description": "Business lunch with client",
      "amount": 150.50,
      "currency": "USD",
      "status": "approved",
      "expenseDate": "2025-10-04T12:00:00.000Z",
      "submittedAt": "2025-10-04T14:00:00.000Z",
      "approvedAt": "2025-10-04T16:00:00.000Z",
      "categoryId": {
        "_id": "category_id",
        "name": "Meals"
      },
      "userId": {
        "_id": "user_id",
        "name": "User Name",
        "email": "user@company.com"
      },
      "receipts": [
        {
          "_id": "receipt_id",
          "filename": "receipt.jpg",
          "url": "storage_url"
        }
      ]
    }
  }
}
```

---

## Approval Routes (Base: /approvals)

**Authentication:** Required for all routes

### GET /approvals/pending
Get pending approvals (Manager/Admin only).

**Required Role:** Manager or Admin

**Query Parameters:**
- `page` (optional): Page number for pagination
- `limit` (optional): Number of approvals per page

**Response:**
```json
{
  "success": true,
  "message": "Pending approvals retrieved successfully",
  "data": {
    "approvals": [
      {
        "_id": "approval_log_id",
        "expenseId": {
          "_id": "expense_id",
          "title": "Business Lunch",
          "amount": 150.50,
          "currency": "USD",
          "userId": {
            "name": "Employee Name",
            "email": "employee@company.com"
          }
        },
        "approverId": "manager_id",
        "status": "pending",
        "level": 1,
        "createdAt": "2025-10-04T14:00:00.000Z"
      }
    ]
  }
}
```

### POST /approvals/:log_id/approve
Approve an expense (Manager/Admin only).

**Required Role:** Manager or Admin

**URL Parameters:**
- `log_id` (string): Approval Log ID

**Request Body:**
```json
{
  "comments": "Approved - valid business expense"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Expense approved successfully",
  "data": {
    "approvalLog": {
      "_id": "approval_log_id",
      "status": "approved",
      "comments": "Approved - valid business expense",
      "approvedAt": "2025-10-04T16:00:00.000Z"
    }
  }
}
```

### POST /approvals/:log_id/reject
Reject an expense (Manager/Admin only).

**Required Role:** Manager or Admin

**URL Parameters:**
- `log_id` (string): Approval Log ID

**Request Body:**
```json
{
  "reason": "Receipt is not clear, please resubmit with better quality"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Expense rejected successfully",
  "data": {
    "approvalLog": {
      "_id": "approval_log_id",
      "status": "rejected",
      "reason": "Receipt is not clear, please resubmit with better quality",
      "rejectedAt": "2025-10-04T16:00:00.000Z"
    }
  }
}
```

### GET /approvals/history/:expenseId
Get approval history for an expense.

**URL Parameters:**
- `expenseId` (string): Expense ID

**Response:**
```json
{
  "success": true,
  "message": "Approval history retrieved successfully",
  "data": {
    "history": [
      {
        "_id": "approval_log_id",
        "approverId": {
          "_id": "manager_id",
          "name": "Manager Name",
          "email": "manager@company.com"
        },
        "status": "approved",
        "level": 1,
        "comments": "Approved - valid business expense",
        "approvedAt": "2025-10-04T16:00:00.000Z"
      }
    ]
  }
}
```

---

## Approval Rules Routes (Base: /approval-rules)

**Authentication:** Required for all routes

### POST /approval-rules
Create a new approval rule (Admin only).

**Required Role:** Admin

**Request Body:**
```json
{
  "name": "High Value Expenses",
  "description": "Expenses above $500 require manager approval",
  "minAmount": 500,
  "maxAmount": 10000,
  "currency": "USD",
  "categoryId": "category_id", // Optional
  "approvers": [
    {
      "level": 1,
      "approverId": "manager_id",
      "isRequired": true
    }
  ],
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Approval rule created successfully",
  "data": {
    "rule": {
      "_id": "rule_id",
      "name": "High Value Expenses",
      "description": "Expenses above $500 require manager approval",
      "minAmount": 500,
      "maxAmount": 10000,
      "currency": "USD",
      "isActive": true,
      "approvers": [
        {
          "level": 1,
          "approverId": "manager_id",
          "isRequired": true
        }
      ]
    }
  }
}
```

### GET /approval-rules
Get all approval rules for the company.

**Response:**
```json
{
  "success": true,
  "message": "Approval rules retrieved successfully",
  "data": {
    "rules": [
      {
        "_id": "rule_id",
        "name": "High Value Expenses",
        "minAmount": 500,
        "maxAmount": 10000,
        "currency": "USD",
        "isActive": true
      }
    ]
  }
}
```

### GET /approval-rules/:id
Get approval rule by ID.

**URL Parameters:**
- `id` (string): Rule ID

**Response:**
```json
{
  "success": true,
  "message": "Approval rule retrieved successfully",
  "data": {
    "rule": {
      "_id": "rule_id",
      "name": "High Value Expenses",
      "description": "Expenses above $500 require manager approval",
      "minAmount": 500,
      "maxAmount": 10000,
      "currency": "USD",
      "categoryId": "category_id",
      "isActive": true,
      "approvers": [
        {
          "level": 1,
          "approverId": {
            "_id": "manager_id",
            "name": "Manager Name",
            "email": "manager@company.com"
          },
          "isRequired": true
        }
      ]
    }
  }
}
```

### PUT /approval-rules/:id
Update approval rule (Admin only).

**Required Role:** Admin

**URL Parameters:**
- `id` (string): Rule ID

**Request Body:**
```json
{
  "name": "Updated Rule Name",
  "minAmount": 1000,
  "maxAmount": 15000,
  "isActive": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Approval rule updated successfully",
  "data": {
    "rule": {
      "_id": "rule_id",
      "name": "Updated Rule Name",
      "minAmount": 1000,
      "maxAmount": 15000,
      "isActive": false
    }
  }
}
```

---

## Data Types & Enums

### User Roles
```typescript
enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  EMPLOYEE = 'employee'
}
```

### Expense Status
```typescript
enum ExpenseStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PAID = 'paid'
}
```

### Approval Status
```typescript
enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Authentication required or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 500 | Internal Server Error - Server error |

---

## Notes for Frontend Development

1. **Authentication**: Store the JWT token securely and include it in all authenticated requests.

2. **Error Handling**: Always check the `success` field in the response to determine if the operation was successful.

3. **Pagination**: Some endpoints support pagination with `page` and `limit` query parameters.

4. **File Uploads**: For receipt uploads, you can send files as base64 encoded strings or use FormData.

5. **Date Formats**: All dates should be in ISO 8601 format (e.g., "2025-10-04T12:00:00.000Z").

6. **Currency**: Always include currency information with amounts.

7. **Role-based Access**: Check user roles before showing certain UI elements (Admin-only features, Manager approvals, etc.).

8. **Real-time Updates**: Consider implementing WebSocket connections for real-time approval notifications.