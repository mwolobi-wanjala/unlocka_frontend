// components/viewOnce/QuickCameraFAB.tsx - Quick camera access button
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { COLORS, SHADOWS } from '../../constants/theme';
import CameraRecorder from './CameraRecorder';

interface QuickCameraFABProps {
  onCapture: (uri: string, type: 'photo' | 'video') => void;
}

const QuickCameraFAB: React.FC<QuickCameraFABProps> = ({ onCapture }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraMode, setCameraMode] = useState<'photo' | 'video'>('photo');

  const handleCapture = (uri: string, type: 'photo' | 'video') => {
    setShowCamera(false);
    if (uri) {
      onCapture(uri, type);
    }
  };

  if (showCamera) {
    return (
      <View style={StyleSheet.absoluteFill}>
        <CameraRecorder
          mode={cameraMode}
          onCapture={handleCapture}
          onClose={() => setShowCamera(false)}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Menu options */}
      {showMenu && (
        <View style={styles.menu}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setCameraMode('photo');
              setShowCamera(true);
              setShowMenu(false);
            }}
          >
            <Text style={styles.menuIcon}>📷</Text>
            <Text style={styles.menuText}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setCameraMode('video');
              setShowCamera(true);
              setShowMenu(false);
            }}
          >
            <Text style={styles.menuIcon}>🎥</Text>
            <Text style={styles.menuText}>Record Video</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* FAB Button */}
      <TouchableOpacity
        style={[styles.fab, showMenu && styles.fabActive]}
        onPress={() => setShowMenu(!showMenu)}
      >
        <Text style={styles.fabIcon}>{showMenu ? '✕' : '📸'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    alignItems: 'flex-end',
  },
  menu: {
    marginBottom: 16,
    gap: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
    ...SHADOWS.medium,
  },
  menuIcon: { fontSize: 20 },
  menuText: { fontSize: 14, fontWeight: '600', color: COLORS.dark },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#25D366',
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.large,
  },
  fabActive: { backgroundColor: '#F44336' },
  fabIcon: { fontSize: 26 },
});

export default QuickCameraFAB;
