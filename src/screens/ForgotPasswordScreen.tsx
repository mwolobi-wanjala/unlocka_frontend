// screens/ForgotPasswordScreen.tsx - Forgot Password Screen
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, Animated, StatusBar, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, SHADOWS, APP_INFO } from '../constants/theme';
import Button from '../components/Button';
import { useToast } from '../../App';

interface ForgotPasswordScreenProps {
  onNavigate: (screen: string, params?: any) => void;
  onBack: () => void;
}

type Step = 'phone' | 'code' | 'newPassword';
type RecoveryMethod = 'phone' | 'email';

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ onNavigate, onBack }) => {
  const { showToast, showLoading, hideLoading } = useToast();
  
  const [step, setStep] = useState<Step>('phone');
  const [method, setMethod] = useState<RecoveryMethod>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [timer, setTimer] = useState(0);
  
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const codeInputRefs = useRef<TextInput[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleSendCode = async () => {
    showLoading('Sending code...');
    setTimeout(() => {
      setTimer(60);
      setStep('code');
      showToast('Verification code sent!');
      hideLoading();
    }, 1500);
  };

  const handleVerifyCode = () => {
    const code = verificationCode.join('');
    if (code.length === 6) {
      showToast('Code verified!');
      setStep('newPassword');
    } else {
      showToast('Enter 6-digit code');
    }
  };

  const handleResetPassword = () => {
    if (newPassword.length < 8) { showToast('Min 8 characters'); return; }
    if (newPassword !== confirmPassword) { showToast('Passwords don\'t match'); return; }
    showToast('Password reset successful!');
    onNavigate('login');
  };

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...verificationCode];
    newCode[index] = text;
    setVerificationCode(newCode);
    if (text && index < 5) codeInputRefs.current[index + 1]?.focus();
    if (index === 5 && text) handleVerifyCode();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.header}>
        <TouchableOpacity onPress={onBack}><Text style={styles.backBtn}>←</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Reset Password</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            {step === 'phone' && (
              <>
                <Text style={styles.stepTitle}>Forgot Password?</Text>
                <Text style={styles.stepDesc}>Enter your phone number to receive a verification code.</Text>
                <View style={styles.phoneRow}>
                  <Text style={styles.prefix}>+254</Text>
                  <TextInput style={styles.phoneInput} value={phone} onChangeText={(t) => setPhone(t.replace(/\D/g, '').slice(0, 9))} placeholder="712345678" placeholderTextColor="#999" keyboardType="phone-pad" maxLength={9} />
                </View>
                <Button title="Send Code" icon="📱" onPress={handleSendCode} variant="primary" />
              </>
            )}

            {step === 'code' && (
              <>
                <Text style={styles.stepTitle}>Enter Code</Text>
                <Text style={styles.stepDesc}>Enter the 6-digit code sent to your phone.</Text>
                <View style={styles.codeRow}>
                  {[0,1,2,3,4,5].map(i => (
                    <TextInput key={i} ref={ref => codeInputRefs.current[i] = ref!} style={styles.codeBox} value={verificationCode[i]} onChangeText={t => handleCodeChange(t, i)} keyboardType="number-pad" maxLength={1} />
                  ))}
                </View>
                {timer > 0 ? <Text style={styles.timer}>Resend in {timer}s</Text> : <TouchableOpacity onPress={handleSendCode}><Text style={styles.resend}>Resend Code</Text></TouchableOpacity>}
              </>
            )}

            {step === 'newPassword' && (
              <>
                <Text style={styles.stepTitle}>New Password</Text>
                <Text style={styles.stepDesc}>Create a new password for your account.</Text>
                <TextInput style={styles.input} value={newPassword} onChangeText={setNewPassword} placeholder="New password" placeholderTextColor="#999" secureTextEntry={!showPassword} />
                <TextInput style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Confirm password" placeholderTextColor="#999" secureTextEntry={!showPassword} />
                <Button title="Reset Password" icon="🔒" onPress={handleResetPassword} variant="primary" />
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite },
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1, padding: SPACING.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, padding: SPACING.md },
  backBtn: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
  headerTitle: { color: '#FFF', fontSize: FONTS.sizes.lg, fontWeight: 'bold' },
  card: { backgroundColor: '#FFF', borderRadius: 16, padding: SPACING.lg, ...SHADOWS.small },
  stepTitle: { fontSize: FONTS.sizes.xl, fontWeight: 'bold', textAlign: 'center', marginBottom: SPACING.sm },
  stepDesc: { fontSize: FONTS.sizes.sm, color: COLORS.gray, textAlign: 'center', marginBottom: SPACING.lg },
  phoneRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
  prefix: { fontSize: FONTS.sizes.lg, fontWeight: 'bold', color: COLORS.dark, marginRight: SPACING.sm, padding: SPACING.md, backgroundColor: COLORS.lightGray, borderRadius: 10 },
  phoneInput: { flex: 1, borderWidth: 2, borderColor: COLORS.primary, borderRadius: 10, padding: SPACING.md, fontSize: FONTS.sizes.lg },
  codeRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: SPACING.lg },
  codeBox: { width: 45, height: 55, borderWidth: 2, borderColor: COLORS.lightGray, borderRadius: 10, fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  timer: { textAlign: 'center', color: COLORS.gray, fontSize: FONTS.sizes.sm },
  resend: { textAlign: 'center', color: COLORS.primary, fontWeight: 'bold', fontSize: FONTS.sizes.sm },
  input: { borderWidth: 2, borderColor: COLORS.primary, borderRadius: 12, padding: SPACING.md, fontSize: FONTS.sizes.md, marginBottom: SPACING.md },
});

export default ForgotPasswordScreen;
