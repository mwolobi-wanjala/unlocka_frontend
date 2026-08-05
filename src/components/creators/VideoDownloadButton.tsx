// components/creators/VideoDownloadButton.tsx
import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from '../../constants/theme';
import { downloadCreatorVideo } from '../../utils/mediaDownloader';
import { useToast } from '../../../App';

interface VideoDownloadButtonProps {
  videoUrl: string;
  caption: string;
  style?: object;
}

const VideoDownloadButton: React.FC<VideoDownloadButtonProps> = ({ videoUrl, caption, style }) => {
  const { showToast } = useToast();
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDownload = async () => {
    setDownloading(true);
    const result = await downloadCreatorVideo(videoUrl, caption, (prog) => setProgress(prog));
    if (result.success) showToast('✅ Video saved!');
    setDownloading(false);
  };

  return (
    <TouchableOpacity style={[styles.button, style]} onPress={handleDownload} disabled={downloading}>
      {downloading ? (
        <><ActivityIndicator size="small" color="#FFF" /><Text style={styles.text}>{Math.round(progress * 100)}%</Text></>
      ) : (
        <Text style={styles.text}>📥 Save</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 4 },
  text: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
});

export default VideoDownloadButton;
