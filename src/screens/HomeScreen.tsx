// screens/HomeScreen.tsx - Clean Home Screen
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, SHADOWS, APP_INFO } from '../constants/theme';
import Button from '../components/Button';
import Footer from '../components/Footer';

const { width } = Dimensions.get('window');

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
  isLoggedIn?: boolean;
  loggedInUser?: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate, isLoggedIn, loggedInUser }) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero Section */}
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.heroCard}>
        <Text style={styles.heroEmoji}>🔓</Text>
        <Text style={styles.heroTitle}>{APP_INFO.name}</Text>
        <Text style={styles.heroSub}>Create Account, Omoka!!!</Text>
      </LinearGradient>

      {/* Welcome Back */}
      {isLoggedIn && loggedInUser && (
        <View style={[styles.card, styles.welcomeCard]}>
          <Text style={styles.welcomeText}>
            👋 Welcome back, <Text style={styles.bold}>{loggedInUser.full_name}</Text>!
          </Text>
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick Actions</Text>
        <Button 
          title="Create Account" 
          icon="👤" 
          onPress={() => onNavigate('signup')} 
          variant="primary" 
        />
        {isLoggedIn ? (
          <Button 
            title="Go to Chats" 
            icon="💬" 
            onPress={() => onNavigate('chats')} 
            variant="success" 
          />
        ) : (
          <TouchableOpacity style={styles.linkWrap} onPress={() => onNavigate('login')}>
            <Text style={styles.linkText}>
              Already have an account?{' '}
              <Text style={styles.linkBold}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Features Summary */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Why Join?</Text>
        <View style={styles.featureRow}>
          <Text style={styles.featureIcon}>💰</Text>
          <Text style={styles.featureText}>Earn {APP_INFO.referralBonus} {APP_INFO.currency} per referral</Text>
        </View>
        <View style={styles.featureRow}>
          <Text style={styles.featureIcon}>🔒</Text>
          <Text style={styles.featureText}>End-to-end encrypted messaging</Text>
        </View>
        <View style={styles.featureRow}>
          <Text style={styles.featureIcon}>💎</Text>
          <Text style={styles.featureText}>View Once paid content</Text>
        </View>
      </View>

      <Footer />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite },
  content: { paddingBottom: SPACING.xxl },
  heroCard: { 
    margin: SPACING.md, padding: SPACING.xl, borderRadius: 20, 
    alignItems: 'center', ...SHADOWS.large 
  },
  heroEmoji: { fontSize: 48, marginBottom: SPACING.sm },
  heroTitle: { fontSize: FONTS.sizes.xxxl, fontWeight: 'bold', color: COLORS.white },
  heroSub: { fontSize: FONTS.sizes.sm, color: 'rgba(255,255,255,0.85)', marginTop: SPACING.xs },
  card: { 
    backgroundColor: COLORS.white, marginHorizontal: SPACING.md, 
    marginBottom: SPACING.sm, padding: SPACING.lg, borderRadius: 16, ...SHADOWS.medium 
  },
  welcomeCard: { 
    backgroundColor: '#F0EEFF', borderLeftWidth: 4, borderLeftColor: COLORS.primary 
  },
  welcomeText: { fontSize: FONTS.sizes.sm, color: COLORS.dark },
  bold: { fontWeight: 'bold', color: COLORS.primary },
  cardTitle: { fontSize: FONTS.sizes.lg, fontWeight: 'bold', color: COLORS.dark, marginBottom: SPACING.md },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm, gap: SPACING.sm },
  featureIcon: { fontSize: 20 },
  featureText: { fontSize: FONTS.sizes.sm, color: COLORS.darkGray, flex: 1 },
  linkWrap: { alignItems: 'center', marginTop: SPACING.sm },
  linkText: { fontSize: FONTS.sizes.sm, color: COLORS.gray },
  linkBold: { color: COLORS.primary, fontWeight: 'bold' },
});

export default HomeScreen;

// Add this before the Sign Up button in signup form
<View style={styles.termsRow}>
  <Text style={styles.termsText}>
    By creating an account, you agree to our{' '}
    <Text style={styles.termsLink} onPress={() => onNavigate('termsOfService')}>
      Terms of Service
    </Text>
    {' '}and{' '}
    <Text style={styles.termsLink} onPress={() => onNavigate('privacyPolicy')}>
      Privacy Policy
    </Text>
  </Text>
</View>
