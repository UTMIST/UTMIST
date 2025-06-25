'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import logo from '@/assets/logos/utmist-logo-small.svg';
import { useRouter } from 'next/navigation';
import { login, register, onAuthStateChange, getCurrentUser, resendConfirmation, resetPassword, AUTH_ERRORS } from '@/utils/auth';

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
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showResendConfirmation, setShowResendConfirmation] = useState(false);
  const [resendingConfirmation, setResendingConfirmation] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [sendingPasswordReset, setSendingPasswordReset] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    organization: ''
  });

  // Check if user is already authenticated on page load
  useEffect(() => {
    const checkAuth = async () => {
      if (redirecting) return; // Prevent multiple redirects
      
      // Check for error parameters in URL
      const urlParams = new URLSearchParams(window.location.search);
      const errorParam = urlParams.get('error');
      
      if (errorParam) {
        switch (errorParam) {
          case 'confirmation_failed':
            setError('Email confirmation failed. Please try registering again.');
            break;
          case 'no_code':
            setError('Invalid confirmation link. Please try registering again.');
            break;
          default:
            setError('An error occurred during authentication.');
        }
        // Clear the URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }
      
      const user = await getCurrentUser();
      if (user) {
        console.log('Auth page: User already authenticated, redirecting to dashboard');
        setRedirecting(true);
        
        // Use router.push for consistency
        console.log('Auth page: Using router.push to redirect');
        router.push('/dashboard');
      } else {
        console.log('Auth page: No authenticated user found');
      }
    };
    
    checkAuth();
  }, [router, redirecting]);

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
    setSuccessMessage('');
    setFormErrors({});
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        console.log('Login successful, redirecting to dashboard...');
        setRedirecting(true);
        router.push('/dashboard');
      } else {
        const result = await register(formData.email, formData.password, formData.name, formData.organization);
        if (result.requiresEmailConfirmation) {
          // Show success message for email confirmation
          setSuccessMessage(result.message || 'Registration successful! Please check your email to confirm your account.');
          setLoading(false);
          return;
        } else {
          console.log('Registration successful, redirecting to dashboard...');
          setRedirecting(true);
          router.push('/dashboard');
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      
      // Handle specific error codes for better user experience
      if (err instanceof Error) {
        switch (err.message) {
          case AUTH_ERRORS.EMAIL_ALREADY_TAKEN:
            setError('This email is already registered. Please try logging in instead, or use a different email address.');
            setShowResendConfirmation(false);
            break;
          case AUTH_ERRORS.EMAIL_NEEDS_CONFIRMATION:
            setError(
              `This email requires confirmation. Please check your email (including spam folder) for the confirmation link, or click below to resend it.`
            );
            setShowResendConfirmation(true);
            break;
          default:
            setError(err.message);
            setShowResendConfirmation(false);
        }
      } else {
        setError('An error occurred during registration. Please try again.');
        setShowResendConfirmation(false);
      }
      
      setLoading(false);
    }
  };



  const handleResendConfirmation = async () => {
    if (!formData.email) return;
    
    setResendingConfirmation(true);
    setError('');
    
    try {
      await resendConfirmation(formData.email);
      setSuccessMessage('Confirmation email sent! Please check your inbox and spam folder.');
      setShowResendConfirmation(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend confirmation email');
    } finally {
      setResendingConfirmation(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError('Please enter your email address first');
      return;
    }
    
    setSendingPasswordReset(true);
    setError('');
    
    try {
      await resetPassword(formData.email);
      setSuccessMessage('Password reset email sent! Please check your inbox and spam folder.');
      setShowForgotPassword(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send password reset email');
    } finally {
      setSendingPasswordReset(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear the specific error when user starts typing
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
    
    // Hide resend confirmation button when user changes email
    if (name === 'email') {
      setShowResendConfirmation(false);
      setShowForgotPassword(false);
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
                      setShowResendConfirmation(false);
                      setShowForgotPassword(false);
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
                      setShowResendConfirmation(false);
                      setShowForgotPassword(false);
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
              {showResendConfirmation && (
                <div className="mt-3">
                  <button
                    onClick={handleResendConfirmation}
                    disabled={resendingConfirmation || !formData.email}
                    className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {resendingConfirmation ? 'Sending...' : 'Resend Confirmation Email'}
                  </button>
                </div>
              )}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm whitespace-pre-line" role="alert">
              {successMessage}
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
              {isLogin && (
                <div className="mt-2 text-right">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-[var(--secondary)] hover:opacity-80 transition-opacity"
                  >
                    Forgot your password?
                  </button>
                </div>
              )}
              {showForgotPassword && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700 mb-2">
                    Enter your email address and we'll send you a password reset link.
                  </p>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={sendingPasswordReset || !formData.email}
                    className="inline-flex items-center px-3 py-2 border border-blue-300 shadow-sm text-sm leading-4 font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed mr-2"
                  >
                    {sendingPasswordReset ? 'Sending...' : 'Send Reset Link'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                </div>
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
                disabled={loading || redirecting}
                style={{ background: 'var(--gradient-b2)' }}
                className="w-full flex justify-center py-3 px-4 rounded-lg font-[var(--system-font)] text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--secondary)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {redirecting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Redirecting...
                  </div>
                ) : loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    {isLogin ? 'Logging In...' : 'Creating Account...'}
                  </div>
                ) : (
                  isLogin ? 'Log In' : 'Create Account'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 