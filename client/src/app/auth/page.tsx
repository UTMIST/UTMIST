'use client';

import { useState } from 'react';
import Image from 'next/image';
import logo from '@/assets/logos/utmist-logo-small.svg';
import { useRouter } from 'next/navigation';
import { login, register } from '@/utils/auth';

interface PasswordStrength {
  score: number;
  messages: string[];
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
}

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    organization: ''
  });

  const validatePasswordStrength = (password: string): PasswordStrength => {
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

  const getPasswordStrengthColor = (score: number): string => {
    if (score <= 2) return 'text-red-500';
    if (score <= 3) return 'text-orange-500';
    if (score <= 4) return 'text-yellow-500';
    return 'text-green-500';
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    let isValid = true;

    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (!isLogin) {
      const { messages } = validatePasswordStrength(formData.password);
      if (messages.length > 0) {
        isValid = false;
      }
    }

    // Registration-specific validations
    if (!isLogin) {
      if (!formData.name) {
        errors.name = 'Full name is required';
        isValid = false;
      }

      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
        isValid = false;
      }
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFormErrors({});

    if (!validateForm()) {
      return;
    }

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.email, formData.password, formData.name, formData.organization);
      }
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear the specific error when user starts typing
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const passwordStrength = !isLogin ? validatePasswordStrength(formData.password) : { score: 0, messages: [] };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-[var(--background)]">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-2xl border border-[var(--gray3)] shadow-sm space-y-8">
          <div className="flex flex-col items-center">
            <Image src={logo} alt="UTMIST Logo" width={48} height={48} className="mb-4" />
            <h2 className="text-center text-3xl font-bold tracking-tight text-black font-[var(--font-space-grotesk)]">
              {isLogin ? 'Log In' : 'Create Account'}
            </h2>
            <p className="mt-2 text-center text-sm text-[var(--gray4)] font-[var(--system-font)]">
              {isLogin ? (
                <>
                  New to UTMIST?{' '}
                  <button
                    onClick={() => {
                      setIsLogin(false);
                      setFormErrors({});
                      setError('');
                    }}
                    className="font-medium text-[var(--secondary)] hover:opacity-80 transition-opacity"
                  >
                    Create an account
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    onClick={() => {
                      setIsLogin(true);
                      setFormErrors({});
                      setError('');
                    }}
                    className="font-medium text-[var(--secondary)] hover:opacity-80 transition-opacity"
                  >
                    Log in
                  </button>
                </>
              )}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm whitespace-pre-line" role="alert">
              {error}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--gray4)] font-[var(--system-font)]">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="your.email@mail.utoronto.ca"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`block w-full px-4 py-3 rounded-lg border ${
                    formErrors.email ? 'border-red-500' : 'border-[var(--gray3)]'
                  } shadow-sm focus:ring-2 focus:ring-[var(--secondary)] focus:border-transparent font-[var(--system-font)] text-black placeholder-[var(--gray2)]`}
                />
              </div>
              {formErrors.email && (
                <p className="mt-2 text-sm text-red-500">{formErrors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--gray4)] font-[var(--system-font)]">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  placeholder={isLogin ? "Enter your password" : "Create a strong password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`block w-full px-4 py-3 rounded-lg border ${
                    formErrors.password ? 'border-red-500' : 'border-[var(--gray3)]'
                  } shadow-sm focus:ring-2 focus:ring-[var(--secondary)] focus:border-transparent font-[var(--system-font)] text-black placeholder-[var(--gray2)]`}
                />
              </div>
              {formErrors.password && (
                <p className="mt-2 text-sm text-red-500">{formErrors.password}</p>
              )}
              {!isLogin && formData.password && (
                <div className="mt-2">
                  <div className={`text-sm ${getPasswordStrengthColor(passwordStrength.score)}`}>
                    Password Strength: {passwordStrength.score}/5
                  </div>
                  {passwordStrength.messages.length > 0 && (
                    <ul className="mt-1 text-sm text-[var(--gray4)] list-disc list-inside">
                      {passwordStrength.messages.map((message, index) => (
                        <li key={index}>{message}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {!isLogin && (
              <>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--gray4)] font-[var(--system-font)]">
                    Confirm Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`block w-full px-4 py-3 rounded-lg border ${
                        formErrors.confirmPassword ? 'border-red-500' : 'border-[var(--gray3)]'
                      } shadow-sm focus:ring-2 focus:ring-[var(--secondary)] focus:border-transparent font-[var(--system-font)] text-black placeholder-[var(--gray2)]`}
                    />
                  </div>
                  {formErrors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-500">{formErrors.confirmPassword}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[var(--gray4)] font-[var(--system-font)]">
                    Full Name
                  </label>
                  <div className="mt-1">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`block w-full px-4 py-3 rounded-lg border ${
                        formErrors.name ? 'border-red-500' : 'border-[var(--gray3)]'
                      } shadow-sm focus:ring-2 focus:ring-[var(--secondary)] focus:border-transparent font-[var(--system-font)] text-black placeholder-[var(--gray2)]`}
                    />
                  </div>
                  {formErrors.name && (
                    <p className="mt-2 text-sm text-red-500">{formErrors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-[var(--gray4)] font-[var(--system-font)]">
                    Organization (Optional)
                  </label>
                  <div className="mt-1">
                    <input
                      id="organization"
                      name="organization"
                      type="text"
                      autoComplete="organization"
                      placeholder="University of Toronto"
                      value={formData.organization}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-3 rounded-lg border border-[var(--gray3)] shadow-sm focus:ring-2 focus:ring-[var(--secondary)] focus:border-transparent font-[var(--system-font)] text-black placeholder-[var(--gray2)]"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <button
                type="submit"
                style={{ background: 'var(--gradient-b2)' }}
                className="w-full flex justify-center py-3 px-4 rounded-lg font-[var(--system-font)] text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--secondary)]"
              >
                {isLogin ? 'Log In' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 