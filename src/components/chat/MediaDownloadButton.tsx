// components/chat/MediaDownloadButton.tsx - Download Chat Media
import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { COLORS } from '../../constants/theme';
import { downloadChatMedia, shareMedia } from '../../utils/mediaDownloader';
import { useToast } from '../../../App';

interface MediaDownloadButtonProps {
  mediaUrl: string;
  mediaType: 'image' | 'video' | 'audio' | 'document';
  fileName?: string;
  compact?: boolean;
}

const MediaDownloadButton: React.FC<MediaDownloadButtonProps> = ({
  mediaUrl, mediaType, fileName, compact = false,
}) => {
  const { showToast } = useToast();
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    const result = await downloadChatMedia(mediaUrl, mediaType, fileName);
    if (result.success) {
      showToast(`✅ ${mediaType} saved to device!`);
    } else {
      Alert.alert('Download Failed', result.message);
    }
    setDownloading(false);
  };

  if (compact) {
    return (
      <TouchableOpacity style={styles.compactBtn} onPress={handleDownload} disabled={downloading}>
        {downloading ? (
          <ActivityIndicator size="small" color={COLORS.primary} />
        ) : (
          <Text style={styles.compactIcon}>📥</Text>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.button} onPress={handleDownload} disabled={downloading}>
      {downloading ? (
        <ActivityIndicator size="small" color="#FFF" />
      ) : (
        <Text style={styles.text}>📥 Download</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  text: { color: '#FFF', fontSize: 11, fontWeight: '600' },
  compactBtn: { padding: 4 },
  compactIcon: { fontSize: 18 },
});

export default MediaDownloadButton;
