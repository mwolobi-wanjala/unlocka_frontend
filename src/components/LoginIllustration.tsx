// components/LoginIllustration.tsx - Animated SVG-like illustration
import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

const LoginIllustration: React.FC = () => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.05, duration: 1500, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.illustration, { transform: [{ translateY }, { scale: scaleAnim }] }]}>
        <View style={styles.lockBody}>
          <View style={styles.lockShackle} />
          <View style={styles.lockKeyhole} />
        </View>
        <View style={styles.shield}>
          <Animated.Text style={styles.shieldEmoji}>🛡️</Animated.Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginVertical: 20 },
  illustration: { alignItems: 'center' },
  lockBody: { width: 60, height: 50, backgroundColor: COLORS.primary, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  lockShackle: { width: 30, height: 30, borderRadius: 15, borderWidth: 4, borderColor: COLORS.primary, backgroundColor: 'transparent', position: 'absolute', top: -20 },
  lockKeyhole: { width: 8, height: 12, backgroundColor: COLORS.white, borderRadius: 4 },
  shield: { marginTop: 10 },
  shieldEmoji: { fontSize: 40 },
});

export default LoginIllustration;
