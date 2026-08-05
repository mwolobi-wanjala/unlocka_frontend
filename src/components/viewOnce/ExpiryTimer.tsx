// components/viewOnce/ExpiryTimer.tsx - Countdown timer for view once
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING } from '../../constants/theme';

interface ExpiryTimerProps {
  expiresAt: string;
  onExpired?: () => void;
}

const ExpiryTimer: React.FC<ExpiryTimerProps> = ({ expiresAt, onExpired }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isExpired, setIsExpired] = useState(false);
  const [urgency, setUrgency] = useState<'normal' | 'warning' | 'danger'>('normal');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expiry = new Date(expiresAt).getTime();
      const diff = expiry - now;

      if (diff <= 0) {
        setIsExpired(true);
        setTimeLeft('Expired');
        setUrgency('danger');
        onExpired?.();
        clearInterval(interval);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      
      if (diff < 3600000) setUrgency('danger'); // < 1 hour
      else if (diff < 10800000) setUrgency('warning'); // < 3 hours
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  return (
    <View style={[styles.container, styles[urgency]]}>
      <Text style={styles.icon}>{isExpired ? '⏰' : '⏳'}</Text>
      <Text style={styles.text}>
        {isExpired ? 'Expired' : `Expires in: ${timeLeft}`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: 12,
    gap: 4,
  },
  normal: { backgroundColor: '#E8F5E9' },
  warning: { backgroundColor: '#FFF3E0' },
  danger: { backgroundColor: '#FFEBEE' },
  icon: { fontSize: 12 },
  text: { fontSize: FONTS.sizes.xs, fontWeight: '600' },
});

export default ExpiryTimer;
