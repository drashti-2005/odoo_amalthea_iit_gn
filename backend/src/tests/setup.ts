// Jest setup file
import 'jest';

// Global test setup
beforeAll(() => {
  // Setup global test configuration
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-jwt-secret';
  process.env.MONGODB_URI = 'mongodb://localhost:27017/test_db';
});

// Mock console.log in tests to reduce noise
global.console = {
  ...console,
  log: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};