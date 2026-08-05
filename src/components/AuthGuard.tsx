// components/AuthGuard.tsx - Protects screens from unauthorized access
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, SHADOWS, APP_INFO } from '../constants/theme';
import Button from './Button';
import Footer from './Footer';

const { width } = Dimensions.get('window');

interface AuthGuardProps {
  isLoggedIn: boolean;
  onNavigate: (screen: string) => void;
  children: React.ReactNode;
  screenName: string;
  onGoogleSignIn?: () => void;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  isLoggedIn, onNavigate, children, screenName, onGoogleSignIn 
}) => {
  // Allow these screens without login
  const publicScreens = ['home', 'signup', 'login', 'forgotPassword', 'help', 'about', 
                         'termsOfService', 'privacyPolicy', 'copyrightNotice'];
  
  // If screen is public or user is logged in, show content
  if (publicScreens.includes(screenName) || isLoggedIn) {
    return <>{children}</>;
  }

  // Show lock screen for protected screens
  return (
    <View style={styles.container}>
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.header}>
        <Text style={styles.headerTitle}>{APP_INFO.name}</Text>
      </LinearGradient>

      <View style={styles.lockContent}>
        {/* Lock Icon */}
        <View style={styles.lockIconContainer}>
          <Text style={styles.lockIcon}>🔒</Text>
        </View>

        <Text style={styles.lockTitle}>Access Restricted</Text>
        <Text style={styles.lockSubtitle}>
          You need to create an account or login to access this feature
        </Text>

        {/* Features Preview */}
        <View style={styles.featuresCard}>
          <Text style={styles.featuresTitle}>Unlock All Features:</Text>
          <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>💬</Text>
            <Text style={styles.featureText}>Chat with friends</Text>
          </View>
          <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>💎</Text>
            <Text style={styles.featureText}>Send View Once content</Text>
          </View>
          <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>💰</Text>
            <Text style={styles.featureText}>Earn money from referrals</Text>
          </View>
          <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>🎬</Text>
            <Text style={styles.featureText}>Watch creator videos</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button 
            title="Create Free Account" 
            icon="👤" 
            onPress={() => onNavigate('signup')} 
            variant="primary" 
          />
          
          <Button 
            title="Sign In" 
            icon="🔑" 
            onPress={() => onNavigate('login')} 
            variant="outline" 
          />

          {/* Google Sign-in */}
          {onGoogleSignIn && (
            <>
              <View style={styles.dividerRow}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.divider} />
              </View>
              
              <Button 
                title="Continue with Google" 
                icon="🔵" 
                onPress={onGoogleSignIn} 
                variant="google" 
              />
            </>
          )}
        </View>

        {/* Footer Links - Always accessible */}
        <View style={styles.footerLinks}>
          <TouchableOpacity onPress={() => onNavigate('help')}>
            <Text style={styles.footerLink}>Help</Text>
          </TouchableOpacity>
          <Text style={styles.footerDot}>•</Text>
          <TouchableOpacity onPress={() => onNavigate('about')}>
            <Text style={styles.footerLink}>About</Text>
          </TouchableOpacity>
          <Text style={styles.footerDot}>•</Text>
          <TouchableOpacity onPress={() => onNavigate('termsOfService')}>
            <Text style={styles.footerLink}>Terms</Text>
          </TouchableOpacity>
          <Text style={styles.footerDot}>•</Text>
          <TouchableOpacity onPress={() => onNavigate('privacyPolicy')}>
            <Text style={styles.footerLink}>Privacy</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Footer onNavigate={onNavigate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { paddingTop: 50, paddingBottom: 15, alignItems: 'center' },
  headerTitle: { color: '#FFF', fontSize: FONTS.sizes.lg, fontWeight: 'bold' },
  
  lockContent: { flex: 1, padding: SPACING.lg, alignItems: 'center', justifyContent: 'center' },
  lockIconContainer: { 
    width: 100, height: 100, borderRadius: 50, 
    backgroundColor: '#F0EEFF', justifyContent: 'center', alignItems: 'center',
    marginBottom: SPACING.lg, borderWidth: 3, borderColor: COLORS.primary 
  },
  lockIcon: { fontSize: 40 },
  lockTitle: { fontSize: FONTS.sizes.xxl, fontWeight: 'bold', color: COLORS.dark, marginBottom: SPACING.xs },
  lockSubtitle: { fontSize: FONTS.sizes.sm, color: COLORS.gray, textAlign: 'center', marginBottom: SPACING.lg },
  
  featuresCard: { 
    width: '100%', backgroundColor: '#FFF', borderRadius: 16, 
    padding: SPACING.lg, marginBottom: SPACING.lg, ...SHADOWS.small 
  },
  featuresTitle: { fontSize: FONTS.sizes.md, fontWeight: 'bold', color: COLORS.dark, marginBottom: SPACING.sm },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm, gap: SPACING.sm },
  featureIcon: { fontSize: 18 },
  featureText: { fontSize: FONTS.sizes.sm, color: COLORS.darkGray },
  
  actions: { width: '100%', gap: SPACING.sm },
  
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: SPACING.sm },
  divider: { flex: 1, height: 1, backgroundColor: '#E0E0E0' },
  dividerText: { marginHorizontal: SPACING.sm, color: COLORS.gray, fontSize: FONTS.sizes.xs },
  
  footerLinks: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: SPACING.xl, gap: SPACING.xs, flexWrap: 'wrap' },
  footerLink: { color: COLORS.primary, fontSize: FONTS.sizes.xs, fontWeight: '600' },
  footerDot: { color: COLORS.lightGray, fontSize: 10 },
});

export default AuthGuard;
