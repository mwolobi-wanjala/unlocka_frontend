// components/Toast.tsx - Professional Enterprise-Grade Toast with Audio Alert
import React, { useEffect, useRef, useCallback } from 'react';
import {
  Animated,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import { Audio } from 'expo-av';
import { FONTS, SPACING, SHADOWS } from '../constants/theme';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type?: ToastType;
  visible: boolean;
  duration?: number;
  onDismiss: () => void;
  delay?: number;
  enableSound?: boolean;
}

const icons = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  warning: '!',
};

const toastConfig = {
  success: { 
    bg: '#0F172A', 
    border: '#10B981', 
    text: '#F8FAFC', 
    subText: '#94A3B8',
    accent: '#10B981' 
  },
  error: { 
    bg: '#0F172A', 
    border: '#EF4444', 
    text: '#F8FAFC', 
    subText: '#94A3B8',
    accent: '#EF4444' 
  },
  info: { 
    bg: '#0F172A', 
    border: '#6366F1', 
    text: '#F8FAFC', 
    subText: '#94A3B8',
    accent: '#6366F1' 
  },
  warning: { 
    bg: '#0F172A', 
    border: '#F59E0B', 
    text: '#F8FAFC', 
    subText: '#94A3B8',
    accent: '#F59E0B' 
  },
};

const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  visible,
  duration = 3000,
  onDismiss,
  delay = 0,
  enableSound = true,
}) => {
  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.95)).current;

  // Function to play sound alert using Expo AV
  const playSound = async () => {
    if (!enableSound) return;
    try {
      // Using standard system sound URI or an embedded notification asset.
      // Note: For custom sounds, you can replace this URI with a local require() statement e.g., require('../assets/sounds/notification.mp3')
      const soundUri = 
        type === 'success' 
          ? 'https://raw.githubusercontent.com/joshua-s/react-native-toast-message/master/assets/success.mp3'
          : type === 'error'
          ? 'https://raw.githubusercontent.com/joshua-s/react-native-toast-message/master/assets/error.mp3'
          : 'https://raw.githubusercontent.com/joshua-s/react-native-toast-message/master/assets/info.mp3';

      const { sound } = await Audio.Sound.createAsync(
        { uri: soundUri },
        { shouldPlay: true }
      );
      
      // Clean up sound instance after playback
      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.isLoaded && status.didJustFinish) {
          await sound.unloadAsync();
        }
      });
    } catch (error) {
      // Gracefully catch audio errors (e.g. muted device or network timeout)
      console.log('Audio alert playback skipped:', error);
    }
  };

  const dismiss = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -120,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => onDismiss());
  }, [translateY, opacity, onDismiss]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (visible) {
      // Trigger sound alert on show
      playSound();

      const showTimer = setTimeout(() => {
        Animated.parallel([
          Animated.spring(translateY, {
            toValue: 0,
            damping: 14,
            stiffness: 160,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 220,
            useNativeDriver: true,
          }),
          Animated.spring(scale, {
            toValue: 1,
            damping: 14,
            stiffness: 160,
            useNativeDriver: true,
          }),
        ]).start();

        timer = setTimeout(() => {
          dismiss();
        }, duration);
      }, delay);

      return () => {
        clearTimeout(showTimer);
        if (timer) clearTimeout(timer);
      };
    }
  }, [visible, duration, delay, dismiss, translateY, opacity, scale]);

  if (!visible) return null;

  const theme = toastConfig[type] || toastConfig.info;

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          transform: [
            { translateY },
            { scale },
          ],
          opacity,
        },
      ]}
      accessibilityRole="alert"
      accessibilityLiveRegion="assertive"
    >
      <TouchableOpacity
        style={[styles.container, { backgroundColor: theme.bg }]}
        onPress={dismiss}
        activeOpacity={0.92}
      >
        {/* Left Status Accent Indicator Bar */}
        <View style={[styles.accentBar, { backgroundColor: theme.accent }]} />

        {/* Minimalist Icon Badge */}
        <View style={[styles.iconContainer, { backgroundColor: `${theme.accent}15` }]}>
          <Text style={[styles.icon, { color: theme.accent }]}>{icons[type]}</Text>
        </View>

        {/* Message Content */}
        <View style={styles.textContainer}>
          <Text style={[styles.message, { color: theme.text }]} numberOfLines={2}>
            {message}
          </Text>
        </View>

        {/* Subtle Dismiss Clue / Touch Target */}
        <View style={styles.dismissIndicator} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 54,
    left: SPACING.md,
    right: SPACING.md,
    zIndex: 99999,
    elevation: 30,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: SPACING.md,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 10,
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm + 2,
    marginLeft: 4,
  },
  icon: {
    fontSize: 14,
    fontWeight: '800',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    marginRight: SPACING.xs,
  },
  message: {
    fontSize: FONTS.sizes.sm || 13,
    fontWeight: '600',
    lineHeight: 18,
    letterSpacing: 0.2,
  },
  dismissIndicator: {
    width: 4,
    height: 16,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginLeft: SPACING.xs,
  },
});

export default Toast;
