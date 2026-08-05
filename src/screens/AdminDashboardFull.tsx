// screens/AdminDashboardFull.tsx - Full Admin Dashboard
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, FlatList, Alert, ActivityIndicator,
  RefreshControl, Dimensions, Modal, Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, SHADOWS } from '../constants/theme';

// This is a supplementary file - add these sections to the existing AdminDashboard

// ============================================
// REPORTS TAB
// ============================================
const ReportsTab = () => (
  <View>
    <View style={styles.filterRow}>
      <TouchableOpacity style={[styles.filterBtn, styles.filterActive]}>
        <Text style={styles.filterText}>Pending</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.filterBtn}>
        <Text style={styles.filterText}>Resolved</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.filterBtn}>
        <Text style={styles.filterText}>All</Text>
      </TouchableOpacity>
    </View>
    
    {reports.map((report) => (
      <View key={report.id} style={styles.reportCard}>
        <View style={styles.reportHeader}>
          <View style={[styles.reportType, { 
            backgroundColor: report.type === 'user' ? '#FFEBEE' : 
                           report.type === 'content' ? '#FFF3E0' : '#E3F2FD'
          }]}>
            <Text style={styles.reportTypeText}>{report.type}</Text>
          </View>
          <Text style={[styles.reportStatus, {
            color: report.status === 'pending' ? '#FF9800' : '#4CAF50'
          }]}>
            {report.status}
          </Text>
        </View>
        <Text style={styles.reportReason}>{report.reason}</Text>
        <View style={styles.reportFooter}>
          <Text style={styles.reportBy}>By: {report.reportedBy}</Text>
          <Text style={styles.reportDate}>{report.createdAt}</Text>
        </View>
        {report.status === 'pending' && (
          <View style={styles.reportActions}>
            <TouchableOpacity 
              style={styles.resolveBtn}
              onPress={() => resolveReport(report.id, 'resolve')}
            >
              <Text style={styles.resolveText}>✅ Resolve</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.dismissBtn}
              onPress={() => resolveReport(report.id, 'dismiss')}
            >
              <Text style={styles.dismissText}>❌ Dismiss</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    ))}
  </View>
);

// ============================================
// ANALYTICS TAB
// ============================================
const AnalyticsTab = () => (
  <View>
    {/* Revenue Breakdown */}
    <View style={styles.analyticsCard}>
      <Text style={styles.analyticsTitle}>💰 Revenue Breakdown</Text>
      <View style={styles.breakdownBar}>
        <View style={[styles.breakdownSegment, { flex: 4, backgroundColor: '#6C63FF' }]} />
        <View style={[styles.breakdownSegment, { flex: 3, backgroundColor: '#FF6584' }]} />
        <View style={[styles.breakdownSegment, { flex: 2, backgroundColor: '#4CAF50' }]} />
        <View style={[styles.breakdownSegment, { flex: 1, backgroundColor: '#FF9800' }]} />
      </View>
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#6C63FF' }]} />
          <Text style={styles.legendText}>View Once</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#FF6584' }]} />
          <Text style={styles.legendText}>Paid Media</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
          <Text style={styles.legendText}>Signups</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#FF9800' }]} />
          <Text style={styles.legendText}>Referrals</Text>
        </View>
      </View>
    </View>

    {/* User Growth */}
    <View style={styles.analyticsCard}>
      <Text style={styles.analyticsTitle}>📈 User Growth</Text>
      <View style={styles.growthStats}>
        <View style={styles.growthStat}>
          <Text style={styles.growthValue}>+15%</Text>
          <Text style={styles.growthLabel}>This Week</Text>
        </View>
        <View style={styles.growthStat}>
          <Text style={styles.growthValue}>+45%</Text>
          <Text style={styles.growthLabel}>This Month</Text>
        </View>
        <View style={styles.growthStat}>
          <Text style={styles.growthValue}>+120%</Text>
          <Text style={styles.growthLabel}>This Year</Text>
        </View>
      </View>
    </View>

    {/* Content Stats */}
    <View style={styles.analyticsCard}>
      <Text style={styles.analyticsTitle}>📊 Content Stats</Text>
      <View style={styles.statGrid}>
        <View style={styles.miniStat}>
          <Text style={styles.miniStatValue}>1,234</Text>
          <Text style={styles.miniStatLabel}>View Once Sent</Text>
        </View>
        <View style={styles.miniStat}>
          <Text style={styles.miniStatValue}>892</Text>
          <Text style={styles.miniStatLabel}>Viewed</Text>
        </View>
        <View style={styles.miniStat}>
          <Text style={styles.miniStatValue}>KSH 45</Text>
          <Text style={styles.miniStatLabel}>Avg Price</Text>
        </View>
        <View style={styles.miniStat}>
          <Text style={styles.miniStatValue}>72%</Text>
          <Text style={styles.miniStatLabel}>View Rate</Text>
        </View>
      </View>
    </View>
  </View>
);

// ============================================
// SYSTEM TAB
// ============================================
const SystemTab = () => (
  <View>
    {/* System Health */}
    <View style={styles.healthCard}>
      <Text style={styles.healthTitle}>🫀 System Health</Text>
      <View style={styles.healthGrid}>
        <View style={styles.healthItem}>
          <View style={[styles.healthDot, { backgroundColor: '#4CAF50' }]} />
          <View>
            <Text style={styles.healthLabel}>API Status</Text>
            <Text style={styles.healthValue}>Healthy</Text>
          </View>
        </View>
        <View style={styles.healthItem}>
          <Text style={styles.healthIcon}>🗄️</Text>
          <View>
            <Text style={styles.healthLabel}>Database</Text>
            <Text style={styles.healthValue}>45.2 MB</Text>
          </View>
        </View>
        <View style={styles.healthItem}>
          <Text style={styles.healthIcon}>⏱️</Text>
          <View>
            <Text style={styles.healthLabel}>Uptime</Text>
            <Text style={styles.healthValue}>15d 12h</Text>
          </View>
        </View>
        <View style={styles.healthItem}>
          <Text style={styles.healthIcon}>🔗</Text>
          <View>
            <Text style={styles.healthLabel}>Connections</Text>
            <Text style={styles.healthValue}>23 active</Text>
          </View>
        </View>
      </View>
    </View>

    {/* Audit Logs */}
    <View style={styles.auditCard}>
      <Text style={styles.auditTitle}>📝 Audit Logs</Text>
      {auditLogs.slice(0, 10).map((log) => (
        <View key={log.id} style={styles.auditItem}>
          <View style={styles.auditIcon}>
            <Text>{log.action === 'login' ? '🔑' : log.action === 'delete' ? '🗑️' : '📝'}</Text>
          </View>
          <View style={styles.auditInfo}>
            <Text style={styles.auditAction}>{log.action}</Text>
            <Text style={styles.auditDetail}>{log.details}</Text>
          </View>
          <Text style={styles.auditTime}>{log.timestamp}</Text>
        </View>
      ))}
    </View>

    {/* Backups */}
    <View style={styles.backupCard}>
      <Text style={styles.backupTitle}>💾 Backups</Text>
      <TouchableOpacity 
        style={styles.backupBtn}
        onPress={() => createBackup('full')}
      >
        <Text style={styles.backupBtnText}>+ Create Full Backup</Text>
      </TouchableOpacity>
      
      {backups.map((backup) => (
        <View key={backup.id} style={styles.backupItem}>
          <View>
            <Text style={styles.backupName}>{backup.filename}</Text>
            <Text style={styles.backupInfo}>{backup.size} • {backup.type}</Text>
          </View>
          <View style={styles.backupActions}>
            <Text style={[styles.backupStatus, {
              color: backup.status === 'completed' ? '#4CAF50' : '#FF9800'
            }]}>
              {backup.status}
            </Text>
            <TouchableOpacity onPress={() => restoreBackup(backup.id)}>
              <Text style={styles.restoreBtn}>🔄 Restore</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>

    {/* Export Data */}
    <View style={styles.exportCard}>
      <Text style={styles.exportTitle}>📥 Export Data</Text>
      <View style={styles.exportRow}>
        <TouchableOpacity 
          style={styles.exportBtn}
          onPress={() => exportUserData('csv')}
        >
          <Text style={styles.exportIcon}>📊</Text>
          <Text style={styles.exportText}>CSV</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.exportBtn}
          onPress={() => exportUserData('json')}
        >
          <Text style={styles.exportIcon}>📋</Text>
          <Text style={styles.exportText}>JSON</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.exportBtn}
          onPress={() => exportUserData('pdf')}
        >
          <Text style={styles.exportIcon}>📄</Text>
          <Text style={styles.exportText}>PDF</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

// ============================================
// ENHANCED SETTINGS TAB
// ============================================
const EnhancedSettingsTab = () => (
  <View>
    {/* Platform Settings */}
    <View style={styles.settingsSection}>
      <Text style={styles.settingsSectionTitle}>⚙️ Platform Configuration</Text>
      
      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingName}>View Once Commission</Text>
          <Text style={styles.settingDesc}>Platform fee percentage</Text>
        </View>
        <TextInput 
          style={styles.settingInput}
          value="10"
          keyboardType="number-pad"
          editable={false}
        />
        <Text style={styles.settingUnit}>%</Text>
      </View>

      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingName}>Paid Media Commission</Text>
        </View>
        <TextInput 
          style={styles.settingInput}
          value="15"
          editable={false}
        />
        <Text style={styles.settingUnit}>%</Text>
      </View>

      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingName}>Withdrawal Fee</Text>
        </View>
        <TextInput 
          style={styles.settingInput}
          value="2"
          editable={false}
        />
        <Text style={styles.settingUnit}>%</Text>
      </View>

      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingName}>Min Withdrawal</Text>
        </View>
        <TextInput 
          style={styles.settingInput}
          value="50"
          editable={false}
        />
        <Text style={styles.settingUnit}>KSH</Text>
      </View>

      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingName}>Maintenance Mode</Text>
          <Text style={styles.settingDesc}>Disable app for maintenance</Text>
        </View>
        <Switch
          value={false}
          trackColor={{ false: '#E0E0E0', true: '#F44336' }}
        />
      </View>
    </View>

    {/* Admin Users */}
    <View style={styles.settingsSection}>
      <Text style={styles.settingsSectionTitle}>👑 Admin Users</Text>
      <View style={styles.adminUserItem}>
        <View style={styles.adminAvatar}>
          <Text style={styles.adminAvatarText}>M</Text>
        </View>
        <View>
          <Text style={styles.adminName}>Mwolobi Javanson</Text>
          <Text style={styles.adminEmail}>mwolobijavanson@gmail.com</Text>
        </View>
        <Text style={styles.superAdmin}>👑</Text>
      </View>
      <View style={styles.adminUserItem}>
        <View style={[styles.adminAvatar, { backgroundColor: '#FF6584' }]}>
          <Text style={styles.adminAvatarText}>J</Text>
        </View>
        <View>
          <Text style={styles.adminName}>Javanson Wanjala</Text>
          <Text style={styles.adminEmail}>javansonwanjala@gmail.com</Text>
        </View>
        <Text style={styles.superAdmin}>👑</Text>
      </View>
    </View>

    {/* Danger Zone */}
    <View style={styles.dangerZone}>
      <Text style={styles.dangerTitle}>🚨 Danger Zone</Text>
      <TouchableOpacity 
        style={styles.dangerBtn}
        onPress={() => {
          Alert.alert(
            '⚠️ Reset All Data',
            'This will permanently delete all data. This cannot be undone!',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Reset', style: 'destructive', onPress: () => {} },
            ]
          );
        }}
      >
        <Text style={styles.dangerBtnText}>🗑️ Reset All Data</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.dangerBtn, { backgroundColor: '#FFF3E0', borderColor: '#FF9800' }]}
        onPress={() => {}}
      >
        <Text style={[styles.dangerBtnText, { color: '#FF9800' }]}>🔒 Lock All Accounts</Text>
      </TouchableOpacity>
    </View>
  </View>
);

// Add styles for new components
const additionalStyles = StyleSheet.create({
  // Reports
  filterRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  filterBtn: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: 15, backgroundColor: '#F5F5F5' },
  filterActive: { backgroundColor: COLORS.primary },
  filterText: { fontSize: FONTS.sizes.xs, color: COLORS.gray },
  reportCard: { backgroundColor: '#FFF', borderRadius: 12, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOWS.small },
  reportHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.sm },
  reportType: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  reportTypeText: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  reportStatus: { fontSize: FONTS.sizes.xs, fontWeight: 'bold', textTransform: 'uppercase' },
  reportReason: { fontSize: FONTS.sizes.sm, color: COLORS.dark, marginBottom: SPACING.sm },
  reportFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  reportBy: { fontSize: FONTS.sizes.xs, color: COLORS.gray },
  reportDate: { fontSize: 10, color: COLORS.gray },
  reportActions: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.sm },
  resolveBtn: { flex: 1, backgroundColor: '#E8F5E9', padding: SPACING.sm, borderRadius: 8, alignItems: 'center' },
  resolveText: { color: '#4CAF50', fontWeight: '600', fontSize: FONTS.sizes.xs },
  dismissBtn: { flex: 1, backgroundColor: '#FFEBEE', padding: SPACING.sm, borderRadius: 8, alignItems: 'center' },
  dismissText: { color: '#F44336', fontWeight: '600', fontSize: FONTS.sizes.xs },
  
  // Analytics
  analyticsCard: { backgroundColor: '#FFF', borderRadius: 16, padding: SPACING.lg, marginBottom: SPACING.md, ...SHADOWS.small },
  analyticsTitle: { fontSize: FONTS.sizes.md, fontWeight: 'bold', color: COLORS.dark, marginBottom: SPACING.md },
  breakdownBar: { flexDirection: 'row', height: 24, borderRadius: 12, overflow: 'hidden', marginBottom: SPACING.md },
  breakdownSegment: { height: '100%' },
  legendRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: FONTS.sizes.xs, color: COLORS.gray },
  growthStats: { flexDirection: 'row', justifyContent: 'space-around' },
  growthStat: { alignItems: 'center' },
  growthValue: { fontSize: FONTS.sizes.xxl, fontWeight: 'bold', color: '#4CAF50' },
  growthLabel: { fontSize: FONTS.sizes.xs, color: COLORS.gray },
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  miniStat: { width: '47%', backgroundColor: '#F8F9FA', padding: SPACING.md, borderRadius: 10 },
  miniStatValue: { fontSize: FONTS.sizes.lg, fontWeight: 'bold', color: COLORS.dark },
  miniStatLabel: { fontSize: FONTS.sizes.xs, color: COLORS.gray },
  
  // System Health
  healthCard: { backgroundColor: '#FFF', borderRadius: 16, padding: SPACING.lg, marginBottom: SPACING.md, ...SHADOWS.small },
  healthTitle: { fontSize: FONTS.sizes.md, fontWeight: 'bold', color: COLORS.dark, marginBottom: SPACING.md },
  healthGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md },
  healthItem: { width: '47%', flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: '#F8F9FA', padding: SPACING.sm, borderRadius: 10 },
  healthDot: { width: 12, height: 12, borderRadius: 6 },
  healthIcon: { fontSize: 20 },
  healthLabel: { fontSize: FONTS.sizes.xs, color: COLORS.gray },
  healthValue: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.dark },
  
  // Audit
  auditCard: { backgroundColor: '#FFF', borderRadius: 16, padding: SPACING.lg, marginBottom: SPACING.md, ...SHADOWS.small },
  auditTitle: { fontSize: FONTS.sizes.md, fontWeight: 'bold', color: COLORS.dark, marginBottom: SPACING.md },
  auditItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.xs, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  auditIcon: { width: 30, alignItems: 'center' },
  auditInfo: { flex: 1 },
  auditAction: { fontSize: FONTS.sizes.sm, fontWeight: '600' },
  auditDetail: { fontSize: FONTS.sizes.xs, color: COLORS.gray },
  auditTime: { fontSize: 10, color: COLORS.gray },
  
  // Backups
  backupCard: { backgroundColor: '#FFF', borderRadius: 16, padding: SPACING.lg, marginBottom: SPACING.md, ...SHADOWS.small },
  backupTitle: { fontSize: FONTS.sizes.md, fontWeight: 'bold', color: COLORS.dark, marginBottom: SPACING.md },
  backupBtn: { backgroundColor: '#E3F2FD', padding: SPACING.md, borderRadius: 10, alignItems: 'center', marginBottom: SPACING.md },
  backupBtnText: { color: '#1565C0', fontWeight: '600' },
  backupItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.sm },
  backupName: { fontSize: FONTS.sizes.sm, fontWeight: '600' },
  backupInfo: { fontSize: FONTS.sizes.xs, color: COLORS.gray },
  backupActions: { alignItems: 'flex-end' },
  backupStatus: { fontSize: FONTS.sizes.xs, fontWeight: 'bold' },
  restoreBtn: { fontSize: FONTS.sizes.xs, color: COLORS.primary, marginTop: 2 },
  
  // Export
  exportCard: { backgroundColor: '#FFF', borderRadius: 16, padding: SPACING.lg, marginBottom: SPACING.md, ...SHADOWS.small },
  exportTitle: { fontSize: FONTS.sizes.md, fontWeight: 'bold', color: COLORS.dark, marginBottom: SPACING.md },
  exportRow: { flexDirection: 'row', gap: SPACING.sm },
  exportBtn: { flex: 1, alignItems: 'center', padding: SPACING.md, backgroundColor: '#F5F5F5', borderRadius: 10 },
  exportIcon: { fontSize: 24, marginBottom: 4 },
  exportText: { fontSize: FONTS.sizes.xs, fontWeight: '600' },
  
  // Enhanced Settings
  settingsSection: { backgroundColor: '#FFF', borderRadius: 16, padding: SPACING.lg, marginBottom: SPACING.md, ...SHADOWS.small },
  settingsSectionTitle: { fontSize: FONTS.sizes.md, fontWeight: 'bold', color: COLORS.dark, marginBottom: SPACING.md },
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  settingInfo: { flex: 1 },
  settingName: { fontSize: FONTS.sizes.sm, fontWeight: '600' },
  settingDesc: { fontSize: FONTS.sizes.xs, color: COLORS.gray },
  settingInput: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 6, padding: SPACING.xs, width: 50, textAlign: 'center', fontSize: FONTS.sizes.sm },
  settingUnit: { fontSize: FONTS.sizes.sm, color: COLORS.gray, marginLeft: 4 },
  
  adminUserItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.sm },
  adminAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.sm },
  adminAvatarText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  adminName: { fontSize: FONTS.sizes.sm, fontWeight: '600' },
  adminEmail: { fontSize: FONTS.sizes.xs, color: COLORS.gray },
  superAdmin: { fontSize: 20, marginLeft: 'auto' },
  
  // Danger Zone
  dangerZone: { backgroundColor: '#FFF', borderRadius: 16, padding: SPACING.lg, marginBottom: SPACING.md, ...SHADOWS.small, borderWidth: 1, borderColor: '#F44336' },
  dangerTitle: { fontSize: FONTS.sizes.md, fontWeight: 'bold', color: '#F44336', marginBottom: SPACING.md },
  dangerBtn: { backgroundColor: '#FFEBEE', padding: SPACING.md, borderRadius: 10, alignItems: 'center', marginBottom: SPACING.sm, borderWidth: 1, borderColor: '#F44336' },
  dangerBtnText: { color: '#F44336', fontWeight: 'bold', fontSize: FONTS.sizes.sm },
});

export { ReportsTab, AnalyticsTab, SystemTab, EnhancedSettingsTab };
