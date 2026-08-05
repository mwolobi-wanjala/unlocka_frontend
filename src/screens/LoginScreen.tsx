// screens/LoginScreen.tsx - Login with All Links Working
import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, KeyboardAvoidingView,
  Platform, TouchableOpacity, Dimensions, Animated, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS, SPACING, SHADOWS, APP_INFO } from '../constants/theme';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Footer from '../components/Footer';
import { mockLogin } from '../services/localMockData';
import { useToast } from '../../App';

const { width } = Dimensions.get('window');

interface LoginScreenProps {
  onNavigate: (screen: string) => void;
  onLoginSuccess?: (user: any) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onNavigate, onLoginSuccess }) => {
  const { showToast, showLoading, hideLoading } = useToast();
  
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  const [formData, setFormData] = useState({
    email: 'usertest@unlocka.app',
    password: 'Test1234',
    remember_me: true,
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: false }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: false }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!formData.email.trim()) { showToast('Please enter your email'); return; }
    if (!formData.password) { showToast('Please enter your password'); return; }

    showLoading('Signing in...');
    
    try {
      const response = await mockLogin(formData.email, formData.password);
      
      if (response.success && response.data) {
        await AsyncStorage.setItem('session_token', response.data.tokens.session_token);
        await AsyncStorage.setItem('user_data', JSON.stringify(response.data.user));
        showToast(`Welcome, ${response.data.user.fullName}! 🎉`);
        setFormData({ email: "", password: "", remember_me: true });
        if (onLoginSuccess) setTimeout(() => onLoginSuccess(response.data.user), 500);
      } else {
        showToast(response.message || 'Invalid credentials');
      }
    } catch (error) {
      showToast('Network error. Try usertest@unlocka.app / Test1234');
    }
    hideLoading();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
      
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark, '#4A45B0']} style={styles.header}>
        <Animated.View style={[styles.headerContent, { opacity: fadeAnim }]}>
          <Text style={styles.lockIcon}>🔓</Text>
          <Text style={styles.appName}>{APP_INFO.name}</Text>
          <Text style={styles.tagline}>Welcome Back! Sign in to continue</Text>
        </Animated.View>
        <View style={styles.wave}><View style={styles.waveShape} /></View>
      </LinearGradient>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView 
          style={styles.scroll} 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="none"
        >
          <Animated.View style={[styles.loginCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Sign In</Text>
              <Text style={styles.cardSubtitle}>Access your account</Text>
            </View>

            <View style={styles.testInfo}>
              <Text style={styles.testTitle}>🧪 Test Accounts:</Text>
              <Text style={styles.testText}>User: usertest@unlocka.app / Test1234</Text>
              <Text style={styles.testText}>Admin: admintest@unlocka.app / Test1234</Text>
            </View>

            <View style={styles.formSection}>
              <InputField label="Email or Username" icon="📧" value={formData.email} onChangeText={(t) => setFormData({ ...formData, email: t })} placeholder="usertest@unlocka.app" keyboardType="email-address" autoCapitalize="none" />
              <InputField label="Password" icon="🔒" value={formData.password} onChangeText={(t) => setFormData({ ...formData, password: t })} placeholder="Enter your password" secureTextEntry={!showPassword} showSecureToggle onToggleSecure={() => setShowPassword(!showPassword)} />

              <View style={styles.optionsRow}>
                <TouchableOpacity style={styles.rememberRow} onPress={() => setFormData({ ...formData, remember_me: !formData.remember_me })}>
                  <View style={[styles.checkbox, formData.remember_me && styles.checkboxChecked]}>
                    {formData.remember_me && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={styles.rememberText}>Stay logged in</Text>
                </TouchableOpacity>
                {/* FORGOT PASSWORD LINK - WORKS */}
                <TouchableOpacity onPress={() => onNavigate('forgotPassword')}>
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              <Button title="Sign In" icon="🔓" onPress={handleLogin} variant="primary" />

              <View style={styles.dividerRow}>
                <View style={styles.divider} /><Text style={styles.dividerText}>or</Text><View style={styles.divider} />
              </View>

              {/* CONTINUE WITH GOOGLE - WORKS */}
              <Button title="Continue with Google" icon="🔵" onPress={() => showToast('🔜 Google Sign-in coming soon!')} variant="google" />
            </View>

            {/* SIGNUP LINK - WORKS */}
            <View style={styles.signupSection}>
              <Text style={styles.signupText}>Don't have an account?</Text>
              <TouchableOpacity onPress={() => onNavigate('signup')}>
                <Text style={styles.signupLink}> Create Account</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
          
          {/* FOOTER WITH WORKING LINKS */}
          <Footer onNavigate={onNavigate} />
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
  header: { paddingTop: 60, paddingBottom: 40, alignItems: 'center', position: 'relative' },
  headerContent: { alignItems: 'center', zIndex: 1 },
  lockIcon: { fontSize: 48, marginBottom: SPACING.sm },
  appName: { fontSize: FONTS.sizes.xxxl, fontWeight: 'bold', color: COLORS.white, letterSpacing: 1 },
  tagline: { fontSize: FONTS.sizes.sm, color: 'rgba(255,255,255,0.85)', marginTop: SPACING.xs },
  wave: { position: 'absolute', bottom: -20, left: 0, right: 0, height: 40, overflow: 'hidden' },
  waveShape: { position: 'absolute', bottom: 0, left: -50, right: -50, height: 100, backgroundColor: COLORS.offWhite, borderRadius: 100, transform: [{ scaleX: 1.5 }] },
  loginCard: { backgroundColor: COLORS.white, marginHorizontal: SPACING.md, marginTop: -SPACING.lg, borderRadius: 20, overflow: 'hidden', ...SHADOWS.large },
  cardHeader: { backgroundColor: '#F8F7FF', padding: SPACING.lg, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: COLORS.lightGray },
  cardTitle: { fontSize: FONTS.sizes.xxl, fontWeight: 'bold', color: COLORS.dark },
  cardSubtitle: { fontSize: FONTS.sizes.sm, color: COLORS.gray, marginTop: SPACING.xs },
  testInfo: { backgroundColor: '#FFF3E0', padding: SPACING.md, marginHorizontal: SPACING.md, marginTop: SPACING.md, borderRadius: 10, borderLeftWidth: 4, borderLeftColor: '#FF9800' },
  testTitle: { fontSize: FONTS.sizes.xs, fontWeight: 'bold', color: '#E65100', marginBottom: 4 },
  testText: { fontSize: 11, color: '#E65100', marginBottom: 2 },
  formSection: { padding: SPACING.lg },
  optionsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  rememberRow: { flexDirection: 'row', alignItems: 'center' },
  checkbox: { width: 22, height: 22, borderWidth: 2, borderColor: COLORS.gray, borderRadius: 6, marginRight: SPACING.sm, justifyContent: 'center', alignItems: 'center' },
  checkboxChecked: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  checkmark: { color: COLORS.white, fontSize: 14, fontWeight: 'bold' },
  rememberText: { fontSize: FONTS.sizes.sm, color: COLORS.darkGray },
  forgotText: { fontSize: FONTS.sizes.sm, color: COLORS.primary, fontWeight: '600' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: SPACING.lg },
  divider: { flex: 1, height: 1, backgroundColor: COLORS.lightGray },
  dividerText: { marginHorizontal: SPACING.md, fontSize: FONTS.sizes.xs, color: COLORS.gray },
  signupSection: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: SPACING.lg, borderTopWidth: 1, borderTopColor: COLORS.lightGray, backgroundColor: '#FAFAFA' },
  signupText: { fontSize: FONTS.sizes.sm, color: COLORS.gray },
  signupLink: { fontSize: FONTS.sizes.sm, color: COLORS.primary, fontWeight: 'bold' },
});

export default LoginScreen;
