// components/PinLock.tsx - Quick PIN Code Login
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Vibration,
} from 'react-native';
import { COLORS, FONTS, SPACING, SHADOWS } from '../constants/theme';

interface PinLockProps {
  onSuccess: () => void;
  onCancel: () => void;
  correctPin?: string;
  title?: string;
}

const PinLock: React.FC<PinLockProps> = ({
  onSuccess,
  onCancel,
  correctPin = '1234',
  title = 'Enter PIN',
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (pin.length === 4) {
      setTimeout(() => {
        if (pin === correctPin) {
          onSuccess();
        } else {
          setError(true);
          Vibration.vibrate(100);
          shakePin();
          setTimeout(() => {
            setPin('');
            setError(false);
          }, 500);
        }
      }, 200);
    }
  }, [pin]);

  const shakePin = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handlePress = (digit: string) => {
    if (pin.length < 4) setPin(p => p + digit);
  };

  const handleDelete = () => {
    setPin(p => p.slice(0, -1));
  };

  const renderDot = (index: number) => (
    <View
      key={index}
      style={[
        styles.dot,
        index < pin.length && styles.dotFilled,
        error && styles.dotError,
      ]}
    />
  );

  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      
      {/* PIN Dots */}
      <Animated.View style={[styles.dotsContainer, { transform: [{ translateX: shakeAnim }] }]}>
        {[0, 1, 2, 3].map(renderDot)}
      </Animated.View>

      {error && <Text style={styles.errorText}>Incorrect PIN</Text>}

      {/* Number Pad */}
      <View style={styles.numPad}>
        {digits.map((digit, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.numKey, digit === '' && styles.emptyKey]}
            onPress={() => {
              if (digit === '⌫') handleDelete();
              else if (digit !== '') handlePress(digit);
            }}
            disabled={digit === ''}
          >
            <Text style={styles.numText}>
              {digit === '⌫' ? '⌫' : digit}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity onPress={onCancel}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  title: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: SPACING.xl,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: SPACING.xl,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.lightGray,
  },
  dotFilled: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  dotError: {
    backgroundColor: COLORS.error,
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONTS.sizes.sm,
    marginBottom: SPACING.lg,
  },
  numPad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: 280,
    gap: 8,
  },
  numKey: {
    width: 80,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: COLORS.offWhite,
  },
  emptyKey: {
    backgroundColor: 'transparent',
  },
  numText: {
    fontSize: 24,
    fontWeight: '500',
    color: COLORS.dark,
  },
  cancelText: {
    marginTop: SPACING.xl,
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default PinLock;
