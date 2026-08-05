
// Add this import at top of SendViewOnce.tsx
import CameraRecorder from './CameraRecorder';

// Add these state variables inside SendViewOnce component
const [showCamera, setShowCamera] = useState(false);
const [cameraMode, setCameraMode] = useState<'photo' | 'video'>('photo');

// Update the type selector to include Camera option
// Replace the existing typeSelector section with:

{/* Content type selector with Camera */}
<View style={styles.typeSelector}>
  <TouchableOpacity
    style={[styles.typeBtn, contentType === 'text' && styles.activeType]}
    onPress={() => setContentType('text')}
  >
    <Text style={styles.typeIcon}>💬</Text>
    <Text style={styles.typeLabel}>Text</Text>
  </TouchableOpacity>
  <TouchableOpacity
    style={[styles.typeBtn, contentType === 'image' && !showCamera && styles.activeType]}
    onPress={() => {
      setContentType('image');
      setCameraMode('photo');
      setShowCamera(true);
    }}
  >
    <Text style={styles.typeIcon}>📷</Text>
    <Text style={styles.typeLabel}>Camera</Text>
  </TouchableOpacity>
  <TouchableOpacity
    style={[styles.typeBtn, contentType === 'video' && !showCamera && styles.activeType]}
    onPress={() => {
      setContentType('video');
      setCameraMode('video');
      setShowCamera(true);
    }}
  >
    <Text style={styles.typeIcon}>🎥</Text>
    <Text style={styles.typeLabel}>Video</Text>
  </TouchableOpacity>
  <TouchableOpacity
    style={[styles.typeBtn, mediaUri && !showCamera && contentType !== 'text' && styles.activeType]}
    onPress={() => pickMedia('image')}
  >
    <Text style={styles.typeIcon}>🖼️</Text>
    <Text style={styles.typeLabel}>Gallery</Text>
  </TouchableOpacity>
</View>

// Show camera or media preview
{showCamera ? (
  <View style={styles.cameraContainer}>
    <CameraRecorder
      mode={cameraMode}
      onCapture={(uri, type) => {
        if (uri) {
          setMediaUri(uri);
          setContentType(type === 'video' ? 'video' : 'image');
        }
        setShowCamera(false);
      }}
      onClose={() => setShowCamera(false)}
    />
  </View>
) : mediaUri ? (
  <View style={styles.mediaPreview}>
    {contentType === 'video' ? (
      <View style={styles.videoPreview}>
        <Image source={{ uri: mediaUri }} style={styles.mediaImage} />
        <View style={styles.playOverlay}>
          <Text style={styles.playIcon}>▶️</Text>
          <Text style={styles.videoLabel}>Video captured</Text>
        </View>
      </View>
    ) : (
      <Image source={{ uri: mediaUri }} style={styles.mediaImage} />
    )}
    <TouchableOpacity
      style={styles.removeMedia}
      onPress={() => setMediaUri(null)}
    >
      <Text style={styles.removeMediaText}>✕</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={styles.retakeBtn}
      onPress={() => {
        setShowCamera(true);
        setCameraMode(contentType === 'video' ? 'video' : 'photo');
      }}
    >
      <Text style={styles.retakeText}>📷 Retake</Text>
    </TouchableOpacity>
  </View>
) : (
  <TouchableOpacity
    style={styles.pickMediaBtn}
    onPress={() => {
      setCameraMode(contentType === 'video' ? 'video' : 'photo');
      setShowCamera(true);
    }}
  >
    <Text style={styles.pickMediaIcon}>📸</Text>
    <Text style={styles.pickMediaText}>
      Tap to use camera for {contentType === 'video' ? 'video' : 'photo'}
    </Text>
  </TouchableOpacity>
)}

// Add these styles
cameraContainer: { height: height * 0.5, borderRadius: 12, overflow: 'hidden', marginBottom: SPACING.md },
videoPreview: { position: 'relative' },
playOverlay: {
  position: 'absolute',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.3)',
  justifyContent: 'center',
  alignItems: 'center',
},
playIcon: { fontSize: 40, color: '#FFF' },
videoLabel: { color: '#FFF', fontSize: FONTS.sizes.sm, marginTop: SPACING.sm },
retakeBtn: {
  position: 'absolute',
  bottom: 8,
  left: 8,
  backgroundColor: 'rgba(0,0,0,0.6)',
  paddingHorizontal: SPACING.md,
  paddingVertical: SPACING.xs,
  borderRadius: 15,
},
retakeText: { color: '#FFF', fontSize: FONTS.sizes.xs },
