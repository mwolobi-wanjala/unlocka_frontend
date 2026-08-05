// components/viewOnce/CameraRecorder.tsx - Camera for View Once
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Dimensions,
  Alert, ActivityIndicator,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions, FlashMode } from 'expo-camera';
import { COLORS, FONTS, SPACING } from '../../constants/theme';

const { width, height } = Dimensions.get('window');

interface CameraRecorderProps {
  onCapture: (uri: string, type: 'photo' | 'video') => void;
  onClose: () => void;
  mode: 'photo' | 'video';
}

const CameraRecorder: React.FC<CameraRecorderProps> = ({
  onCapture,
  onClose,
  mode = 'photo',
}) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<FlashMode>('off');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasPermission, setHasPermission] = useState(false);
  
  const cameraRef = useRef<any>(null);
  const recordingTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    (async () => {
      if (!permission?.granted) {
        const result = await requestPermission();
        setHasPermission(result.granted);
      } else {
        setHasPermission(true);
      }
    })();

    return () => {
      if (recordingTimer.current) clearInterval(recordingTimer.current);
    };
  }, [permission]);

  // Recording timer
  useEffect(() => {
    if (isRecording) {
      recordingTimer.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 60) {
            stopRecording();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (recordingTimer.current) clearInterval(recordingTimer.current);
      setRecordingTime(0);
    }
    return () => {
      if (recordingTimer.current) clearInterval(recordingTimer.current);
    };
  }, [isRecording]);

  const toggleFacing = () => {
    setFacing(prev => (prev === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlash(prev => (prev === 'off' ? 'on' : 'off'));
  };

  // Take photo
  const takePhoto = async () => {
    if (!cameraRef.current) return;
    
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });
      
      if (photo?.uri) {
        onCapture(photo.uri, 'photo');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  // Start video recording
  const startRecording = async () => {
    if (!cameraRef.current) return;
    
    try {
      setIsRecording(true);
      
      const video = await cameraRef.current.recordAsync({
        maxDuration: 60, // Max 60 seconds for view once
        quality: '720p',
      });
      
      if (video?.uri) {
        onCapture(video.uri, 'video');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to record video');
      setIsRecording(false);
    }
  };

  // Stop video recording
  const stopRecording = async () => {
    if (!cameraRef.current || !isRecording) return;
    
    try {
      await cameraRef.current.stopRecording();
      setIsRecording(false);
    } catch (error) {
      console.log('Stop recording error:', error);
      setIsRecording(false);
    }
  };

  // Format recording time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!hasPermission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionIcon}>📷</Text>
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionText}>
          Allow camera access to take photos and record videos for View Once
        </Text>
        <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
          <Text style={styles.permissionBtnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Camera View */}
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        flash={flash}
        mode={mode === 'video' ? 'video' : 'picture'}
      >
        {/* Top Controls */}
        <View style={styles.topControls}>
          {/* Close */}
          <TouchableOpacity style={styles.controlBtn} onPress={onClose}>
            <Text style={styles.controlIcon}>✕</Text>
          </TouchableOpacity>

          {/* Flash Toggle */}
          <TouchableOpacity style={styles.controlBtn} onPress={toggleFlash}>
            <Text style={styles.controlIcon}>
              {flash === 'on' ? '⚡' : '🔦'}
            </Text>
          </TouchableOpacity>

          {/* Flip Camera */}
          <TouchableOpacity style={styles.controlBtn} onPress={toggleFacing}>
            <Text style={styles.controlIcon}>🔄</Text>
          </TouchableOpacity>
        </View>

        {/* Recording Timer */}
        {isRecording && (
          <View style={styles.recordingIndicator}>
            <View style={styles.recordingDot} />
            <Text style={styles.recordingTime}>{formatTime(recordingTime)}</Text>
            <Text style={styles.recordingLabel}>REC</Text>
          </View>
        )}

        {/* Bottom Controls */}
        <View style={styles.bottomControls}>
          {/* Gallery shortcut */}
          <TouchableOpacity style={styles.sideBtn}>
            <Text style={styles.sideIcon}>🖼️</Text>
          </TouchableOpacity>

          {/* Capture/Record Button */}
          <TouchableOpacity
            style={[
              styles.captureBtn,
              isRecording && styles.recordingBtn,
              mode === 'video' && styles.videoBtn,
            ]}
            onPress={mode === 'video' ? (isRecording ? stopRecording : startRecording) : takePhoto}
            onLongPress={mode === 'photo' ? startRecording : undefined}
          >
            <View style={[
              styles.captureInner,
              isRecording && styles.recordingInner,
            ]} />
          </TouchableOpacity>

          {/* Mode toggle */}
          <TouchableOpacity
            style={styles.sideBtn}
            onPress={() => {
              // Toggle between photo/video mode
              onCapture('', mode === 'photo' ? 'video' : 'photo');
            }}
          >
            <Text style={styles.sideIcon}>
              {mode === 'photo' ? '🎥' : '📷'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Mode indicator */}
        <View style={styles.modeIndicator}>
          <View style={styles.modePill}>
            <Text style={styles.modeDot}>{mode === 'photo' ? '📷' : '🎥'}</Text>
            <Text style={styles.modeText}>
              {mode === 'photo' ? 'Photo • Tap to capture' : 'Video • Tap to record'}
            </Text>
          </View>
          {mode === 'photo' && (
            <Text style={styles.holdHint}>Hold for video</Text>
          )}
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  
  // Permission
  permissionContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000', padding: SPACING.xl },
  permissionIcon: { fontSize: 60, marginBottom: SPACING.md },
  permissionTitle: { color: '#FFF', fontSize: FONTS.sizes.xl, fontWeight: 'bold', marginBottom: SPACING.sm },
  permissionText: { color: '#999', fontSize: FONTS.sizes.sm, textAlign: 'center', marginBottom: SPACING.lg },
  permissionBtn: { backgroundColor: '#25D366', paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md, borderRadius: 25 },
  permissionBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: FONTS.sizes.md },
  
  // Camera
  camera: { flex: 1 },
  
  // Top Controls
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: SPACING.lg,
  },
  controlBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlIcon: { fontSize: 18, color: '#FFF' },
  
  // Recording indicator
  recordingIndicator: {
    position: 'absolute',
    top: 100,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(244,67,54,0.8)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
    gap: SPACING.sm,
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFF',
  },
  recordingTime: { color: '#FFF', fontSize: FONTS.sizes.md, fontWeight: 'bold' },
  recordingLabel: { color: '#FFF', fontSize: FONTS.sizes.xs },
  
  // Bottom Controls
  bottomControls: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  sideBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sideIcon: { fontSize: 20 },
  
  // Capture Button
  captureBtn: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  videoBtn: { borderColor: '#F44336' },
  recordingBtn: {
    borderColor: '#F44336',
    transform: [{ scale: 1.1 }],
  },
  captureInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#FFF',
  },
  recordingInner: {
    width: 30,
    height: 30,
    borderRadius: 4,
    backgroundColor: '#F44336',
  },
  
  // Mode indicator
  modeIndicator: {
    position: 'absolute',
    top: 120,
    alignSelf: 'center',
    alignItems: 'center',
  },
  modePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 15,
    gap: 6,
  },
  modeDot: { fontSize: 12 },
  modeText: { color: '#FFF', fontSize: FONTS.sizes.xs },
  holdHint: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
    marginTop: 4,
  },
});

export default CameraRecorder;
