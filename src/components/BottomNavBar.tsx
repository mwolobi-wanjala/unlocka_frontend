// components/BottomNavBar.tsx - WhatsApp-Style Bottom Navigation (4 Tabs)
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SPACING, SHADOWS } from '../constants/theme';

export type BottomTab = 'chats' | 'viewOnce' | 'status' | 'creators';

interface BottomNavBarProps {
  activeTab: BottomTab;
  onTabPress: (tab: BottomTab) => void;
  unreadChats?: number;
  unreadViewOnce?: number;
  unreadStatus?: number;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onTabPress,
  unreadChats = 0,
  unreadViewOnce = 0,
  unreadStatus = 0,
}) => {
  const tabs: {
    key: BottomTab;
    label: string;
    icon: string;
  }[] = [
    { key: 'chats', label: 'Chats', icon: '💬' },
    { key: 'viewOnce', label: 'View Once', icon: '💎' },
    { key: 'status', label: 'Status', icon: '📊' },
    { key: 'creators', label: 'Creators', icon: '🎬' },
  ];

  const getUnreadCount = (tab: BottomTab): number => {
    switch (tab) {
      case 'chats': return unreadChats;
      case 'viewOnce': return unreadViewOnce;
      case 'status': return unreadStatus;
      default: return 0;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.border} />
      <View style={styles.tabsRow}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const unread = getUnreadCount(tab.key);

          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tab}
              onPress={() => onTabPress(tab.key)}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <Text style={[styles.icon, isActive && styles.activeIcon]}>
                  {tab.icon}
                </Text>
                {unread > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {unread > 99 ? '99+' : unread}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={[styles.label, isActive && styles.activeLabel]}>
                {tab.label}
              </Text>
              {isActive && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    paddingBottom: 20,
    ...SHADOWS.medium,
  },
  border: {
    height: 0.5,
    backgroundColor: '#E0E0E0',
  },
  tabsRow: {
    flexDirection: 'row',
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    position: 'relative',
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 2,
  },
  icon: {
    fontSize: 22,
    opacity: 0.5,
  },
  activeIcon: {
    opacity: 1,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -12,
    backgroundColor: '#25D366',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 10,
    color: COLORS.gray,
    fontWeight: '600',
    marginTop: 2,
  },
  activeLabel: {
    color: '#25D366',
    fontWeight: 'bold',
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: 24,
    height: 3,
    backgroundColor: '#25D366',
    borderRadius: 2,
  },
});

export default BottomNavBar;
