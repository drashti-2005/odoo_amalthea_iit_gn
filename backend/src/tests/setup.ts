// Jest setup file
import 'jest';

// Global test setup
beforeAll(async () => {
  // Setup global test configuration
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing';
  
  console.log('Test environment setup complete');
}, 10000);

// Clean up after all tests
afterAll(async () => {
  console.log('Test cleanup complete');
}, 10000);