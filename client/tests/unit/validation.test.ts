import { 
  validateEmail, 
  validatePassword, 
  validatePasswordForRegistration,
  validatePasswordStrength,
  validateConfirmPassword,
  validateName,
  validateAuthForm,
  getPasswordStrengthColor,
  isFormValid,
  type PasswordStrength,
  type FormErrors
} from '../../src/utils/validation';

describe('Validation Utils - Unit Tests', () => {
  describe('validateEmail', () => {
    it('should return undefined for valid email formats', () => {
      const validEmails = [
        'test@mail.utoronto.ca',
        'user@example.com',
        'test+tag@domain.org',
        'jane.doe@university.edu',
        'admin@company.co.uk'
      ];

      validEmails.forEach(email => {
        expect(validateEmail(email)).toBeUndefined();
      });
    });

    it('should return error message for invalid email formats', () => {
      expect(validateEmail('invalid-email')).toBe('Please enter a valid email address');
      expect(validateEmail('test@')).toBe('Please enter a valid email address');
      expect(validateEmail('@domain.com')).toBe('Please enter a valid email address');
      expect(validateEmail('test.domain.com')).toBe('Please enter a valid email address');
      expect(validateEmail('user@')).toBe('Please enter a valid email address');
    });

    it('should return error for empty email', () => {
      expect(validateEmail('')).toBe('Email is required');
    });
  });

  describe('validatePassword', () => {
    it('should return undefined for any non-empty password (login validation)', () => {
      const passwords = ['any', 'simple', 'weak', 'StrongPass123!'];
      
      passwords.forEach(password => {
        expect(validatePassword(password)).toBeUndefined();
      });
    });

    it('should return error for empty password', () => {
      expect(validatePassword('')).toBe('Password is required');
    });
  });

  describe('validatePasswordForRegistration', () => {
    it('should return undefined for strong passwords', () => {
      const strongPasswords = [
        'StrongPass123!',
        'MySecure@Pass2024',
        'ComplexP@ssw0rd!'
      ];

      strongPasswords.forEach(password => {
        expect(validatePasswordForRegistration(password)).toBeUndefined();
      });
    });

    it('should return error for weak passwords', () => {
      expect(validatePasswordForRegistration('weak')).toBe('Password does not meet strength requirements');
      expect(validatePasswordForRegistration('12345678')).toBe('Password does not meet strength requirements');
      expect(validatePasswordForRegistration('onlyletters')).toBe('Password does not meet strength requirements');
      expect(validatePasswordForRegistration('ONLYUPPER123')).toBe('Password does not meet strength requirements');
    });

    it('should return error for empty password', () => {
      expect(validatePasswordForRegistration('')).toBe('Password is required');
    });
  });

  describe('validatePasswordStrength', () => {
    it('should return low score for weak passwords', () => {
      const weakPasswords = ['weak', '123', 'password'];
      
      weakPasswords.forEach(password => {
        const result = validatePasswordStrength(password);
        expect(result.score).toBeLessThan(3);
        expect(result.messages.length).toBeGreaterThan(0);
      });
    });

    it('should return high score for strong passwords', () => {
      const strongPasswords = [
        'StrongPassword123!',
        'MyVerySecure@Pass2024',
        'ComplexP@ssw0rd!123'
      ];

      strongPasswords.forEach(password => {
        const result = validatePasswordStrength(password);
        expect(result.score).toBe(5);
        expect(result.messages).toHaveLength(0);
      });
    });

    it('should provide specific feedback messages', () => {
      const result = validatePasswordStrength('short');
      expect(result.messages).toContain('Password must be at least 8 characters long');
      expect(result.messages).toContain('Include at least one uppercase letter');
      expect(result.messages).toContain('Include at least one number');
      expect(result.messages).toContain('Include at least one special character');
    });

    it('should incrementally increase score based on complexity', () => {
      const passwords = [
        'weak',                    // 0-1 points
        'longenough',             // 1 point (length only)
        'LongEnough',             // 2 points (length + uppercase)
        'LongEnough123',          // 3 points (length + uppercase + numbers)
        'LongEnough123!',         // 4-5 points (all requirements)
      ];

      const scores = passwords.map(pwd => validatePasswordStrength(pwd).score);
      
      // Verify scores generally increase
      expect(scores[0]).toBeLessThanOrEqual(scores[1]);
      expect(scores[1]).toBeLessThanOrEqual(scores[2]);
      expect(scores[2]).toBeLessThanOrEqual(scores[3]);
      expect(scores[3]).toBeLessThanOrEqual(scores[4]);
    });
  });

  describe('validateConfirmPassword', () => {
    it('should return undefined for matching passwords', () => {
      expect(validateConfirmPassword('password123', 'password123')).toBeUndefined();
      expect(validateConfirmPassword('', '')).toBeUndefined();
      expect(validateConfirmPassword('ComplexP@ss123!', 'ComplexP@ss123!')).toBeUndefined();
    });

    it('should return error for non-matching passwords', () => {
      expect(validateConfirmPassword('password123', 'different456')).toBe('Passwords do not match');
      expect(validateConfirmPassword('Password123', 'password123')).toBe('Passwords do not match');
      expect(validateConfirmPassword('password123', '')).toBe('Passwords do not match');
      expect(validateConfirmPassword('', 'password123')).toBe('Passwords do not match');
    });
  });

  describe('validateName', () => {
    it('should return undefined for valid names', () => {
      const validNames = [
        'John Doe',
        'Jane Smith-Wilson',
        'María García',
        'Dr. Sarah Johnson',
        'Jean-Pierre Dubois'
      ];

      validNames.forEach(name => {
        expect(validateName(name)).toBeUndefined();
      });
    });

    it('should return error for empty or whitespace-only names', () => {
      expect(validateName('')).toBe('Full name is required');
      expect(validateName('   ')).toBe('Full name is required');
      expect(validateName('\t\n')).toBe('Full name is required');
    });

    it('should return error for names too short', () => {
      expect(validateName('J')).toBe('Full name must be at least 2 characters');
      expect(validateName(' A ')).toBe('Full name must be at least 2 characters');
    });
  });

  describe('getPasswordStrengthColor', () => {
    it('should return appropriate colors for different scores', () => {
      expect(getPasswordStrengthColor(0)).toBe('text-red-500');
      expect(getPasswordStrengthColor(1)).toBe('text-red-500');
      expect(getPasswordStrengthColor(2)).toBe('text-red-500');
      expect(getPasswordStrengthColor(3)).toBe('text-orange-500');
      expect(getPasswordStrengthColor(4)).toBe('text-yellow-500');
      expect(getPasswordStrengthColor(5)).toBe('text-green-500');
    });
  });

  describe('validateAuthForm', () => {
    describe('login validation', () => {
      it('should validate correct login form', () => {
        const validLogin = {
          email: 'test@example.com',
          password: 'anypassword'
        };
        const errors = validateAuthForm(validLogin, true);
        expect(Object.keys(errors)).toHaveLength(0);
      });

      it('should return errors for invalid login form', () => {
        const invalidLogin = {
          email: 'invalid-email',
          password: ''
        };
        const errors = validateAuthForm(invalidLogin, true);
        expect(errors.email).toBe('Please enter a valid email address');
        expect(errors.password).toBe('Password is required');
      });

      it('should not validate password strength for login', () => {
        const loginWithWeakPassword = {
          email: 'test@example.com',
          password: 'weak'
        };
        const errors = validateAuthForm(loginWithWeakPassword, true);
        expect(errors.password).toBeUndefined();
      });
    });

    describe('registration validation', () => {
      it('should validate correct registration form', () => {
        const validRegistration = {
          email: 'test@example.com',
          password: 'StrongPass123!',
          confirmPassword: 'StrongPass123!',
          name: 'John Doe'
        };
        const errors = validateAuthForm(validRegistration, false);
        expect(Object.keys(errors)).toHaveLength(0);
      });

      it('should return errors for invalid registration form', () => {
        const invalidRegistration = {
          email: 'invalid-email',
          password: 'weak',
          confirmPassword: 'different',
          name: ''
        };
        const errors = validateAuthForm(invalidRegistration, false);
        expect(errors.email).toBe('Please enter a valid email address');
        expect(errors.password).toBe('Password does not meet strength requirements');
        expect(errors.confirmPassword).toBe('Passwords do not match');
        expect(errors.name).toBe('Full name is required');
      });

      it('should validate password strength for registration', () => {
        const registrationWithWeakPassword = {
          email: 'test@example.com',
          password: 'weak',
          confirmPassword: 'weak',
          name: 'John Doe'
        };
        const errors = validateAuthForm(registrationWithWeakPassword, false);
        expect(errors.password).toBe('Password does not meet strength requirements');
      });
    });
  });

  describe('isFormValid', () => {
    it('should return true for empty errors object', () => {
      expect(isFormValid({})).toBe(true);
    });

    it('should return false for errors object with any errors', () => {
      expect(isFormValid({ email: 'Invalid email' })).toBe(false);
      expect(isFormValid({ password: 'Required' })).toBe(false);
      expect(isFormValid({ password: 'Required', email: 'Also invalid' })).toBe(false);
    });

    it('should return true if all error values are undefined', () => {
      expect(isFormValid({ 
        email: undefined, 
        password: undefined, 
        name: undefined 
      })).toBe(true);
    });
  });
}); 