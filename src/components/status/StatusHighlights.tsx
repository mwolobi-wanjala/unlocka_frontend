// components/status/StatusHighlights.tsx - Pinned Status Highlights
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { COLORS, FONTS, SPACING } from '../../constants/theme';

interface Highlight {
  id: string;
  title: string;
  cover: string;
  statusCount: number;
}

interface StatusHighlightsProps {
  highlights: Highlight[];
  onPress: (highlight: Highlight) => void;
  onAdd: () => void;
}

const StatusHighlights: React.FC<StatusHighlightsProps> = ({ highlights, onPress, onAdd }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Highlights</Text>
        <TouchableOpacity onPress={onAdd}><Text style={styles.addBtn}>+ New</Text></TouchableOpacity>
      </View>
      
      {highlights.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📌</Text>
          <Text style={styles.emptyText}>Pin your favorite statuses here</Text>
          <Text style={styles.emptySubtext}>They'll stay until you remove them</Text>
        </View>
      ) : (
        <FlatList
          data={highlights}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.item} onPress={() => onPress(item)}>
              <View style={styles.ring}>
                <View style={styles.circle}>
                  <Text style={styles.emoji}>📌</Text>
                </View>
              </View>
              <Text style={styles.label} numberOfLines={1}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.md, marginBottom: SPACING.sm },
  title: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.gray },
  addBtn: { color: COLORS.primary, fontWeight: '600', fontSize: FONTS.sizes.sm },
  empty: { alignItems: 'center', padding: SPACING.md },
  emptyIcon: { fontSize: 30, marginBottom: 4 },
  emptyText: { fontSize: FONTS.sizes.xs, color: COLORS.dark },
  emptySubtext: { fontSize: 10, color: COLORS.gray },
  list: { paddingHorizontal: SPACING.md, gap: SPACING.md },
  item: { alignItems: 'center', width: 72 },
  ring: { width: 64, height: 64, borderRadius: 32, borderWidth: 2, borderColor: COLORS.lightGray, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  circle: { width: 54, height: 54, borderRadius: 27, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center' },
  emoji: { fontSize: 20 },
  label: { fontSize: 10, color: COLORS.dark, textAlign: 'center', width: 72 },
});

export default StatusHighlights;
