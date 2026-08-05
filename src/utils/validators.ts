// utils/validators.ts - Match backend validation exactly
import { SignupFormData } from '../types';

interface ValidationErrors {
  [key: string]: string;
}

export const validateStep1 = (data: SignupFormData): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  // Full Name: 2+ words, each 2+ chars
  if (!data.full_name?.trim()) {
    errors.full_name = 'Full name is required';
  } else {
    const words = data.full_name.trim().split(/\s+/);
    if (words.length < 2) {
      errors.full_name = 'Enter at least 2 words (e.g., Mwolobi Junior)';
    } else {
      for (let i = 0; i < words.length; i++) {
        if (words[i].length < 2) {
          errors.full_name = `Word "${words[i]}" is too short (min 2 chars)`;
          break;
        }
      }
    }
  }
  
  // Username: must have underscore, only letters/numbers/underscore
  if (!data.username?.trim()) {
    errors.username = 'Username is required';
  } else if (!data.username.includes('_')) {
    errors.username = 'Username must contain underscore (_)';
  } else if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
    errors.username = 'Only letters, numbers & underscores';
  }
  
  // Email: valid format
  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Enter valid email (e.g., user@example.com)';
  }
  
  // Phone: exactly 10 digits
  if (!data.phone?.trim()) {
    errors.phone = 'Phone number is required';
  } else if (data.phone.replace(/\D/g, '').length !== 10) {
    errors.phone = 'Must be exactly 10 digits';
  }
  
  // Password: 8+ chars, upper, lower, number, special
  if (!data.password) {
    errors.password = 'Password is required';
  } else if (data.password.length < 8) {
    errors.password = 'At least 8 characters required';
  } else if (!/[A-Z]/.test(data.password)) {
    errors.password = 'Include uppercase letter (A-Z)';
  } else if (!/[a-z]/.test(data.password)) {
    errors.password = 'Include lowercase letter (a-z)';
  } else if (!/\d/.test(data.password)) {
    errors.password = 'Include at least one number';
  } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(data.password)) {
    errors.password = 'Include special character (!@#$%^&*)';
  }
  
  // Confirm Password: must match
  if (!data.confirm_password) {
    errors.confirm_password = 'Confirm your password';
  } else if (data.password !== data.confirm_password) {
    errors.confirm_password = 'Passwords do not match';
  }
  
  return errors;
};

export const validateStep2 = (mpesaNumber: string): string | null => {
  if (!mpesaNumber?.trim()) {
    return 'M-Pesa number is required';
  }
  if (mpesaNumber.replace(/\D/g, '').length !== 10) {
    return 'Must be exactly 10 digits';
  }
  return null;
};
