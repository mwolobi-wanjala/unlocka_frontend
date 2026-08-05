// components/PhoneOTPLogin.tsx - Phone Number OTP Login
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { COLORS, FONTS, SPACING, SHADOWS } from '../constants/theme';
import Button from './Button';
import { useToast } from '../../App';

interface PhoneOTPLoginProps {
  onSuccess: (phone: string) => void;
  onCancel: () => void;
}

const PhoneOTPLogin: React.FC<PhoneOTPLoginProps> = ({ onSuccess, onCancel }) => {
  const { showToast } = useToast();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [timer, setTimer] = useState(0);
  const codeRefs = useRef<TextInput[]>([]);

  const handleSendOTP = () => {
    if (phone.replace(/\D/g, '').length < 9) {
      showToast('Enter valid phone number');
      return;
    }
    setTimer(30);
    setStep('code');
    showToast('OTP sent to your phone');
  };

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    if (text && index < 5) codeRefs.current[index + 1]?.focus();
    if (index === 5 && text) {
      onSuccess(phone);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>📱</Text>
      <Text style={styles.title}>Login with Phone</Text>

      {step === 'phone' ? (
        <>
          <View style={styles.phoneRow}>
            <Text style={styles.prefix}>+254</Text>
            <TextInput
              style={styles.phoneInput}
              value={phone}
              onChangeText={(t) => setPhone(t.replace(/\D/g, '').slice(0, 9))}
              placeholder="712345678"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              maxLength={9}
            />
          </View>
          <Button title="Send OTP" icon="📱" onPress={handleSendOTP} variant="primary" />
        </>
      ) : (
        <>
          <Text style={styles.otpSent}>Code sent to +254 {phone}</Text>
          <View style={styles.codeRow}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <TextInput
                key={i}
                ref={(ref) => (codeRefs.current[i] = ref!)}
                style={styles.codeBox}
                value={code[i]}
                onChangeText={(t) => handleCodeChange(t, i)}
                keyboardType="number-pad"
                maxLength={1}
              />
            ))}
          </View>
        </>
      )}

      <TouchableOpacity onPress={onCancel} style={styles.cancelBtn}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: SPACING.lg, alignItems: 'center' },
  icon: { fontSize: 50, marginBottom: SPACING.md },
  title: { fontSize: FONTS.sizes.xl, fontWeight: 'bold', color: COLORS.dark, marginBottom: SPACING.lg },
  phoneRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.lg, width: '100%' },
  prefix: { fontSize: FONTS.sizes.lg, fontWeight: 'bold', color: COLORS.dark, marginRight: SPACING.sm, backgroundColor: COLORS.lightGray, padding: 12, borderRadius: 10 },
  phoneInput: { flex: 1, fontSize: FONTS.sizes.lg, padding: 12, borderWidth: 2, borderColor: COLORS.primary, borderRadius: 10 },
  otpSent: { fontSize: FONTS.sizes.sm, color: COLORS.gray, marginBottom: SPACING.lg },
  codeRow: { flexDirection: 'row', gap: 8, marginBottom: SPACING.lg },
  codeBox: { width: 45, height: 55, borderWidth: 2, borderColor: COLORS.lightGray, borderRadius: 10, fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  cancelBtn: { marginTop: SPACING.lg },
  cancelText: { color: COLORS.primary, fontWeight: '600' },
});

export default PhoneOTPLogin;
