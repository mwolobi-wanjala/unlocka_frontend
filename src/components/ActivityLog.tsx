// components/ActivityLog.tsx - Login Activity History
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { COLORS, FONTS, SPACING, SHADOWS } from '../constants/theme';

interface ActivityItem {
  id: number;
  login_time: string;
  ip_address: string;
  device_info: string;
  success: boolean;
  location?: string;
}

interface ActivityLogProps {
  activities: ActivityItem[];
}

const ActivityLog: React.FC<ActivityLogProps> = ({ activities }) => {
  const renderItem = ({ item }: { item: ActivityItem }) => (
    <View style={styles.item}>
      <View style={styles.itemLeft}>
        <Text style={styles.itemIcon}>{item.success ? '✅' : '❌'}</Text>
        <View>
          <Text style={styles.itemTime}>{item.login_time}</Text>
          <Text style={styles.itemDevice}>{item.device_info?.slice(0, 30)}</Text>
          <Text style={styles.itemIP}>IP: {item.ip_address}</Text>
        </View>
      </View>
      <Text style={[styles.status, item.success ? styles.success : styles.failed]}>
        {item.success ? 'Success' : 'Failed'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔐 Login Activity</Text>
      {activities.length === 0 ? (
        <Text style={styles.empty}>No recent activity</Text>
      ) : (
        <FlatList
          data={activities}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.white, borderRadius: 16, padding: SPACING.lg, ...SHADOWS.medium },
  title: { fontSize: FONTS.sizes.lg, fontWeight: 'bold', color: COLORS.dark, marginBottom: SPACING.md },
  empty: { fontSize: FONTS.sizes.sm, color: COLORS.gray, textAlign: 'center', padding: SPACING.lg },
  item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.lightGray },
  itemLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  itemIcon: { fontSize: 20, marginRight: SPACING.sm },
  itemTime: { fontSize: FONTS.sizes.xs, color: COLORS.dark, fontWeight: '600' },
  itemDevice: { fontSize: 10, color: COLORS.gray },
  itemIP: { fontSize: 10, color: COLORS.gray },
  status: { fontSize: FONTS.sizes.xs, fontWeight: '600', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  success: { backgroundColor: '#D4EDDA', color: '#155724' },
  failed: { backgroundColor: '#F8D7DA', color: '#721C24' },
});

export default ActivityLog;
