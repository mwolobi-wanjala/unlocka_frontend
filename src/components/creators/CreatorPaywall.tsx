// components/creators/CreatorPaywall.tsx - Creator Subscription Paywall
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ActivityIndicator, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, SHADOWS } from '../../constants/theme';
import Button from '../Button';
import { useToast } from '../../../App';

const { width } = Dimensions.get('window');

interface CreatorPaywallProps {
  userId: number;
  onSubscribe: () => void;
  subscriptionStatus: any;
}

const CreatorPaywall: React.FC<CreatorPaywallProps> = ({ userId, onSubscribe, subscriptionStatus }) => {
  const { showToast } = useToast();
  const [mpesaNumber, setMpesaNumber] = useState('0712345678');
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    const cleaned = mpesaNumber.replace(/\D/g, '');
    if (cleaned.length !== 10) { showToast('Enter valid M-Pesa number'); return; }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast('✅ Creator access activated! 🎬');
      onSubscribe();
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.hero}>
        <Text style={styles.heroIcon}>🎬</Text>
        <Text style={styles.heroTitle}>Unlock Creators</Text>
        <Text style={styles.heroSubtitle}>Access all creator videos</Text>
      </LinearGradient>

      <View style={styles.pricingCard}>
        <View style={styles.priceRow}>
          <Text style={styles.currency}>KSH</Text>
          <Text style={styles.price}>10</Text>
          <Text style={styles.period}>/14 days</Text>
        </View>
        <Text style={styles.priceDesc}>One-time payment for 14 days access</Text>
        
        <View style={styles.featuresList}>
          {['🎬 Unlimited videos', '❤️ Like & comment', '👤 Follow creators', '📤 Share videos', '🔖 Save favorites'].map((f, i) => (
            <View key={i} style={styles.featureItem}>
              <Text style={styles.featureIcon}>{f.split(' ')[0]}</Text>
              <Text style={styles.featureText}>{f.split(' ').slice(1).join(' ')}</Text>
            </View>
          ))}
        </View>

        <View style={styles.expiryInfo}>
          <Text style={styles.expiryIcon}>⏰</Text>
          <Text style={styles.expiryText}>Access expires after 14 days. Renew anytime.</Text>
        </View>
      </View>

      <View style={styles.paymentCard}>
        <Text style={styles.paymentTitle}>Pay with M-Pesa</Text>
        <TextInput
          style={styles.mpesaInput}
          value={mpesaNumber}
          onChangeText={(t) => setMpesaNumber(t.replace(/\D/g, '').slice(0, 10))}
          placeholder="0712345678"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
          maxLength={10}
        />
        <Button title="Pay KSH 10 with M-Pesa" icon="📱" onPress={handlePay} loading={loading} variant="success" />
        <Text style={styles.terms}>By paying, you agree to Creator Terms</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  hero: { alignItems: 'center', paddingVertical: SPACING.xl },
  heroIcon: { fontSize: 60, marginBottom: SPACING.sm },
  heroTitle: { color: '#FFF', fontSize: FONTS.sizes.xxl, fontWeight: 'bold' },
  heroSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: FONTS.sizes.sm },
  pricingCard: { backgroundColor: '#FFF', margin: SPACING.md, borderRadius: 20, padding: SPACING.lg, ...SHADOWS.medium },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', marginBottom: 4 },
  currency: { fontSize: FONTS.sizes.lg, fontWeight: 'bold', color: COLORS.primary, marginRight: 4 },
  price: { fontSize: 50, fontWeight: 'bold', color: COLORS.primary },
  period: { fontSize: FONTS.sizes.sm, color: COLORS.gray, marginLeft: 4 },
  priceDesc: { textAlign: 'center', color: COLORS.gray, fontSize: FONTS.sizes.sm, marginBottom: SPACING.lg },
  featuresList: { marginBottom: SPACING.lg },
  featureItem: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm, gap: SPACING.sm },
  featureIcon: { fontSize: 18, width: 30, textAlign: 'center' },
  featureText: { fontSize: FONTS.sizes.sm, color: COLORS.dark },
  expiryInfo: { flexDirection: 'row', backgroundColor: '#FFF3E0', padding: SPACING.md, borderRadius: 10, gap: SPACING.sm },
  expiryIcon: { fontSize: 20 },
  expiryText: { flex: 1, fontSize: FONTS.sizes.xs, color: '#E65100' },
  paymentCard: { backgroundColor: '#FFF', margin: SPACING.md, borderRadius: 20, padding: SPACING.lg, ...SHADOWS.medium },
  paymentTitle: { fontSize: FONTS.sizes.lg, fontWeight: 'bold', textAlign: 'center', marginBottom: SPACING.md },
  mpesaInput: { borderWidth: 2, borderColor: COLORS.primary, borderRadius: 12, padding: SPACING.md, fontSize: FONTS.sizes.lg, textAlign: 'center', fontWeight: 'bold', marginBottom: SPACING.md },
  terms: { fontSize: 10, color: COLORS.gray, textAlign: 'center', marginTop: SPACING.sm },
});

export default CreatorPaywall;
