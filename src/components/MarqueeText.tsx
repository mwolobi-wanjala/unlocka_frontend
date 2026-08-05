// components/MarqueeText.tsx - Enhanced Marquee with Toast Support
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text, StyleSheet, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FONTS, APP_INFO } from '../constants/theme';

const { width } = Dimensions.get('window');

const DEFAULT_TEXT = `🔓 ${APP_INFO.name} v${APP_INFO.version} • Omoka!!! • `;

const COLORS = [
  '#FFD700', '#FFA500', '#FF6347', '#FF6B6B', '#FFD93D',
  '#6BCB77', '#4D96FF', '#9B59B6', '#FF69B4', '#00CED1',
  '#FFD700',
];

interface MarqueeTextProps {
  speed?: number;
  style?: object;
}

const MarqueeText: React.FC<MarqueeTextProps> = ({ speed = 15, style }) => {
  const scrollAnim = useRef(new Animated.Value(width)).current;
  const colorAnim = useRef(new Animated.Value(0)).current;
  const [text, setText] = useState(DEFAULT_TEXT);
  const COLOR_CYCLE_DURATION = 30000;

  useEffect(() => {
    loadMarqueeText();
    
    // Listen for changes
    const interval = setInterval(loadMarqueeText, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const textWidth = text.length * 12;
    const totalDistance = width + textWidth;
    const scrollDuration = (totalDistance / speed) * 1000;

    const scrollAnimation = Animated.loop(
      Animated.timing(scrollAnim, {
        toValue: -textWidth,
        duration: scrollDuration,
        useNativeDriver: true,
      })
    );

    const colorAnimation = Animated.loop(
      Animated.timing(colorAnim, {
        toValue: 1,
        duration: COLOR_CYCLE_DURATION * COLORS.length,
        useNativeDriver: false,
      })
    );

    scrollAnimation.start();
    colorAnimation.start();

    return () => {
      scrollAnimation.stop();
      colorAnimation.stop();
    };
  }, [text, speed]);

  const loadMarqueeText = async () => {
    try {
      const saved = await AsyncStorage.getItem('@marquee_text');
      if (saved && saved !== text) {
        setText(saved);
      }
    } catch {}
  };

  const animatedColor = colorAnim.interpolate({
    inputRange: COLORS.map((_, i) => i / (COLORS.length - 1)),
    outputRange: COLORS,
  });

  const repeatedText = `${text} ${text} ${text}`;

  return (
    <Animated.View style={[styles.container, { transform: [{ translateX: scrollAnim }] }]}>
      <Animated.Text style={[styles.text, style, { color: animatedColor }]} numberOfLines={1}>
        {repeatedText}
      </Animated.Text>
    </Animated.View>
  );
};

// Export with toast callback
export const setMarqueeText = async (newText: string): Promise<void> => {
  try {
    const fullText = newText.includes('•') ? newText : `${newText} • `;
    await AsyncStorage.setItem('@marquee_text', fullText);
  } catch (error) {
    throw new Error('Failed to save marquee text');
  }
};

export const getMarqueeText = async (): Promise<string> => {
  try {
    const saved = await AsyncStorage.getItem('@marquee_text');
    return saved || DEFAULT_TEXT;
  } catch {
    return DEFAULT_TEXT;
  }
};

export const resetMarqueeText = async (): Promise<void> => {
  await AsyncStorage.removeItem('@marquee_text');
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center' },
  text: { fontSize: FONTS.sizes.xs || 12, fontWeight: '700', letterSpacing: 0.8 },
});

export default MarqueeText;
