
// screens/WalletScreen.tsx - Wallet screen with earnings, withdrawal, referral
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, FlatList, Alert, ActivityIndicator, RefreshControl,
  Dimensions, Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, SHADOWS } from '../constants/theme';
import { 
  WalletInfo, Transaction, WithdrawalRequest, ReferralInfo,
  SHARING_OPTIONS, MIN_WITHDRAWAL, MAX_WITHDRAWAL, WITHDRAWAL_FEE_PERCENT 
} from '../types/wallet';
import {
  getWalletInfo, getTransactions, requestWithdrawal,
  getWithdrawalHistory, getReferralInfo, shareReferral,
  copyReferralCode,
} from '../services/walletService';
import Button from '../components/Button';
import { useToast } from '../../App';

const { width } = Dimensions.get('window');

interface WalletScreenProps {
  userId: number;
  onClose: () => void;
}

const WalletScreen: React.FC<WalletScreenProps> = ({ userId, onClose }) => {
  const { showToast } = useToast();
  
  // State
  const [activeTab, setActiveTab] = useState<'wallet' | 'transactions' | 'referral'>('wallet');
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [referralInfo, setReferralInfo] = useState<ReferralInfo | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Withdrawal form
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [mpesaNumber, setMpesaNumber] = useState('');
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    const [info, txns, withdraws, refInfo] = await Promise.all([
      getWalletInfo(userId),
      getTransactions(userId),
      getWithdrawalHistory(userId),
      getReferralInfo(userId),
    ]);
    setWalletInfo(info);
    setTransactions(txns);
    setWithdrawals(withdraws);
    setReferralInfo(refInfo);
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAllData();
    setRefreshing(false);
  };

  // Handle withdrawal
  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    const cleaned = mpesaNumber.replace(/\D/g, '');

    if (isNaN(amount) || amount < MIN_WITHDRAWAL) {
      showToast(`Minimum withdrawal is KSH ${MIN_WITHDRAWAL}`);
      return;
    }
    if (amount > MAX_WITHDRAWAL) {
      showToast(`Maximum withdrawal is KSH ${MAX_WITHDRAWAL}`);
      return;
    }
    if (cleaned.length !== 10) {
      showToast('Enter valid M-Pesa number');
      return;
    }
    if (walletInfo && amount > walletInfo.balance) {
      showToast('Insufficient balance');
      return;
    }

    setWithdrawing(true);
    const result = await requestWithdrawal(userId, amount, cleaned);
    
    if (result.success) {
      showToast('✅ Withdrawal request sent!');
      setShowWithdraw(false);
      setWithdrawAmount('');
      setMpesaNumber('');
      loadAllData();
    } else {
      showToast(result.message || 'Withdrawal failed');
    }
    setWithdrawing(false);
  };

  // Share referral
  const handleShareReferral = (platform: 'whatsapp' | 'sms' | 'email' | 'telegram') => {
    if (referralInfo) {
      shareReferral(referralInfo.referralCode, platform);
    }
  };

  const formatCurrency = (amount: number): string => {
    return `KSH ${amount?.toLocaleString() || '0'}`;
  };

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('en-KE', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const getTransactionIcon = (type: string): string => {
    switch (type) {
      case 'earning': return '💰';
      case 'withdrawal': return '🏦';
      case 'referral': return '🎁';
      case 'view_once': return '💎';
      case 'paid_media': return '📸';
      case 'signup_bonus': return '🎉';
      default: return '💳';
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'failed': return '#F44336';
      default: return '#999';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading wallet...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>💰 My Wallet</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabs}>
        {['wallet', 'transactions', 'referral'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab as any)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab === 'wallet' ? '💰 Wallet' : tab === 'transactions' ? '📋 History' : '🎁 Referral'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* ============================================ */}
        {/* WALLET TAB */}
        {/* ============================================ */}
        {activeTab === 'wallet' && walletInfo && (
          <>
            {/* Balance Card */}
            <LinearGradient colors={['#6C63FF', '#4A45B0']} style={styles.balanceCard}>
              <Text style={styles.balanceLabel}>Available Balance</Text>
              <Text style={styles.balanceAmount}>{formatCurrency(walletInfo.balance)}</Text>
              <View style={styles.balanceRow}>
                <View style={styles.balanceItem}>
                  <Text style={styles.balanceItemLabel}>Total Earned</Text>
                  <Text style={styles.balanceItemValue}>{formatCurrency(walletInfo.totalEarned)}</Text>
                </View>
                <View style={styles.balanceDivider} />
                <View style={styles.balanceItem}>
                  <Text style={styles.balanceItemLabel}>Withdrawn</Text>
                  <Text style={styles.balanceItemValue}>{formatCurrency(walletInfo.totalWithdrawn)}</Text>
                </View>
              </View>
            </LinearGradient>

            {/* Quick Stats */}
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statIcon}>💎</Text>
                <Text style={styles.statValue}>{formatCurrency(walletInfo.pendingBalance)}</Text>
                <Text style={styles.statLabel}>Pending</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statIcon}>🎁</Text>
                <Text style={styles.statValue}>{referralInfo?.totalReferrals || 0}</Text>
                <Text style={styles.statLabel}>Referrals</Text>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actionsCard}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => setShowWithdraw(!showWithdraw)}
              >
                <Text style={styles.actionIcon}>🏦</Text>
                <Text style={styles.actionText}>Withdraw</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => setActiveTab('transactions')}
              >
                <Text style={styles.actionIcon}>📋</Text>
                <Text style={styles.actionText}>History</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => setActiveTab('referral')}
              >
                <Text style={styles.actionIcon}>🎁</Text>
                <Text style={styles.actionText}>Refer</Text>
              </TouchableOpacity>
            </View>

            {/* Withdrawal Form */}
            {showWithdraw && (
              <View style={styles.withdrawCard}>
                <Text style={styles.withdrawTitle}>Withdraw Funds</Text>
                
                <Text style={styles.inputLabel}>Amount (KSH)</Text>
                <View style={styles.amountInputRow}>
                  <Text style={styles.currencyPrefix}>KSH</Text>
                  <TextInput
                    style={styles.amountInput}
                    value={withdrawAmount}
                    onChangeText={(t) => setWithdrawAmount(t.replace(/[^0-9]/g, ''))}
                    placeholder="0"
                    placeholderTextColor="#999"
                    keyboardType="number-pad"
                    maxLength={6}
                  />
                </View>
                <Text style={styles.inputHint}>
                  Min: {formatCurrency(MIN_WITHDRAWAL)} • Max: {formatCurrency(MAX_WITHDRAWAL)}
                </Text>

                <Text style={styles.inputLabel}>M-Pesa Number</Text>
                <TextInput
                  style={styles.mpesaInput}
                  value={mpesaNumber}
                  onChangeText={(t) => setMpesaNumber(t.replace(/\D/g, '').slice(0, 10))}
                  placeholder="0712345678"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                  maxLength={10}
                />

                {/* Fee breakdown */}
                {withdrawAmount && !isNaN(parseFloat(withdrawAmount)) && (
                  <View style={styles.feeBreakdown}>
                    <View style={styles.feeRow}>
                      <Text style={styles.feeLabel}>Amount:</Text>
                      <Text style={styles.feeValue}>{formatCurrency(parseFloat(withdrawAmount))}</Text>
                    </View>
                    <View style={styles.feeRow}>
                      <Text style={styles.feeLabel}>Fee ({WITHDRAWAL_FEE_PERCENT}%):</Text>
                      <Text style={styles.feeValue}>
                        {formatCurrency(parseFloat(withdrawAmount) * WITHDRAWAL_FEE_PERCENT / 100)}
                      </Text>
                    </View>
                    <View style={styles.feeDivider} />
                    <View style={styles.feeRow}>
                      <Text style={styles.feeLabelBold}>You'll receive:</Text>
                      <Text style={styles.feeValueBold}>
                        {formatCurrency(parseFloat(withdrawAmount) * (100 - WITHDRAWAL_FEE_PERCENT) / 100)}
                      </Text>
                    </View>
                  </View>
                )}

                <Button
                  title="Request Withdrawal"
                  icon="🏦"
                  onPress={handleWithdraw}
                  loading={withdrawing}
                  variant="success"
                  disabled={!withdrawAmount || !mpesaNumber}
                />
                <Button
                  title="Cancel"
                  onPress={() => setShowWithdraw(false)}
                  variant="outline"
                />
              </View>
            )}

            {/* Recent Withdrawals */}
            {withdrawals.length > 0 && (
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Recent Withdrawals</Text>
                {withdrawals.slice(0, 5).map((w) => (
                  <View key={w.id} style={styles.withdrawItem}>
                    <View>
                      <Text style={styles.withdrawAmount}>
                        {formatCurrency(w.amount)}
                      </Text>
                      <Text style={styles.withdrawPhone}>M-Pesa: {w.mpesaNumber}</Text>
                    </View>
                    <View style={styles.withdrawRight}>
                      <Text style={[styles.withdrawStatus, { color: getStatusColor(w.status) }]}>
                        {w.status}
                      </Text>
                      <Text style={styles.withdrawDate}>{formatDate(w.requestedAt)}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </>
        )}

        {/* ============================================ */}
        {/* TRANSACTIONS TAB */}
        {/* ============================================ */}
        {activeTab === 'transactions' && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Transaction History</Text>
            {transactions.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>📭</Text>
                <Text style={styles.emptyText}>No transactions yet</Text>
              </View>
            ) : (
              transactions.map((txn) => (
                <View key={txn.id} style={styles.txnItem}>
                  <Text style={styles.txnIcon}>{getTransactionIcon(txn.type)}</Text>
                  <View style={styles.txnInfo}>
                    <Text style={styles.txnDesc}>{txn.description}</Text>
                    <Text style={styles.txnDate}>{formatDate(txn.createdAt)}</Text>
                  </View>
                  <View style={styles.txnRight}>
                    <Text style={[
                      styles.txnAmount,
                      { color: txn.type === 'withdrawal' ? '#F44336' : '#4CAF50' }
                    ]}>
                      {txn.type === 'withdrawal' ? '-' : '+'}{formatCurrency(txn.amount)}
                    </Text>
                    <Text style={[styles.txnStatus, { color: getStatusColor(txn.status) }]}>
                      {txn.status}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* ============================================ */}
        {/* REFERRAL TAB */}
        {/* ============================================ */}
        {activeTab === 'referral' && referralInfo && (
          <>
            {/* Referral Stats */}
            <LinearGradient colors={['#4CAF50', '#2E7D32']} style={styles.referralCard}>
              <Text style={styles.referralIcon}>🎁</Text>
              <Text style={styles.referralTitle}>Refer & Earn</Text>
              <Text style={styles.referralSubtitle}>
                Earn KSH 20 for every friend who signs up!
              </Text>
              <View style={styles.referralStats}>
                <View style={styles.refStat}>
                  <Text style={styles.refStatValue}>{referralInfo.totalReferrals}</Text>
                  <Text style={styles.refStatLabel}>Referrals</Text>
                </View>
                <View style={styles.refStat}>
                  <Text style={styles.refStatValue}>{formatCurrency(referralInfo.totalEarnings)}</Text>
                  <Text style={styles.refStatLabel}>Earned</Text>
                </View>
              </View>
            </LinearGradient>

            {/* Referral Code */}
            <View style={styles.codeCard}>
              <Text style={styles.codeLabel}>Your Referral Code</Text>
              <Text style={styles.codeValue}>{referralInfo.referralCode}</Text>
              <TouchableOpacity
                style={styles.copyBtn}
                onPress={() => {
                  copyReferralCode(referralInfo.referralCode);
                  showToast('✅ Code copied!');
                }}
              >
                <Text style={styles.copyBtnText}>📋 Copy Code</Text>
              </TouchableOpacity>
            </View>

            {/* Share Options */}
            <View style={styles.shareCard}>
              <Text style={styles.shareTitle}>Share via:</Text>
              <View style={styles.shareGrid}>
                {SHARING_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[styles.shareBtn, { backgroundColor: option.color + '15' }]}
                    onPress={() => {
                      handleShareReferral(option.platform);
                      showToast(`Sharing via ${option.name}...`);
                    }}
                  >
                    <Text style={styles.shareIcon}>{option.icon}</Text>
                    <Text style={[styles.shareText, { color: option.color }]}>
                      {option.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Recent Referrals */}
            {referralInfo.recentReferrals.length > 0 && (
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Recent Referrals</Text>
                {referralInfo.recentReferrals.map((ref) => (
                  <View key={ref.id} style={styles.refItem}>
                    <View style={styles.refAvatar}>
                      <Text style={styles.refAvatarText}>{ref.name.charAt(0)}</Text>
                    </View>
                    <View style={styles.refInfo}>
                      <Text style={styles.refName}>{ref.name}</Text>
                      <Text style={styles.refDate}>Joined {formatDate(ref.joinedAt)}</Text>
                    </View>
                    <Text style={[styles.refEarnings, { color: ref.status === 'active' ? '#4CAF50' : '#FF9800' }]}>
                      +{formatCurrency(ref.earnings)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: COLORS.gray, marginTop: SPACING.md },
  
  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, padding: SPACING.md },
  closeBtn: { padding: SPACING.xs },
  closeText: { color: '#FFF', fontSize: 22 },
  headerTitle: { color: '#FFF', fontSize: FONTS.sizes.lg, fontWeight: 'bold' },
  
  // Tabs
  tabs: { flexDirection: 'row', backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  tab: { flex: 1, paddingVertical: SPACING.md, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: COLORS.primary },
  tabText: { fontSize: FONTS.sizes.sm, color: COLORS.gray, fontWeight: '600' },
  activeTabText: { color: COLORS.primary },
  
  scrollContent: { padding: SPACING.md, paddingBottom: SPACING.xxl },
  
  // Balance Card
  balanceCard: { borderRadius: 20, padding: SPACING.xl, marginBottom: SPACING.md, ...SHADOWS.large },
  balanceLabel: { color: 'rgba(255,255,255,0.7)', fontSize: FONTS.sizes.sm },
  balanceAmount: { color: '#FFF', fontSize: FONTS.sizes.hero, fontWeight: 'bold', marginVertical: SPACING.sm },
  balanceRow: { flexDirection: 'row', marginTop: SPACING.md },
  balanceItem: { flex: 1 },
  balanceItemLabel: { color: 'rgba(255,255,255,0.7)', fontSize: FONTS.sizes.xs },
  balanceItemValue: { color: '#FFF', fontSize: FONTS.sizes.md, fontWeight: 'bold', marginTop: 4 },
  balanceDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginHorizontal: SPACING.md },
  
  // Stats
  statsRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  statCard: { flex: 1, backgroundColor: '#FFF', borderRadius: 16, padding: SPACING.md, alignItems: 'center', ...SHADOWS.small },
  statIcon: { fontSize: 24, marginBottom: 4 },
  statValue: { fontSize: FONTS.sizes.md, fontWeight: 'bold', color: COLORS.dark },
  statLabel: { fontSize: FONTS.sizes.xs, color: COLORS.gray },
  
  // Actions
  actionsCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 16, padding: SPACING.md, marginBottom: SPACING.md, ...SHADOWS.small },
  actionBtn: { flex: 1, alignItems: 'center', padding: SPACING.sm },
  actionIcon: { fontSize: 24, marginBottom: 4 },
  actionText: { fontSize: FONTS.sizes.xs, color: COLORS.dark, fontWeight: '600' },
  
  // Withdraw
  withdrawCard: { backgroundColor: '#FFF', borderRadius: 16, padding: SPACING.lg, marginBottom: SPACING.md, ...SHADOWS.medium },
  withdrawTitle: { fontSize: FONTS.sizes.lg, fontWeight: 'bold', color: COLORS.dark, marginBottom: SPACING.md },
  inputLabel: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.darkGray, marginBottom: 4, marginTop: SPACING.sm },
  amountInputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: COLORS.primary, borderRadius: 12, overflow: 'hidden' },
  currencyPrefix: { backgroundColor: COLORS.primary, color: '#FFF', fontWeight: 'bold', padding: SPACING.md, fontSize: FONTS.sizes.md },
  amountInput: { flex: 1, fontSize: FONTS.sizes.xxl, fontWeight: 'bold', textAlign: 'center', padding: SPACING.sm },
  inputHint: { fontSize: FONTS.sizes.xs, color: COLORS.gray, marginTop: 4, textAlign: 'center' },
  mpesaInput: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 12, padding: SPACING.md, fontSize: FONTS.sizes.md, marginTop: 4 },
  
  // Fee
  feeBreakdown: { backgroundColor: '#F8F9FA', padding: SPACING.md, borderRadius: 10, marginTop: SPACING.md },
  feeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  feeLabel: { fontSize: FONTS.sizes.sm, color: COLORS.gray },
  feeValue: { fontSize: FONTS.sizes.sm, color: COLORS.dark },
  feeDivider: { height: 1, backgroundColor: '#E0E0E0', marginVertical: SPACING.sm },
  feeLabelBold: { fontSize: FONTS.sizes.sm, fontWeight: 'bold', color: COLORS.dark },
  feeValueBold: { fontSize: FONTS.sizes.sm, fontWeight: 'bold', color: '#4CAF50' },
  
  // Section
  sectionCard: { backgroundColor: '#FFF', borderRadius: 16, padding: SPACING.lg, marginBottom: SPACING.md, ...SHADOWS.small },
  sectionTitle: { fontSize: FONTS.sizes.lg, fontWeight: 'bold', color: COLORS.dark, marginBottom: SPACING.md },
  
  // Withdrawals
  withdrawItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  withdrawAmount: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.dark },
  withdrawPhone: { fontSize: FONTS.sizes.xs, color: COLORS.gray },
  withdrawRight: { alignItems: 'flex-end' },
  withdrawStatus: { fontSize: FONTS.sizes.xs, fontWeight: 'bold', textTransform: 'uppercase' },
  withdrawDate: { fontSize: 10, color: COLORS.gray },
  
  // Transactions
  txnItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  txnIcon: { fontSize: 24, marginRight: SPACING.sm, width: 40, textAlign: 'center' },
  txnInfo: { flex: 1 },
  txnDesc: { fontSize: FONTS.sizes.sm, fontWeight: '500', color: COLORS.dark },
  txnDate: { fontSize: FONTS.sizes.xs, color: COLORS.gray },
  txnRight: { alignItems: 'flex-end' },
  txnAmount: { fontSize: FONTS.sizes.sm, fontWeight: 'bold' },
  txnStatus: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  
  // Referral
  referralCard: { borderRadius: 20, padding: SPACING.xl, marginBottom: SPACING.md, alignItems: 'center', ...SHADOWS.large },
  referralIcon: { fontSize: 48, marginBottom: SPACING.sm },
  referralTitle: { color: '#FFF', fontSize: FONTS.sizes.xxl, fontWeight: 'bold' },
  referralSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: FONTS.sizes.sm, marginTop: 4, textAlign: 'center' },
  referralStats: { flexDirection: 'row', marginTop: SPACING.lg, gap: SPACING.xl },
  refStat: { alignItems: 'center' },
  refStatValue: { color: '#FFF', fontSize: FONTS.sizes.xxl, fontWeight: 'bold' },
  refStatLabel: { color: 'rgba(255,255,255,0.7)', fontSize: FONTS.sizes.xs },
  
  // Code
  codeCard: { backgroundColor: '#FFF', borderRadius: 16, padding: SPACING.lg, alignItems: 'center', marginBottom: SPACING.md, ...SHADOWS.medium },
  codeLabel: { fontSize: FONTS.sizes.sm, color: COLORS.gray },
  codeValue: { fontSize: FONTS.sizes.xxxl, fontWeight: 'bold', color: COLORS.primary, letterSpacing: 3, marginVertical: SPACING.sm },
  copyBtn: { backgroundColor: '#E8F5E9', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, borderRadius: 20 },
  copyBtnText: { color: '#4CAF50', fontWeight: 'bold', fontSize: FONTS.sizes.sm },
  
  // Share
  shareCard: { backgroundColor: '#FFF', borderRadius: 16, padding: SPACING.lg, marginBottom: SPACING.md, ...SHADOWS.small },
  shareTitle: { fontSize: FONTS.sizes.md, fontWeight: 'bold', color: COLORS.dark, marginBottom: SPACING.md },
  shareGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  shareBtn: { width: (width - SPACING.md * 2 - SPACING.lg * 2 - SPACING.sm) / 2, padding: SPACING.md, borderRadius: 12, alignItems: 'center' },
  shareIcon: { fontSize: 28, marginBottom: 4 },
  shareText: { fontSize: FONTS.sizes.sm, fontWeight: '600' },
  
  // Referrals
  refItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  refAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.sm },
  refAvatarText: { color: '#FFF', fontWeight: 'bold' },
  refInfo: { flex: 1 },
  refName: { fontSize: FONTS.sizes.sm, fontWeight: '600' },
  refDate: { fontSize: FONTS.sizes.xs, color: COLORS.gray },
  refEarnings: { fontSize: FONTS.sizes.sm, fontWeight: 'bold' },
  
  // Empty
  emptyState: { alignItems: 'center', padding: SPACING.xl },
  emptyIcon: { fontSize: 40, marginBottom: SPACING.sm },
  emptyText: { color: COLORS.gray },
});

export default WalletScreen;

