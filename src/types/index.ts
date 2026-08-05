// types/index.ts - TypeScript type definitions

export interface SignupFormData {
  full_name: string;
  username: string;
  email: string;
  phone: string;
  mpesa_number: string;
  password: string;
  confirm_password: string;
  referral_code: string;
}

export interface LoginFormData {
  email: string;
  password: string;
  remember_me: boolean;
}

export interface ApiResponse {
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface SignupResponse extends ApiResponse {
  user?: {
    id: number;
    full_name: string;
    username: string;
    email: string;
    referral_code: string;
  };
  next_step?: string;
}

export interface LoginResponse extends ApiResponse {
  data?: {
    user: {
      id: number;
      full_name: string;
      username: string;
      email: string;
      phone: string;
      referral_code: string;
      wallet_balance: number;
      total_earned: number;
      has_paid: boolean;
      is_admin: boolean;
      is_verified: boolean;
      created_at: string;
    };
    tokens: {
      access_token: string;
      refresh_token: string;
      session_token: string;
    };
  };
  session_info?: {
    expires: string;
    remember_me: boolean;
    note: string;
  };
}

export interface PaymentResponse extends ApiResponse {
  data?: {
    checkout_request_id: string;
    payment_ref: string;
    amount: number;
    mpesa_number: string;
  };
}

export interface PaymentStatusResponse extends ApiResponse {
  status?: 'pending' | 'completed' | 'failed';
}

export interface GoogleAuthResponse extends ApiResponse {
  user?: {
    id: number;
    full_name: string;
    email: string;
    referral_code: string;
  };
}

export type SignupStep = 1 | 2 | 3;
export type ScreenName = 'home' | 'signup' | 'login' | 'guest' | 'dashboard';

export interface ProgressIndicatorProps {
  currentStep: SignupStep;
  totalSteps: number;
}

export interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  onToggleSecure?: () => void;
  showSecureToggle?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  maxLength?: number;
  error?: string;
  hint?: string;
  autoCapitalize?: 'none' | 'words' | 'characters';
  icon?: string;
}

export interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'outline' | 'google';
  icon?: string;
}
