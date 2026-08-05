// screens/SignupScreen.tsx - Signup with Keyboard Persistence
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, KeyboardAvoidingView,
  Platform, TouchableOpacity,
} from 'react-native';
import { COLORS, FONTS, SPACING, SHADOWS, APP_INFO } from '../constants/theme';
import ProgressIndicator from '../components/ProgressIndicator';
import InputField from '../components/InputField';
import Button from '../components/Button';
import TermsCheckbox from '../components/TermsCheckbox';
import Footer from '../components/Footer';
import { useToast } from '../../App';
import { validateStep1, validateStep2 } from '../utils/validators';

interface SignupScreenProps {
  currentStep: number;
  formData: any;
  updateField: (field: string, value: string) => void;
  onSubmitStep1: () => void;
  onSubmitStep2: () => void;
  onSubmitStep3: () => void;
  loading: boolean;
  showPassword: boolean;
  showConfirm: boolean;
  onTogglePassword: () => void;
  onToggleConfirm: () => void;
  onNavigate: (screen: string) => void;
  setCurrentStep: (step: number) => void;
  termsAgreed: boolean;
  setTermsAgreed: (val: boolean) => void;
  mpesaPayment: string;
  setMpesaPayment: (val: string) => void;
  referralCode: string;
}

const SignupScreen: React.FC<SignupScreenProps> = ({
  currentStep, formData, updateField, onSubmitStep1, onSubmitStep2, onSubmitStep3,
  loading, showPassword, showConfirm, onTogglePassword, onToggleConfirm,
  onNavigate, setCurrentStep, termsAgreed, setTermsAgreed,
  mpesaPayment, setMpesaPayment, referralCode,
}) => {
  const { showToast } = useToast();

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView 
        style={styles.scroll} 
        contentContainerStyle={styles.signupContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="none"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.signupHeader}>
          <Text style={styles.signupEmoji}>🔓</Text>
          <Text style={styles.signupTitle}>{APP_INFO.name}</Text>
          <Text style={styles.signupTagline}>Create Account, Omoka!!!</Text>
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressCard}>
          <ProgressIndicator currentStep={currentStep} totalSteps={3} />
        </View>

        <View style={styles.signupCard}>
          {/* ============================================ */}
          {/* STEP 1: CREATE ACCOUNT */}
          {/* ============================================ */}
          {currentStep === 1 && (
            <>
              <Text style={styles.stepTitle}>👤 Step 1: Create Account</Text>
              <Text style={styles.stepSubtitle}>Fill in your details to get started</Text>

              <InputField label="Full Name" icon="👤" value={formData.full_name} onChangeText={t => updateField('full_name', t)} placeholder="Mwolobi Junior" autoCapitalize="words" hint="At least 2 words (first & last name)" />
              <InputField label="Username" icon="📝" value={formData.username} onChangeText={t => updateField('username', t.toLowerCase())} placeholder="mwolobi_junior" hint="Must contain underscore (_)" />
              <InputField label="Email" icon="📧" value={formData.email} onChangeText={t => updateField('email', t.toLowerCase())} placeholder="mwolobi@example.com" keyboardType="email-address" />
              <InputField label="Phone" icon="📞" value={formData.phone} onChangeText={t => updateField('phone', t.replace(/\D/g, ''))} placeholder="0712345678" keyboardType="phone-pad" maxLength={10} hint="10-digit phone number" />
              <InputField label="Password" icon="🔒" value={formData.password} onChangeText={t => updateField('password', t)} placeholder="Min 8 characters" secureTextEntry={!showPassword} showSecureToggle onToggleSecure={onTogglePassword} hint="8+ chars, A-Z, a-z, 0-9, special" />
              <InputField label="Confirm Password" icon="🔐" value={formData.confirm_password} onChangeText={t => updateField('confirm_password', t)} placeholder="Repeat password" secureTextEntry={!showConfirm} showSecureToggle onToggleSecure={onToggleConfirm} />

              <TermsCheckbox
                agreed={termsAgreed}
                onToggle={() => setTermsAgreed(!termsAgreed)}
                onViewTerms={() => onNavigate('termsOfService')}
                onViewPrivacy={() => onNavigate('privacyPolicy')}
              />

              <Button title="Continue to Payment" icon="💳" onPress={onSubmitStep1} loading={loading} variant="primary" disabled={!termsAgreed} />
            </>
          )}

          {/* ============================================ */}
          {/* STEP 2: PAYMENT */}
          {/* ============================================ */}
          {currentStep === 2 && (
            <>
              <Text style={styles.stepTitle}>💳 Step 2: Payment</Text>
              <Text style={styles.stepSubtitle}>Pay KSH 40 to activate your account</Text>

              <View style={styles.paymentCard}>
                <Text style={styles.paymentAmount}>KSH 40</Text>
                <Text style={styles.paymentLabel}>One-time signup fee</Text>
                <View style={styles.paymentDivider} />
                <Text style={styles.paymentDetail}>💰 Refer friends & earn KSH 20</Text>
                <Text style={styles.paymentDetail}>🔒 Secure M-Pesa payment</Text>
              </View>

              <InputField label="M-Pesa Number" icon="📱" value={mpesaPayment} onChangeText={setMpesaPayment} placeholder="Number for STK Push" keyboardType="phone-pad" maxLength={10} hint="Phone to receive payment popup" />

              <Button title="Pay KSH 40 with M-Pesa" icon="📱" onPress={onSubmitStep2} loading={loading} variant="success" />
              <Button title="← Back" onPress={() => setCurrentStep(1)} variant="outline" />
            </>
          )}

          {/* ============================================ */}
          {/* STEP 3: VERIFY */}
          {/* ============================================ */}
          {currentStep === 3 && (
            <>
              <Text style={styles.stepTitle}>✅ Step 3: Verify Payment</Text>
              <Text style={styles.stepSubtitle}>Confirm your M-Pesa payment</Text>

              <View style={styles.verifyCard}>
                <Text style={styles.verifyIcon}>📱</Text>
                <Text style={styles.verifyText}>Check your phone for the M-Pesa popup and enter your PIN to complete payment</Text>
              </View>

              <Button title="✅ Check Payment Status" icon="🔍" onPress={onSubmitStep3} loading={loading} variant="primary" />
              <Button title="🔄 Resend STK Push" icon="📱" onPress={onSubmitStep2} loading={loading} variant="secondary" />
              <Button title="← Back" onPress={() => setCurrentStep(2)} variant="outline" />

              {referralCode && (
                <View style={styles.referralCard}>
                  <Text style={styles.referralTitle}>🎁 Your Referral Code</Text>
                  <Text style={styles.referralCode}>{referralCode}</Text>
                  <Text style={styles.referralInfo}>Share & earn KSH 20 per friend!</Text>
                </View>
              )}
            </>
          )}
        </View>

        {/* Login Link */}
        <TouchableOpacity style={styles.loginLink} onPress={() => onNavigate('login')}>
          <Text style={styles.loginLinkText}>
            Already have an account? <Text style={styles.loginLinkBold}>Sign In</Text>
          </Text>
        </TouchableOpacity>

        <Footer onNavigate={onNavigate} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#F5F5F5' },
  scroll: { flex: 1 },
  signupContent: { paddingBottom: SPACING.xxl },
  signupHeader: { alignItems: 'center', paddingTop: 60, paddingBottom: SPACING.lg, backgroundColor: COLORS.primary },
  signupEmoji: { fontSize: 48, marginBottom: SPACING.sm },
  signupTitle: { fontSize: FONTS.sizes.xxxl, fontWeight: 'bold', color: '#FFF' },
  signupTagline: { fontSize: FONTS.sizes.sm, color: 'rgba(255,255,255,0.8)', marginTop: SPACING.xs },
  progressCard: { marginHorizontal: SPACING.md, marginTop: -SPACING.lg, backgroundColor: '#FFF', borderRadius: 16, ...SHADOWS.medium },
  signupCard: { backgroundColor: '#FFF', marginHorizontal: SPACING.md, marginTop: SPACING.sm, padding: SPACING.lg, borderRadius: 20, ...SHADOWS.large },
  stepTitle: { fontSize: FONTS.sizes.xl, fontWeight: 'bold', color: COLORS.dark, textAlign: 'center' },
  stepSubtitle: { fontSize: FONTS.sizes.sm, color: COLORS.gray, textAlign: 'center', marginBottom: SPACING.lg },
  paymentCard: { backgroundColor: '#F0EEFF', padding: SPACING.lg, borderRadius: 16, alignItems: 'center', marginBottom: SPACING.lg, borderWidth: 2, borderColor: COLORS.primary },
  paymentAmount: { fontSize: FONTS.sizes.hero, fontWeight: 'bold', color: COLORS.primary },
  paymentLabel: { fontSize: FONTS.sizes.sm, color: COLORS.gray, marginTop: 4 },
  paymentDivider: { width: 40, height: 2, backgroundColor: COLORS.primary, marginVertical: SPACING.md },
  paymentDetail: { fontSize: FONTS.sizes.sm, color: COLORS.darkGray, marginBottom: 4 },
  verifyCard: { backgroundColor: '#FFF', padding: SPACING.lg, borderRadius: 16, alignItems: 'center', marginBottom: SPACING.lg, ...SHADOWS.small },
  verifyIcon: { fontSize: 60, marginBottom: SPACING.md },
  verifyText: { fontSize: FONTS.sizes.sm, color: COLORS.darkGray, textAlign: 'center', lineHeight: 22 },
  referralCard: { backgroundColor: COLORS.primary, padding: SPACING.lg, borderRadius: 16, alignItems: 'center', marginTop: SPACING.md },
  referralTitle: { fontSize: FONTS.sizes.sm, color: 'rgba(255,255,255,0.8)' },
  referralCode: { fontSize: FONTS.sizes.xxxl, fontWeight: 'bold', color: '#FFD700', letterSpacing: 3, marginVertical: SPACING.sm },
  referralInfo: { fontSize: FONTS.sizes.xs, color: 'rgba(255,255,255,0.9)' },
  loginLink: { alignItems: 'center', marginTop: SPACING.lg },
  loginLinkText: { fontSize: FONTS.sizes.sm, color: COLORS.gray },
  loginLinkBold: { color: COLORS.primary, fontWeight: 'bold' },
});

export default SignupScreen;
