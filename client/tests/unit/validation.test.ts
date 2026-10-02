import {
  validateEmail,
  validatePassword,
  validatePasswordForRegistration,
  validatePasswordStrength,
  validateConfirmPassword,
  validateName,
  validateAuthForm,
  isFormValid
} from '@/shared/lib';

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
      expect(validateEmail('invalid-email')).toEqual(expect.any(String));
      expect(validateEmail('test@')).toEqual(expect.any(String));
      expect(validateEmail('@domain.com')).toEqual(expect.any(String));
      expect(validateEmail('test.domain.com')).toEqual(expect.any(String));
      expect(validateEmail('user@')).toEqual(expect.any(String));
    });

    it('should return error for empty email', () => {
      expect(validateEmail('')).toEqual(expect.any(String));
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
      expect(validatePassword('')).toEqual(expect.any(String));
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
      expect(validatePasswordForRegistration('weak')).toEqual(expect.any(String));
      expect(validatePasswordForRegistration('12345678')).toEqual(expect.any(String));
      expect(validatePasswordForRegistration('onlyletters')).toEqual(expect.any(String));
      expect(validatePasswordForRegistration('ONLYUPPER123')).toEqual(expect.any(String));
    });

    it('should return error for empty password', () => {
      expect(validatePasswordForRegistration('')).toEqual(expect.any(String));
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
      expect(validateConfirmPassword('password123', 'different456')).toEqual(expect.any(String));
      expect(validateConfirmPassword('Password123', 'password123')).toEqual(expect.any(String));
      expect(validateConfirmPassword('password123', '')).toEqual(expect.any(String));
      expect(validateConfirmPassword('', 'password123')).toEqual(expect.any(String));
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
      expect(validateName('')).toEqual(expect.any(String));
      expect(validateName('   ')).toEqual(expect.any(String));
      expect(validateName('\t\n')).toEqual(expect.any(String));
    });

    it('should return error for names too short', () => {
      expect(validateName('J')).toEqual(expect.any(String));
      expect(validateName(' A ')).toEqual(expect.any(String));
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
        expect(errors.email).toEqual(expect.any(String));
        expect(errors.password).toEqual(expect.any(String));
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
        expect(errors.email).toEqual(expect.any(String));
        expect(errors.password).toEqual(expect.any(String));
        expect(errors.confirmPassword).toEqual(expect.any(String));
        expect(errors.name).toEqual(expect.any(String));
      });

      it('should validate password strength for registration', () => {
        const registrationWithWeakPassword = {
          email: 'test@example.com',
          password: 'weak',
          confirmPassword: 'weak',
          name: 'John Doe'
        };
        const errors = validateAuthForm(registrationWithWeakPassword, false);
        expect(errors.password).toEqual(expect.any(String));
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
