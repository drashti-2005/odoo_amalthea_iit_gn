import { validateEmail, validatePassword, validateCurrency } from '../utils/validators';

describe('Validators', () => {
  describe('validateEmail', () => {
    test('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('admin@company.org')).toBe(true);
    });

    test('should reject invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    test('should validate password length', () => {
      const result1 = validatePassword('123456');
      expect(result1.isValid).toBe(true);
      expect(result1.errors).toHaveLength(0);

      const result2 = validatePassword('12345');
      expect(result2.isValid).toBe(false);
      expect(result2.errors).toContain('Password must be at least 6 characters long');
    });
  });

  describe('validateCurrency', () => {
    test('should validate supported currencies', () => {
      expect(validateCurrency('USD')).toBe(true);
      expect(validateCurrency('EUR')).toBe(true);
      expect(validateCurrency('GBP')).toBe(true);
      expect(validateCurrency('usd')).toBe(true); // should handle lowercase
    });

    test('should reject unsupported currencies', () => {
      expect(validateCurrency('XYZ')).toBe(false);
      expect(validateCurrency('')).toBe(false);
      expect(validateCurrency('INVALID')).toBe(false);
    });
  });
});