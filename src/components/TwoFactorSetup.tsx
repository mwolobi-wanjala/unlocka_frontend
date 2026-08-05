// components/TwoFactorSetup.tsx - 2FA Setup Screen
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { COLORS, FONTS, SPACING, SHADOWS } from '../constants/theme';
import Button from './Button';
import { useToast } from '../../App';

interface TwoFactorSetupProps {
  onComplete: () => void;
  onSkip: () => void;
}

const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({ onComplete, onSkip }) => {
  const { showToast } = useToast();
  const [step, setStep] = useState<'intro' | 'verify'>('intro');
  const [code, setCode] = useState('');
  const [secret] = useState('JBSWY3DPEHPK3PXP'); // Demo secret

  const handleVerify = () => {
    if (code.length === 6) {
      showToast('2FA enabled successfully!');
      onComplete();
    } else {
      showToast('Invalid code');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {step === 'intro' ? (
        <>
          <Text style={styles.icon}>🔐</Text>
          <Text style={styles.title}>Enable Two-Factor Auth</Text>
          <Text style={styles.desc}>
            Add an extra layer of security to your account. You'll need a verification code in addition to your password.
          </Text>
          <View style={styles.benefits}>
            <Text style={styles.benefit}>✅ Enhanced security</Text>
            <Text style={styles.benefit}>✅ Protects from password theft</Text>
            <Text style={styles.benefit}>✅ Free and easy to use</Text>
          </View>
          <Button title="Enable 2FA" icon="🔐" onPress={() => setStep('verify')} variant="primary" />
          <TouchableOpacity onPress={onSkip}>
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.icon}>📱</Text>
          <Text style={styles.title}>Verify Setup</Text>
          <Text style={styles.desc}>
            Enter the 6-digit code from your authenticator app
          </Text>
          <View style={styles.secretBox}>
            <Text style={styles.secretLabel}>Manual Setup Key:</Text>
            <Text style={styles.secret}>{secret}</Text>
          </View>
          <TextInput
            style={styles.codeInput}
            value={code}
            onChangeText={(t) => setCode(t.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            placeholderTextColor="#999"
            keyboardType="number-pad"
            maxLength={6}
          />
          <Button title="Verify & Enable" icon="✅" onPress={handleVerify} variant="success" />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: SPACING.lg, alignItems: 'center' },
  icon: { fontSize: 60, marginBottom: SPACING.md },
  title: { fontSize: FONTS.sizes.xxl, fontWeight: 'bold', color: COLORS.dark, marginBottom: SPACING.sm, textAlign: 'center' },
  desc: { fontSize: FONTS.sizes.sm, color: COLORS.gray, textAlign: 'center', marginBottom: SPACING.lg, lineHeight: 22 },
  benefits: { width: '100%', marginBottom: SPACING.lg },
  benefit: { fontSize: FONTS.sizes.sm, color: COLORS.darkGray, marginBottom: SPACING.sm },
  skipText: { marginTop: SPACING.md, fontSize: FONTS.sizes.sm, color: COLORS.gray, textAlign: 'center' },
  secretBox: { backgroundColor: '#F0EEFF', padding: SPACING.md, borderRadius: 10, marginBottom: SPACING.lg, width: '100%', alignItems: 'center' },
  secretLabel: { fontSize: FONTS.sizes.xs, color: COLORS.gray, marginBottom: 4 },
  secret: { fontSize: FONTS.sizes.lg, fontWeight: 'bold', color: COLORS.primary, letterSpacing: 2 },
  codeInput: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', letterSpacing: 8, borderWidth: 2, borderColor: COLORS.primary, borderRadius: 12, padding: SPACING.md, width: '80%', marginBottom: SPACING.lg, color: COLORS.dark },
});

export default TwoFactorSetup;
