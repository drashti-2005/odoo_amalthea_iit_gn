# Odoo Amalthea Backend

A scalable Node.js + Express + TypeScript backend for the Odoo Amalthea IIT GN project.

## 🚀 Features

- **TypeScript** for type safety
- **Express.js** web framework
- **Layered Architecture** with separation of concerns
- **MongoDB** with Mongoose ODM
- **JWT Authentication** ready
- **Error Handling** middleware
- **Logging** with Winston
- **Testing** with Jest
- **Code Quality** with ESLint and Prettier
- **Security** headers with Helmet
- **CORS** enabled
- **Environment Configuration**

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   └── database.ts  # Database connection
│   ├── controllers/     # Route handlers
│   │   └── HealthController.ts
│   ├── services/        # Business logic
│   │   └── HealthService.ts
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   │   └── healthRoutes.ts
│   ├── middlewares/     # Custom middlewares
│   │   ├── errorHandler.ts
│   │   └── notFoundHandler.ts
│   ├── utils/           # Helper functions
│   │   ├── constants.ts
│   │   ├── logger.ts
│   │   └── validators.ts
│   ├── types/           # TypeScript types
│   │   ├── api.ts
│   │   └── user.ts
│   ├── tests/           # Test files
│   │   └── health.test.ts
│   └── index.ts         # Entry point
├── .env.example         # Environment variables template
├── .eslintrc.js         # ESLint configuration
├── .prettierrc          # Prettier configuration
├── jest.config.js       # Jest configuration
├── package.json         # Dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```

## 🛠️ Installation

1. **Copy environment variables:**
   ```bash
   cp .env.example .env
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

## 📦 Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🔗 API Endpoints

### Health Check
- **GET** `/api/health` - System health status

## 🧪 Testing

Run tests with:
```bash
npm test
```

## 📝 Environment Variables

See `.env.example` for all available environment variables.

## 🏗️ Architecture

This project follows a layered architecture:

1. **Routes** - Define API endpoints
2. **Controllers** - Handle HTTP requests/responses
3. **Services** - Contain business logic
4. **Models** - Database schemas and operations
5. **Middlewares** - Cross-cutting concerns
6. **Utils** - Helper functions and utilities