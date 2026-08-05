// components/TrustedDevice.tsx - Trust this device
import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants/theme';

interface TrustedDeviceProps {
  onToggle: (trusted: boolean) => void;
}

const TrustedDevice: React.FC<TrustedDeviceProps> = ({ onToggle }) => {
  const [trusted, setTrusted] = useState(false);

  const handleToggle = (value: boolean) => {
    setTrusted(value);
    onToggle(value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.icon}>📱</Text>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Trust this device</Text>
          <Text style={styles.desc}>Skip 2FA on this device for 30 days</Text>
        </View>
      </View>
      <Switch
        value={trusted}
        onValueChange={handleToggle}
        trackColor={{ false: '#ddd', true: COLORS.primary }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.sm },
  info: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  icon: { fontSize: 24, marginRight: SPACING.sm },
  textContainer: { flex: 1 },
  title: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.dark },
  desc: { fontSize: FONTS.sizes.xs, color: COLORS.gray },
});

export default TrustedDevice;
