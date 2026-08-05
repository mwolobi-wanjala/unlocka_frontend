// components/LoadingOverlay.tsx - Professional Enterprise-Grade Loading Indicator with Cancel Action
import React, { useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { COLORS, FONTS, SPACING, SHADOWS } from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
  subMessage?: string;
  onCancel?: () => void;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message = 'Loading...',
  subMessage = 'Please wait',
  onCancel,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;
  const secondarySpinAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const animateIn = useCallback(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        damping: 14,
        stiffness: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, scale]);

  const animateOut = useCallback((callback?: () => void) => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(callback);
  }, [opacity]);

  useEffect(() => {
    let mainSpinLoop: Animated.CompositeAnimation;
    let secondarySpinLoop: Animated.CompositeAnimation;
    let pulseLoop: Animated.CompositeAnimation;

    if (visible) {
      animateIn();

      // Smooth Primary Continuous Spin
      mainSpinLoop = Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        })
      );
      mainSpinLoop.start();

      // Counter-rotation for sophisticated dual-ring depth
      secondarySpinLoop = Animated.loop(
        Animated.timing(secondarySpinAnim, {
          toValue: 1,
          duration: 1800,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      secondarySpinLoop.start();

      // Subtle atmospheric pulsing
      pulseLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      pulseLoop.start();
    } else {
      animateOut();
    }

    return () => {
      if (mainSpinLoop) mainSpinLoop.stop();
      if (secondarySpinLoop) secondarySpinLoop.stop();
      if (pulseLoop) pulseLoop.stop();
    };
  }, [visible, animateIn, animateOut, spinAnim, secondarySpinAnim, pulseAnim]);

  if (!visible) return null;

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const reverseSpin = secondarySpinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['360deg', '0deg'],
  });

  return (
    <Animated.View 
      style={[styles.overlay, { opacity }]}
      accessibilityRole="progressbar"
      accessibilityLiveRegion="polite"
    >
      {/* Immersive Dark Backdrop */}
      <View style={styles.backdrop} />

      {/* Modern Floating Glass Card */}
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        
        {/* Cancel Button (X) at Top Right */}
        {onCancel && (
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onCancel}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Cancel loading"
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        )}

        {/* Professional Dual-Ring Spinner System */}
        <View style={styles.spinnerContainer}>
          {/* Outer Ring */}
          <Animated.View
            style={[
              styles.ringOuter,
              {
                transform: [{ rotate: spin }],
              },
            ]}
          />

          {/* Inner Accent Ring */}
          <Animated.View
            style={[
              styles.ringInner,
              {
                transform: [{ rotate: reverseSpin }, { scale: pulseAnim }],
              },
            ]}
          />

          {/* Core Dot Indicator */}
          <View style={styles.coreDot} />
        </View>

        {/* Text Section */}
        <View style={styles.textContainer}>
          <Text style={styles.message} numberOfLines={1}>{message}</Text>
          {subMessage ? (
            <Text style={styles.subMessage} numberOfLines={1}>{subMessage}</Text>
          ) : null}
        </View>

      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99998,
    elevation: 40,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 10, 15, 0.45)', // Smooth premium dark tone
  },
  card: {
    width: SCREEN_WIDTH * 0.72,
    maxWidth: 240,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: SPACING.lg + 4,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 12,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(100, 116, 139, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
    lineHeight: 16,
  },
  spinnerContainer: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    marginTop: 4,
  },
  ringOuter: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: 'rgba(99, 102, 241, 0.15)',
    borderTopColor: '#6366F1', // Clean professional Indigo
    borderRightColor: '#6366F1',
  },
  ringInner: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: 'rgba(14, 165, 233, 0.15)',
    borderBottomColor: '#0EA5E9', // Cyan corporate accent
    borderLeftColor: '#0EA5E9',
  },
  coreDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6366F1',
    opacity: 0.85,
  },
  textContainer: {
    alignItems: 'center',
    width: '100%',
  },
  message: {
    fontSize: FONTS.sizes.sm || 14,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  subMessage: {
    fontSize: FONTS.sizes.xs || 12,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
});

export default LoadingOverlay;
