import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';
import { Company } from '../models/company.model';
import { setupTestDatabase, cleanupTestDatabase, closeTestDatabase } from './database.helper';

describe('Authentication Service', () => {
  let dbAvailable = false;

  beforeAll(async () => {
    dbAvailable = await setupTestDatabase();
  }, 8000);

  afterAll(async () => {
    if (dbAvailable) {
      await closeTestDatabase();
    }
  }, 15000);

  beforeEach(async () => {
    if (dbAvailable) {
      await cleanupTestDatabase();
    }
  });

  describe('password hashing (no database required)', () => {
    test('should hash passwords correctly', async () => {
      const password = 'testpassword123';
      const hashedPassword = await AuthService.hashPassword(password);
      
      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(50); // bcrypt hashes are long
      
      const isValid = await AuthService.comparePassword(password, hashedPassword);
      expect(isValid).toBe(true);
      
      const isInvalid = await AuthService.comparePassword('wrongpassword', hashedPassword);
      expect(isInvalid).toBe(false);
    });
  });

  // Database-dependent tests
  describe('signup (requires database)', () => {
    test('should create a new company and admin user', async () => {
      if (!dbAvailable) {
        console.log('Skipping test: Database not available');
        return;
      }

      const signupData = {
        companyName: 'Test Company',
        baseCurrency: 'USD',
        email: 'admin@test.com',
        password: 'password123',
        name: 'John Doe',
      };

      const result = await AuthService.signup(signupData);

      expect(result.user.email).toBe(signupData.email);
      expect(result.user.role).toBe('admin');
      expect(result.company.name).toBe(signupData.companyName);
      expect(result.token).toBeDefined();
      expect(typeof result.token).toBe('string');
    });

    test('should throw error for duplicate email', async () => {
      if (!dbAvailable) {
        console.log('Skipping test: Database not available');
        return;
      }

      const signupData = {
        companyName: 'Test Company',
        baseCurrency: 'USD',
        email: 'admin@test.com',
        password: 'password123',
        name: 'John Doe',
      };

      // First signup
      await AuthService.signup(signupData);

      // Second signup with same email should throw error
      await expect(AuthService.signup(signupData)).rejects.toThrow('already exists');
    });
  });

  describe('login (requires database)', () => {
    beforeEach(async () => {
      if (!dbAvailable) return;

      // Create a test user
      const signupData = {
        companyName: 'Test Company',
        baseCurrency: 'USD',
        email: 'admin@test.com',
        password: 'password123',
        name: 'John Doe',
      };

      try {
        await AuthService.signup(signupData);
      } catch (error) {
        console.log('Setup error:', error);
      }
    });

    test('should login with valid credentials', async () => {
      if (!dbAvailable) {
        console.log('Skipping test: Database not available');
        return;
      }

      const loginData = {
        email: 'admin@test.com',
        password: 'password123'
      };

      const result = await AuthService.login(loginData);

      expect(result.user.email).toBe(loginData.email);
      expect(result.token).toBeDefined();
      expect(typeof result.token).toBe('string');
    });

    test('should throw error for invalid email', async () => {
      if (!dbAvailable) {
        console.log('Skipping test: Database not available');
        return;
      }

      const loginData = {
        email: 'nonexistent@test.com',
        password: 'password123'
      };

      await expect(AuthService.login(loginData)).rejects.toThrow('Invalid email or password');
    });

    test('should throw error for invalid password', async () => {
      if (!dbAvailable) {
        console.log('Skipping test: Database not available');
        return;
      }

      const loginData = {
        email: 'admin@test.com',
        password: 'wrongpassword'
      };

      await expect(AuthService.login(loginData)).rejects.toThrow('Invalid email or password');
    });
  });
});