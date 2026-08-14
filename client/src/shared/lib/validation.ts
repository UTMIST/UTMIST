/**
 * Form validation utilities
 */

export interface PasswordStrength {
  score: number;
  messages: string[];
}

export interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
}

/**
 * Validate email format
 * @param email - Email to validate
 * @returns string | undefined - Error message or undefined if valid
 */
export const validateEmail = (email: string): string | undefined => {
  if (!email) {
    return 'Email is required';
  }
  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Please enter a valid email address';
  }
  
  return undefined;
};

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns PasswordStrength - Score and validation messages
 */
export const validatePasswordStrength = (password: string): PasswordStrength => {
  const messages: string[] = [];
  let score = 0;

  // Length check
  if (password.length < 8) {
    messages.push('Password must be at least 8 characters long');
  } else {
    score += 1;
  }

  // Uppercase check
  if (!/[A-Z]/.test(password)) {
    messages.push('Include at least one uppercase letter');
  } else {
    score += 1;
  }

  // Lowercase check
  if (!/[a-z]/.test(password)) {
    messages.push('Include at least one lowercase letter');
  } else {
    score += 1;
  }

  // Number check
  if (!/[0-9]/.test(password)) {
    messages.push('Include at least one number');
  } else {
    score += 1;
  }

  // Special character check
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    messages.push('Include at least one special character');
  } else {
    score += 1;
  }

  return { score, messages };
};

/**
 * Get password strength color based on score
 * @param score - Password strength score (0-5)
 * @returns string - Tailwind CSS color class
 */
export const getPasswordStrengthColor = (score: number): string => {
  if (score <= 2) return 'text-red-500';
  if (score <= 3) return 'text-orange-500';
  if (score <= 4) return 'text-yellow-500';
  return 'text-green-500';
};

/**
 * Validate password for login (basic validation)
 * @param password - Password to validate
 * @returns string | undefined - Error message or undefined if valid
 */
export const validatePassword = (password: string): string | undefined => {
  if (!password) {
    return 'Password is required';
  }
  
  return undefined;
};

/**
 * Validate password for registration (strength validation)
 * @param password - Password to validate
 * @returns string | undefined - Error message or undefined if valid
 */
export const validatePasswordForRegistration = (password: string): string | undefined => {
  const basicError = validatePassword(password);
  if (basicError) return basicError;
  
  const { messages } = validatePasswordStrength(password);
  if (messages.length > 0) {
    return 'Password does not meet strength requirements';
  }
  
  return undefined;
};

/**
 * Validate password confirmation
 * @param password - Original password
 * @param confirmPassword - Confirmation password
 * @returns string | undefined - Error message or undefined if valid
 */
export const validateConfirmPassword = (password: string, confirmPassword: string): string | undefined => {
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  
  return undefined;
};

/**
 * Validate full name
 * @param name - Name to validate
 * @returns string | undefined - Error message or undefined if valid
 */
export const validateName = (name: string): string | undefined => {
  if (!name || name.trim().length === 0) {
    return 'Full name is required';
  }
  
  if (name.trim().length < 2) {
    return 'Full name must be at least 2 characters';
  }
  
  return undefined;
};

/**
 * Validate phone number based on country
 */
export const validatePhoneNumber = (number: string, country: string): boolean => {
  const digits = number.replace(/\D/g, '');
  switch (country) {
    case 'Canada':
    case 'United States':
    case 'Canada/USA':
      return /^\d{10}$/.test(digits);
    case 'United Kingdom':
      return /^\d{10,11}$/.test(digits);
    case 'India':
      return /^\d{10}$/.test(digits);
    case 'Australia':
      return /^\d{9}$/.test(digits);
    case 'Japan':
      return /^\d{10,11}$/.test(digits);
    case 'China':
      return /^\d{11}$/.test(digits);
    default:
      return /^\d{6,}$/.test(digits);
  }
};

/**
 * Validate postal code based on country
 */
export const validatePostalCode = (postalCode: string, country: string): boolean => {
  if (country === 'Canada') {
    return /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(postalCode);
  } else if (country === 'United States') {
    return /^\d{5}(-\d{4})?$/.test(postalCode);
  } else {
    return postalCode.length > 0;
  }
};

/**
 * Validate entire form for authentication
 * @param formData - Form data to validate
 * @param isLogin - Whether this is login (true) or registration (false)
 * @returns FormErrors - Object containing field-specific errors
 */
export const validateAuthForm = (
  formData: {
    email: string;
    password: string;
    confirmPassword?: string;
    name?: string;
  },
  isLogin: boolean
): FormErrors => {
  const errors: FormErrors = {};

  // Email validation
  const emailError = validateEmail(formData.email);
  if (emailError) {
    errors.email = emailError;
  }

  // Password validation
  if (isLogin) {
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      errors.password = passwordError;
    }
  } else {
    const passwordError = validatePasswordForRegistration(formData.password);
    if (passwordError) {
      errors.password = passwordError;
    }

    // Registration-specific validations
    if (formData.name !== undefined) {
      const nameError = validateName(formData.name);
      if (nameError) {
        errors.name = nameError;
      }
    }

    if (formData.confirmPassword !== undefined) {
      const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);
      if (confirmPasswordError) {
        errors.confirmPassword = confirmPasswordError;
      }
    }
  }

  return errors;
};

/**
 * Check if form has any errors
 * @param errors - FormErrors object
 * @returns boolean - True if form is valid (no errors)
 */
export const isFormValid = (errors: FormErrors): boolean => {
  return Object.values(errors).every(error => error === undefined);
}; 