// screens/AdminDashboard.tsx - Complete Admin Dashboard with All Privileges
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, FlatList, Alert, ActivityIndicator,
  RefreshControl, Dimensions, Modal, Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, SHADOWS, APP_INFO } from '../constants/theme';
import Button from '../components/Button';

const { width } = Dimensions.get('window');

// Admin Categories with all privileges
const ADMIN_CATEGORIES = [
  {
    id: 'dashboard',
    title: '📊 Dashboard',
    icon: '📊',
    color: '#6C63FF',
    privileges: [
      'Stats Overview', 'Revenue Summary', 'User Count',
      'Content Stats', 'Quick Actions'
    ]
  },
  {
    id: 'users',
    title: '👥 User Management',
    icon: '👥',
    color: '#2196F3',
    privileges: [
      'View All Users', 'Search Users', 'Activate User',
      'Deactivate User', 'Suspend User', 'Delete User',
      'Force Logout', 'Force Password Reset', 'Wipe User Data',
      'View User Details'
    ]
  },
  {
    id: 'content',
    title: '🛡️ Content Moderation',
    icon: '🛡️',
    color: '#FF9800',
    privileges: [
      'View All Content', 'Remove Content', 'Warn User',
      'Flag Content', 'Restore Content', 'Content Search',
      'View Reports', 'Resolve Reports'
    ]
  },
  {
    id: 'transactions',
    title: '💳 Transactions',
    icon: '💳',
    color: '#4CAF50',
    privileges: [
      'View All Transactions', 'Filter Transactions',
      'Transaction Details', 'Revenue Overview',
      'Revenue Breakdown'
    ]
  },
  {
    id: 'analytics',
    title: '📈 Analytics',
    icon: '📈',
    color: '#9C27B0',
    privileges: [
      'Dashboard Stats', 'User Growth', 'Activity Monitor',
      'User Segments', 'Conversion Rates', 'Content Analytics',
      'Engagement Metrics'
    ]
  },
  {
    id: 'system',
    title: '⚙️ System Config',
    icon: '⚙️',
    color: '#607D8B',
    privileges: [
      'App Settings', 'Feature Flags', 'Fee Configuration',
      'Limits Configuration', 'Maintenance Mode',
      'Version Management'
    ]
  },
  {
    id: 'health',
    title: '💚 System Health',
    icon: '💚',
    color: '#00BCD4',
    privileges: [
      'API Status', 'Database Status', 'Storage Usage',
      'Performance Metrics', 'Error Monitoring', 'Uptime Tracking'
    ]
  },
  {
    id: 'security',
    title: '🔒 Security & Audit',
    icon: '🔒',
    color: '#F44336',
    privileges: [
      'Audit Logs', 'Login History', 'Suspicious Activity',
      'IP Blocking', 'Security Settings', 'Session Management'
    ]
  },
  {
    id: 'communication',
    title: '📢 Communication',
    icon: '📢',
    color: '#E91E63',
    privileges: [
      'Broadcast Message', 'Targeted Broadcast',
      'User Notification', 'Email Templates',
      'SMS Templates', 'Announcements'
    ]
  },
  {
    id: 'data',
    title: '💾 Data Management',
    icon: '💾',
    color: '#795548',
    privileges: [
      'Export Users', 'Export Transactions', 'Export Analytics',
      'Database Backup', 'Restore Backup', 'Clear Cache'
    ]
  },
  {
    id: 'admin_mgmt',
    title: '👑 Admin Management',
    icon: '👑',
    color: '#FFD700',
    privileges: [
      'View Admins', 'Admin Privileges', 'Add Admin',
      'Remove Admin', 'Admin Activity Log'
    ]
  },
  {
    id: 'financial',
    title: '💰 Financial (View)',
    icon: '💰',
    color: '#8BC34A',
    privileges: [
      'Revenue Reports', 'Fee Collection', 'Earnings Overview',
      'Financial Dashboard', 'Daily Revenue'
    ]
  },
];

interface AdminDashboardProps {
  userEmail: string;
  onClose: () => void;
}

const ADMIN_EMAILS = ['mwolobijavanson@gmail.com', 'javansonwanjala@gmail.com'];


const AdminDashboard: React.FC<AdminDashboardProps> = ({ userEmail, onClose }) => {
  const [activeCategory, setActiveCategory] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    totalUsers: 1250, activeUsers: 890, totalRevenue: 45000,
    totalViewOnce: 340, totalPaidMedia: 120, pendingReports: 5,
    newUsersToday: 23, revenueToday: 2500,
  });

  useEffect(() => {
    if (!ADMIN_EMAILS.includes(userEmail)) {
      Alert.alert('Access Denied', 'Admin access required');
      onClose();
    }
  }, []);

  const getCategoryColor = (id: string) => {
    return ADMIN_CATEGORIES.find(c => c.id === id)?.color || '#6C63FF';
  };

  const currentCategory = ADMIN_CATEGORIES.find(c => c.id === activeCategory);

  const renderDashboard = () => (
    <View>
      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
          <Text style={styles.statValue}>{stats.totalUsers}</Text>
          <Text style={styles.statLabel}>Total Users</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#E8F5E9' }]}>
          <Text style={styles.statValue}>{stats.activeUsers}</Text>
          <Text style={styles.statLabel}>Active Users</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#FFF3E0' }]}>
          <Text style={styles.statValue}>KSH {stats.totalRevenue?.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Revenue</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#FCE4EC' }]}>
          <Text style={styles.statValue}>{stats.totalViewOnce}</Text>
          <Text style={styles.statLabel}>View Once</Text>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.detailCard}>
        <Text style={styles.detailTitle}>📊 Overview</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>New Today:</Text>
          <Text style={styles.detailValue}>{stats.newUsersToday}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Revenue Today:</Text>
          <Text style={styles.detailValue}>KSH {stats.revenueToday?.toLocaleString()}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Paid Media:</Text>
          <Text style={styles.detailValue}>{stats.totalPaidMedia}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Pending Reports:</Text>
          <Text style={[styles.detailValue, { color: '#F44336' }]}>{stats.pendingReports}</Text>
        </View>
      </View>
    </View>
  );

  const renderPrivileges = (category: typeof ADMIN_CATEGORIES[0]) => (
    <View>
      <Text style={styles.categoryTitle}>{category.title}</Text>
      <Text style={styles.categorySubtitle}>{category.privileges.length} privileges available</Text>
      
      <View style={styles.privilegesGrid}>
        {category.privileges.map((priv, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.privilegeCard, { borderLeftColor: category.color }]}
            onPress={() => Alert.alert(priv, `${priv} - Click to access this feature`)}
          >
            <View style={[styles.privilegeDot, { backgroundColor: category.color }]} />
            <Text style={styles.privilegeText}>{priv}</Text>
            <Text style={styles.privilegeArrow}>→</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#1A1A2E', '#16213E']} style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeBtn}>✕</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>🛡️ Admin Panel</Text>
          <Text style={styles.headerSubtitle}>{userEmail}</Text>
        </View>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>70 Privileges</Text>
        </View>
      </LinearGradient>

      {/* Categories Grid */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
        <View style={styles.categoriesRow}>
          {ADMIN_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryTab,
                activeCategory === cat.id && { backgroundColor: cat.color },
              ]}
              onPress={() => setActiveCategory(cat.id)}
            >
              <Text style={styles.categoryTabIcon}>{cat.icon}</Text>
              <Text style={[
                styles.categoryTabText,
                activeCategory === cat.id && styles.categoryTabTextActive
              ]}>
                {cat.title.split(' ')[1] || cat.title}
              </Text>
              <Text style={[
                styles.categoryTabCount,
                activeCategory === cat.id && styles.categoryTabCountActive
              ]}>
                {cat.privileges.length}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Content */}
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={() => {}} />}
      >
        {activeCategory === 'dashboard' ? renderDashboard() : 
         currentCategory ? renderPrivileges(currentCategory) : null}

        {/* Admin Policy Note */}
        <View style={styles.policyCard}>
          <Text style={styles.policyTitle}>📋 Admin Policy</Text>
          <Text style={styles.policyText}>
            • Withdrawals are processed automatically{'\n'}
            • Content moderation requires valid reason{'\n'}
            • All admin actions are logged for audit{'\n'}
            • Financial data is view-only (no withdrawal management)
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Admin Panel v{APP_INFO.version}</Text>
          <Text style={styles.footerText}>© 2026 Jans Tech</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  
  // Header
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    paddingTop: 50, padding: SPACING.md 
  },
  closeBtn: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
  headerCenter: { alignItems: 'center', flex: 1 },
  headerTitle: { color: '#FFF', fontSize: FONTS.sizes.lg, fontWeight: 'bold' },
  headerSubtitle: { color: 'rgba(255,255,255,0.6)', fontSize: 10, marginTop: 2 },
  headerBadge: { 
    backgroundColor: 'rgba(255,215,0,0.2)', paddingHorizontal: 10, 
    paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: '#FFD700' 
  },
  headerBadgeText: { color: '#FFD700', fontSize: 10, fontWeight: 'bold' },
  
  // Categories
  categoriesScroll: { maxHeight: 90, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  categoriesRow: { flexDirection: 'row', padding: SPACING.sm, gap: SPACING.xs },
  categoryTab: { 
    alignItems: 'center', padding: SPACING.sm, borderRadius: 12, 
    backgroundColor: '#F5F5F5', minWidth: 60 
  },
  categoryTabIcon: { fontSize: 20, marginBottom: 2 },
  categoryTabText: { fontSize: 9, color: COLORS.gray, fontWeight: '600', textAlign: 'center' },
  categoryTabTextActive: { color: '#FFF' },
  categoryTabCount: { 
    fontSize: 10, color: COLORS.gray, fontWeight: 'bold', 
    marginTop: 2, backgroundColor: '#E0E0E0', paddingHorizontal: 6, 
    paddingVertical: 1, borderRadius: 8 
  },
  categoryTabCountActive: { color: '#FFF', backgroundColor: 'rgba(255,255,255,0.3)' },
  
  scrollContent: { padding: SPACING.md, paddingBottom: SPACING.xxl },
  
  // Stats Grid
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.md },
  statCard: { 
    width: (width - SPACING.md * 2 - SPACING.sm) / 2, 
    padding: SPACING.md, borderRadius: 16, alignItems: 'center', ...SHADOWS.small 
  },
  statValue: { fontSize: FONTS.sizes.xl, fontWeight: 'bold', color: COLORS.dark },
  statLabel: { fontSize: FONTS.sizes.xs, color: COLORS.gray, marginTop: 4 },
  
  // Detail Card
  detailCard: { backgroundColor: '#FFF', borderRadius: 16, padding: SPACING.lg, marginBottom: SPACING.md, ...SHADOWS.small },
  detailTitle: { fontSize: FONTS.sizes.lg, fontWeight: 'bold', color: COLORS.dark, marginBottom: SPACING.md },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: SPACING.xs, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  detailLabel: { fontSize: FONTS.sizes.sm, color: COLORS.gray },
  detailValue: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.dark },
  
  // Category Title
  categoryTitle: { 
    fontSize: FONTS.sizes.xl, fontWeight: 'bold', color: COLORS.dark, 
    textAlign: 'center', marginBottom: 4 
  },
  categorySubtitle: { 
    fontSize: FONTS.sizes.xs, color: COLORS.gray, textAlign: 'center', marginBottom: SPACING.lg 
  },
  
  // Privileges Grid
  privilegesGrid: { gap: SPACING.sm },
  privilegeCard: { 
    backgroundColor: '#FFF', borderRadius: 12, padding: SPACING.md,
    flexDirection: 'row', alignItems: 'center', borderLeftWidth: 4,
    marginBottom: SPACING.xs, ...SHADOWS.small 
  },
  privilegeDot: { width: 10, height: 10, borderRadius: 5, marginRight: SPACING.sm },
  privilegeText: { flex: 1, fontSize: FONTS.sizes.sm, color: COLORS.dark, fontWeight: '500' },
  privilegeArrow: { fontSize: 16, color: COLORS.gray },
  
  // Policy
  policyCard: { 
    backgroundColor: '#E3F2FD', borderRadius: 12, padding: SPACING.md, 
    marginTop: SPACING.md, borderLeftWidth: 4, borderLeftColor: '#2196F3' 
  },
  policyTitle: { fontSize: FONTS.sizes.sm, fontWeight: 'bold', color: '#1565C0', marginBottom: 4 },
  policyText: { fontSize: FONTS.sizes.xs, color: '#1565C0', lineHeight: 18 },
  
  // Footer
  footer: { alignItems: 'center', padding: SPACING.lg, marginTop: SPACING.md },
  footerText: { fontSize: FONTS.sizes.xs, color: COLORS.gray, marginBottom: 2 },
});

export default AdminDashboard;

// Add Marquee Editor import at the top
import MarqueeEditor from '../components/MarqueeEditor';


// Add Marquee Editor to the Settings tab
// Find the settings section and add this item:
<TouchableOpacity 
  style={styles.privilegeCard} 
  onPress={() => setShowMarqueeEditor(true)}
>
  <View style={[styles.privilegeDot, { backgroundColor: '#FFD700' }]} />
  <Text style={styles.privilegeText}>✏️ Edit Marquee Text</Text>
  <Text style={styles.privilegeArrow}>→</Text>
</TouchableOpacity>
