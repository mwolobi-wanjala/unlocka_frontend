// screens/LoginScreenEnhanced.tsx - Enhanced Login with all features
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, KeyboardAvoidingView,
  Platform, TouchableOpacity, Animated, StatusBar, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS, SPACING, SHADOWS, APP_INFO } from '../constants/theme';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Footer from '../components/Footer';
import LoginIllustration from '../components/LoginIllustration';
import TypingText from '../components/TypingText';
import LoginStreak from '../components/LoginStreak';
import QuickActions from '../components/QuickActions';
import TrustedDevice from '../components/TrustedDevice';
import { LoginFormData } from '../types';
import { loginUser, validateSession } from '../services/api';
import { useGoogleSignIn } from '../hooks/useGoogleSignIn';
import { useToast } from '../../App';
import { isOfflineLoginAvailable, getLastOnlineLogin } from '../services/offlineAuth';

const { width } = Dimensions.get('window');

interface LoginScreenProps {
  onNavigate: (screen: string, params?: any) => void;
}

const LoginScreenEnhanced: React.FC<LoginScreenProps> = ({ onNavigate }) => {
  const { showToast, showLoading, hideLoading } = useToast();
  const { handleGoogleSignIn, isReady } = useGoogleSignIn((user) => {
    onNavigate('dashboard', { user });
  });

  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [showPassword, setShowPassword] = useState(false);
  const [trustDevice, setTrustDevice] = useState(false);
  const [offlineAvailable, setOfflineAvailable] = useState(false);
  const [lastOnline, setLastOnline] = useState<string | null>(null);

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    remember_me: true,
  });

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
    
    checkExistingSession();
    checkOfflineStatus();
  }, []);

  const checkOfflineStatus = async () => {
    const available = await isOfflineLoginAvailable();
    const last = await getLastOnlineLogin();
    setOfflineAvailable(available);
    setLastOnline(last);
  };

  const checkExistingSession = async () => {
    try {
      const sessionToken = await AsyncStorage.getItem('session_token');
      if (sessionToken) {
        const response = await validateSession(sessionToken);
        if (response.success && response.valid) {
          onNavigate('dashboard', { user: response.user });
        }
      }
    } catch (error) {}
  };

  const handleLogin = async () => {
    if (!formData.email.trim()) { showToast('Enter email or username'); return; }
    if (!formData.password) { showToast('Enter password'); return; }

    showLoading('Signing in...');
    try {
      const response = await loginUser(formData);
      if (response.success && response.data) {
        await AsyncStorage.setItem('session_token', response.data.tokens.session_token);
        await AsyncStorage.setItem('user_data', JSON.stringify(response.data.user));
        
        hideLoading();
        showToast(`Welcome back, ${response.data.user.full_name}!`);
        
        setTimeout(() => onNavigate('dashboard', { user: response.data!.user }), 1500);
      } else {
        hideLoading();
        showToast(response.message || 'Invalid credentials');
      }
    } catch (error) {
      hideLoading();
      showToast('Network error');
    }
  };

  const quickActions = [
    { icon: '🔑', label: 'Forgot\nPassword', onPress: () => onNavigate('forgotPassword') },
    { icon: '📱', label: 'SMS\nLogin', onPress: () => showToast('Coming soon!') },
    { icon: '🛡️', label: 'Security\nSettings', onPress: () => onNavigate('security') },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
      
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark, '#4A45B0']} style={styles.header}>
        <Animated.View style={[styles.headerContent, { opacity: fadeAnim }]}>
          <Text style={styles.appName}>{APP_INFO.name}</Text>
        </Animated.View>
        <View style={styles.wave}><View style={styles.waveShape} /></View>
      </LinearGradient>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          
          {/* Animated Illustration */}
          <LoginIllustration />
          
          {/* Typing welcome text */}
          <TypingText 
            texts={['Welcome back! 👋', 'Ready to Omoka? 🚀', 'Your journey continues... ✨']}
            speed={80}
          />

          {/* Login Streak */}
          <View style={styles.cardWrapper}>
            <LoginStreak streak={7} lastLogin="Today, 10:30 AM" reward={5} />
          </View>

          <Animated.View style={[styles.loginCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            
            {/* Google Sign-in at top */}
            <View style={styles.googleSection}>
              <Button title="Continue with Google" icon="🔵" onPress={handleGoogleSignIn} variant="google" disabled={!isReady} />
            </View>

            <View style={styles.dividerRow}>
              <View style={styles.divider} /><Text style={styles.dividerText}>or</Text><View style={styles.divider} />
            </View>

            {/* Email/Password Fields */}
            <View style={styles.formSection}>
              <InputField label="Email or Username" icon="📧" value={formData.email} onChangeText={(t) => setFormData({ ...formData, email: t })} placeholder="mwolobi@example.com" keyboardType="email-address" autoCapitalize="none" />
              
              <InputField label="Password" icon="🔒" value={formData.password} onChangeText={(t) => setFormData({ ...formData, password: t })} placeholder="Enter password" secureTextEntry={!showPassword} showSecureToggle onToggleSecure={() => setShowPassword(!showPassword)} />

              <View style={styles.optionsRow}>
                <TouchableOpacity style={styles.rememberRow} onPress={() => setFormData({ ...formData, remember_me: !formData.remember_me })}>
                  <View style={[styles.checkbox, formData.remember_me && styles.checkboxChecked]}>
                    {formData.remember_me && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={styles.rememberText}>Stay logged in</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onNavigate('forgotPassword')}>
                  <Text style={styles.forgotText}>Forgot?</Text>
                </TouchableOpacity>
              </View>

              {/* Trust Device */}
              <TrustedDevice onToggle={setTrustDevice} />

              <Button title="Sign In" icon="🔓" onPress={handleLogin} variant="primary" />
            </View>
          </Animated.View>

          {/* Quick Actions */}
          <View style={styles.cardWrapper}>
            <QuickActions actions={quickActions} />
          </View>

          {/* Offline Indicator */}
          {offlineAvailable && (
            <View style={styles.offlineBadge}>
              <Text style={styles.offlineText}>📡 Offline login available</Text>
              {lastOnline && <Text style={styles.offlineSubtext}>Last online: {new Date(lastOnline).toLocaleDateString()}</Text>}
            </View>
          )}

          {/* Signup Link */}
          <TouchableOpacity style={styles.signupLink} onPress={() => onNavigate('signup')}>
            <Text style={styles.signupText}>Don't have an account? <Text style={styles.signupBold}>Create Account</Text></Text>
          </TouchableOpacity>

          <Footer />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite },
  flex: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: SPACING.xxl },
  header: { paddingTop: 60, paddingBottom: 20, alignItems: 'center', position: 'relative' },
  headerContent: { alignItems: 'center', zIndex: 1 },
  appName: { fontSize: FONTS.sizes.xxl, fontWeight: 'bold', color: COLORS.white, letterSpacing: 1 },
  wave: { position: 'absolute', bottom: -20, left: 0, right: 0, height: 40, overflow: 'hidden' },
  waveShape: { position: 'absolute', bottom: 0, left: -50, right: -50, height: 100, backgroundColor: COLORS.offWhite, borderRadius: 100, transform: [{ scaleX: 1.5 }] },
  
  cardWrapper: { marginHorizontal: SPACING.md, marginBottom: SPACING.sm },
  
  loginCard: { backgroundColor: COLORS.white, marginHorizontal: SPACING.md, marginBottom: SPACING.sm, borderRadius: 20, overflow: 'hidden', ...SHADOWS.large },
  
  googleSection: { padding: SPACING.lg, paddingBottom: 0 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.lg },
  divider: { flex: 1, height: 1, backgroundColor: COLORS.lightGray },
  dividerText: { marginHorizontal: SPACING.md, fontSize: FONTS.sizes.xs, color: COLORS.gray },
  
  formSection: { padding: SPACING.lg },
  optionsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  rememberRow: { flexDirection: 'row', alignItems: 'center' },
  checkbox: { width: 20, height: 20, borderWidth: 2, borderColor: COLORS.gray, borderRadius: 5, marginRight: SPACING.sm, justifyContent: 'center', alignItems: 'center' },
  checkboxChecked: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  checkmark: { color: COLORS.white, fontSize: 12, fontWeight: 'bold' },
  rememberText: { fontSize: FONTS.sizes.sm, color: COLORS.darkGray },
  forgotText: { fontSize: FONTS.sizes.sm, color: COLORS.primary, fontWeight: '600' },
  
  offlineBadge: { marginHorizontal: SPACING.md, backgroundColor: '#E3F2FD', padding: SPACING.sm, borderRadius: 10, alignItems: 'center', marginBottom: SPACING.sm },
  offlineText: { fontSize: FONTS.sizes.xs, color: '#1565C0', fontWeight: '600' },
  offlineSubtext: { fontSize: 10, color: COLORS.gray },
  
  signupLink: { alignItems: 'center', marginVertical: SPACING.md },
  signupText: { fontSize: FONTS.sizes.sm, color: COLORS.gray },
  signupBold: { color: COLORS.primary, fontWeight: 'bold' },
});

export default LoginScreenEnhanced;
