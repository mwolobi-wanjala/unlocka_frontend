// screens/HelpScreen.tsx - Help & Support with Un-locka Helper Bot
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, FlatList, Linking, Dimensions,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, SHADOWS, APP_INFO } from '../constants/theme';

const { width, height } = Dimensions.get('window');

interface HelpScreenProps {
  onClose: () => void;
}

// Contact Information
const CONTACT_INFO: Record<string, { number?: string; address?: string; label: string; icon: string; color: string }> = {
  whatsapp: { number: '+254784095825', label: 'WhatsApp', icon: '💬', color: '#25D366' },
  email: { address: 'mwolobijavanson@gmail.com', label: 'Email', icon: '📧', color: '#EA4335' },
  call1: { number: '+254784095825', label: 'Call (Line 1)', icon: '📞', color: '#2196F3' },
  call2: { number: '+254115995514', label: 'Call (Line 2)', icon: '📞', color: '#4CAF50' },
  telegram: { number: '+254115995514', label: 'Telegram', icon: '✈️', color: '#0088cc' },
};

// FAQ Categories
const LEGAL_LINKS = [
  { id: "terms", label: "Terms of Service", icon: "📜" },
  { id: "privacy", label: "Privacy Policy", icon: "🔒" },
  { id: "copyright", label: "Copyright Notice", icon: "©️" },
];

const FAQ_CATEGORIES = [
  { id: 'general', name: 'General', icon: '📋' },
  { id: 'account', name: 'Account', icon: '👤' },
  { id: 'payment', name: 'Payments', icon: '💰' },
  { id: 'viewOnce', name: 'View Once', icon: '💎' },
  { id: 'chat', name: 'Chat', icon: '💬' },
  { id: 'wallet', name: 'Wallet', icon: '🏦' },
  { id: 'security', name: 'Security', icon: '🔒' },
  { id: 'referral', name: 'Referrals', icon: '🎁' },
];

// Bot message interface
interface BotMessage {
  id: string;
  type: 'bot' | 'user';
  text: string;
  timestamp: string;
}

// Bot knowledge base
const BOT_KNOWLEDGE: { [key: string]: string } = {
  'what is un-locka': 'Un-locka is a secure messaging and content monetization platform where you can chat, share view-once content, and earn money through referrals and paid content.',
  'how to sign up': 'To sign up, enter your full name (at least 2 words), username (must contain underscore like mwolobi_junior), email, phone number, and create a strong password.',
  'how to earn': 'You can earn on Un-locka through: 1) Referrals (KSH 20 each), 2) View Once content (90% of price), 3) Paid chat media (85% of price).',
  'what is view once': 'View Once allows you to send photo or video content that the recipient must pay to view. The content disappears after viewing. You earn 90% of the payment.',
  'how to withdraw': 'Go to Wallet → Withdraw → Enter amount (KSH 50-50,000) → Enter M-Pesa number → Confirm. Withdrawals are processed automatically.',
  'forgot password': 'Go to Login → Forgot Password. You can reset via SMS to your phone or via email. A 6-digit code will be sent.',
  'is my data safe': 'Yes! All data is end-to-end encrypted. We use bank-level security (SHA-512, AES-256, RSA).',
  'how to refer': 'Go to Wallet → Referral tab → Share your referral code via WhatsApp, SMS, Email, or Telegram.',
  'hello': 'Hello! 👋 I\'m Un-locka Helper. How can I assist you today?',
  'hi': 'Hi there! 👋 Need help with Un-locka? Ask me anything!',
  'help': 'I can help with: Account, Payments, View Once, Chat, Wallet, Security, Referrals. Just ask!',
  'thanks': 'You\'re welcome! 😊 Happy to help.',
  'bye': 'Goodbye! 👋 Have a great day on Un-locka!',
  'who are you': 'I\'m Un-locka Helper Bot 🤖 - I can answer questions about the app. Just ask!',
};

const getBotResponse = (query: string): string => {
  const q = query.toLowerCase().trim();
  if (BOT_KNOWLEDGE[q]) return BOT_KNOWLEDGE[q];
  for (const [key, value] of Object.entries(BOT_KNOWLEDGE)) {
    if (q.includes(key) || key.includes(q)) return value;
  }
  if (q.includes('signup') || q.includes('register')) return BOT_KNOWLEDGE['how to sign up'];
  if (q.includes('pay') || q.includes('mpesa')) return 'To pay, enter your M-Pesa number and you will receive an STK Push. Enter your PIN to complete payment.';
  if (q.includes('view once')) return BOT_KNOWLEDGE['what is view once'];
  if (q.includes('refer')) return BOT_KNOWLEDGE['how to refer'];
  if (q.includes('withdraw') || q.includes('wallet')) return BOT_KNOWLEDGE['how to withdraw'];
  if (q.includes('password') || q.includes('forgot')) return BOT_KNOWLEDGE['forgot password'];
  if (q.includes('earn') || q.includes('money')) return BOT_KNOWLEDGE['how to earn'];
  return 'I\'m not sure about that. Try asking about: Account, Payments, View Once, Chat, Wallet, Security, or Referrals. You can also contact our support team directly.';
};

const HelpScreen: React.FC<HelpScreenProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'faq' | 'contact' | 'bot'>('faq');
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [botMessages, setBotMessages] = useState<BotMessage[]>([
    { id: '1', type: 'bot', text: 'Hello! 👋 I\'m Un-locka Helper. How can I help you today?', timestamp: new Date().toISOString() },
  ]);
  const [botInput, setBotInput] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const suggestedQuestions = [
    'How to sign up?', 'How to earn money?', 'What is View Once?',
    'How to withdraw?', 'How to refer friends?', 'Is my data safe?',
  ];

  const handleContact = (type: string) => {
    switch (type) {
      case 'whatsapp': {
        const number = CONTACT_INFO.whatsapp.number ?? '';
        if (number) Linking.openURL(`https://wa.me/${number.replace('+', '')}`);
        break;
      }
      case 'email': {
        const email = CONTACT_INFO.email.address ?? '';
        if (email) Linking.openURL(`mailto:${email}`);
        break;
      }
      case 'call1': {
        const number = CONTACT_INFO.call1.number ?? '';
        if (number) Linking.openURL(`tel:${number}`);
        break;
      }
      case 'call2': {
        const number = CONTACT_INFO.call2.number ?? '';
        if (number) Linking.openURL(`tel:${number}`);
        break;
      }
      case 'telegram': {
        const number = CONTACT_INFO.telegram.number ?? '';
        if (number) Linking.openURL(`https://t.me/${number.replace('+', '')}`);
        break;
      }
    }
  };

  const handleBotSend = () => {
    if (!botInput.trim()) return;
    const userMessage: BotMessage = { id: Date.now().toString(), type: 'user', text: botInput, timestamp: new Date().toISOString() };
    setBotMessages(prev => [...prev, userMessage]);
    setBotInput('');
    setTimeout(() => {
      const botResponse: BotMessage = { id: (Date.now() + 1).toString(), type: 'bot', text: getBotResponse(botInput), timestamp: new Date().toISOString() };
      setBotMessages(prev => [...prev, botResponse]);
      flatListRef.current?.scrollToEnd();
    }, 800);
  };

  const handleSuggestedQuestion = (question: string) => {
    setBotMessages(prev => [...prev, { id: Date.now().toString(), type: 'user', text: question, timestamp: new Date().toISOString() }]);
    setTimeout(() => {
      setBotMessages(prev => [...prev, { id: (Date.now() + 1).toString(), type: 'bot', text: getBotResponse(question), timestamp: new Date().toISOString() }]);
      flatListRef.current?.scrollToEnd();
    }, 600);
  };

  const renderBotMessage = ({ item }: { item: BotMessage }) => (
    <View style={[styles.botMsgContainer, item.type === 'user' ? styles.userMsgContainer : styles.botMsgContainerLeft]}>
      {item.type === 'bot' && (
        <View style={styles.botAvatar}><Text style={styles.botAvatarText}>🤖</Text></View>
      )}
      <View style={[styles.botBubble, item.type === 'user' ? styles.userBubble : styles.botBubbleStyle]}>
        <Text style={[styles.botMsgText, item.type === 'user' && styles.userMsgText]}>{item.text}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.header}>
        <TouchableOpacity onPress={onClose}><Text style={styles.backBtn}>←</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabs}>
        {[
          { key: 'faq', label: 'FAQ', icon: '❓' },
          { key: 'bot', label: 'Helper Bot', icon: '🤖' },
          { key: 'contact', label: 'Contact Us', icon: '📞' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key as any)}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* FAQ TAB */}
        {activeTab === 'faq' && (
          <>
            <View style={styles.searchBar}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput style={styles.searchInput} value={searchQuery} onChangeText={setSearchQuery} placeholder="Search FAQs..." placeholderTextColor="#999" />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
              {FAQ_CATEGORIES.map((cat) => (
                <TouchableOpacity key={cat.id} style={[styles.categoryBtn, selectedCategory === cat.id && styles.categoryActive]} onPress={() => setSelectedCategory(cat.id)}>
                  <Text style={styles.categoryIcon}>{cat.icon}</Text>
                  <Text style={[styles.categoryText, selectedCategory === cat.id && styles.categoryTextActive]}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {Object.entries(BOT_KNOWLEDGE).filter(([key]) => searchQuery ? key.includes(searchQuery.toLowerCase()) : true).slice(0, 20).map(([question, answer], index) => (
              <View key={index} style={styles.faqItem}>
                <Text style={styles.faqQuestion}>❓ {question.charAt(0).toUpperCase() + question.slice(1)}</Text>
                <Text style={styles.faqAnswer}>{answer}</Text>
              </View>
            ))}
          </>
        )}

        {/* BOT TAB */}
        {activeTab === 'bot' && (
          <View style={styles.botContainer}>
            <View style={styles.botHeader}>
              <Text style={styles.botHeaderIcon}>🤖</Text>
              <View>
                <Text style={styles.botHeaderName}>Un-locka Helper</Text>
                <Text style={styles.botHeaderStatus}>🟢 Online • Instant answers</Text>
              </View>
            </View>
            <FlatList ref={flatListRef} data={botMessages} renderItem={renderBotMessage} keyExtractor={item => item.id} style={styles.botMessages} contentContainerStyle={styles.botMessagesContent} onContentSizeChange={() => flatListRef.current?.scrollToEnd()} />
            {botMessages.length <= 1 && (
              <View style={styles.suggestedContainer}>
                <Text style={styles.suggestedTitle}>Suggested Questions:</Text>
                <View style={styles.suggestedGrid}>
                  {suggestedQuestions.map((q, i) => (
                    <TouchableOpacity key={i} style={styles.suggestedBtn} onPress={() => handleSuggestedQuestion(q)}>
                      <Text style={styles.suggestedText}>{q}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
              <View style={styles.botInputContainer}>
                <TextInput style={styles.botInput} value={botInput} onChangeText={setBotInput} placeholder="Ask me anything..." placeholderTextColor="#999" multiline maxLength={200} onSubmitEditing={handleBotSend} />
                <TouchableOpacity style={styles.botSendBtn} onPress={handleBotSend}><Text style={styles.botSendIcon}>📤</Text></TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        )}

        {/* CONTACT TAB */}
        {activeTab === 'contact' && (
          <>
            <View style={styles.contactHeader}>
              <Text style={styles.contactTitle}>📞 Get in Touch</Text>
              <Text style={styles.contactSubtitle}>We're here to help! Reach out through any channel.</Text>
            </View>

            {Object.entries(CONTACT_INFO).map(([key, info]) => {
              const contactValue = info.number ?? info.address ?? '';
              return (
                <TouchableOpacity key={key} style={[styles.contactCard, { borderLeftColor: info.color }]} onPress={() => handleContact(key)}>
                  <Text style={styles.contactIcon}>{info.icon}</Text>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactLabel}>{info.label}</Text>
                    <Text style={styles.contactValue}>{contactValue}</Text>
                    <Text style={styles.contactHint}>
                      {key === 'whatsapp' ? 'Fast response • Chat support' :
                       key === 'email' ? '24-48 hour response time' :
                       key === 'telegram' ? 'Fast response • Chat support' :
                       'Available 8AM - 8PM EAT'}
                    </Text>
                  </View>
                  <Text style={styles.contactArrow}>→</Text>
                </TouchableOpacity>
              );
            })}

            {/* Response Time Info */}
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>⚡ Response Times</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>WhatsApp:</Text>
                <Text style={styles.infoValue}>Within 1 hour</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Telegram:</Text>
                <Text style={styles.infoValue}>Within 1 hour</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Phone Calls:</Text>
                <Text style={styles.infoValue}>8AM - 8PM EAT</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email:</Text>
                <Text style={styles.infoValue}>24-48 hours</Text>
              </View>
            </View>

            {/* Common Issues */}
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>🔧 Common Issues</Text>
              <Text style={styles.issueText}>• Payment not reflecting? Check your M-Pesa balance first</Text>
              <Text style={styles.issueText}>• App crashing? Try clearing cache in Settings</Text>
              <Text style={styles.issueText}>• Can't login? Use Forgot Password or contact support</Text>
              <Text style={styles.issueText}>• Withdrawal pending? It's processed automatically</Text>
            </View>

            {/* Report Issue */}
            <TouchableOpacity style={styles.reportBtn} onPress={() => Linking.openURL(`mailto:${CONTACT_INFO.email.address}?subject=Bug Report&body=Describe the issue:`)}>
              <Text style={styles.reportIcon}>🐛</Text>
              <Text style={styles.reportText}>Report a Bug</Text>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.reportBtn} onPress={() => Linking.openURL(`mailto:${CONTACT_INFO.email.address}?subject=Feature Request&body=Describe your idea:`)}>
              <Text style={styles.reportIcon}>💡</Text>
              <Text style={styles.reportText}>Suggest a Feature</Text>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, padding: SPACING.md },
  backBtn: { color: '#FFF', fontSize: 22 },
  headerTitle: { color: '#FFF', fontSize: FONTS.sizes.lg, fontWeight: 'bold' },
  
  tabs: { flexDirection: 'row', backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  tab: { flex: 1, alignItems: 'center', paddingVertical: SPACING.sm, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: COLORS.primary },
  tabIcon: { fontSize: 18, marginBottom: 2 },
  tabText: { fontSize: FONTS.sizes.xs, color: COLORS.gray, fontWeight: '600' },
  activeTabText: { color: COLORS.primary, fontWeight: 'bold' },
  
  scrollContent: { paddingBottom: SPACING.xxl },
  
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', margin: SPACING.md, borderRadius: 12, paddingHorizontal: SPACING.md, ...SHADOWS.small },
  searchIcon: { fontSize: 16, marginRight: SPACING.sm },
  searchInput: { flex: 1, padding: SPACING.md },
  
  categoriesScroll: { paddingHorizontal: SPACING.md, marginBottom: SPACING.md },
  categoryBtn: { alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: 20, marginRight: SPACING.sm, backgroundColor: '#FFF' },
  categoryActive: { backgroundColor: COLORS.primary },
  categoryIcon: { fontSize: 18, marginBottom: 2 },
  categoryText: { fontSize: FONTS.sizes.xs, color: COLORS.gray },
  categoryTextActive: { color: '#FFF', fontWeight: 'bold' },
  
  faqItem: { backgroundColor: '#FFF', marginHorizontal: SPACING.md, marginBottom: SPACING.sm, padding: SPACING.md, borderRadius: 12, ...SHADOWS.small },
  faqQuestion: { fontSize: FONTS.sizes.sm, fontWeight: 'bold', color: COLORS.dark, marginBottom: SPACING.sm },
  faqAnswer: { fontSize: FONTS.sizes.sm, color: COLORS.gray, lineHeight: 20 },
  
  botContainer: { flex: 1, minHeight: height * 0.6 },
  botHeader: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  botHeaderIcon: { fontSize: 30, marginRight: SPACING.sm },
  botHeaderName: { fontSize: FONTS.sizes.md, fontWeight: 'bold', color: COLORS.dark },
  botHeaderStatus: { fontSize: FONTS.sizes.xs, color: '#4CAF50' },
  botMessages: { flex: 1, backgroundColor: '#ECE5DD' },
  botMessagesContent: { padding: SPACING.sm },
  botMsgContainer: { flexDirection: 'row', marginBottom: SPACING.sm, alignItems: 'flex-end' },
  botMsgContainerLeft: {},
  userMsgContainer: { justifyContent: 'flex-end' },
  botAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center', marginRight: SPACING.xs },
  botAvatarText: { fontSize: 16 },
  botBubble: { maxWidth: '75%', padding: SPACING.sm, borderRadius: 12 },
  botBubbleStyle: { backgroundColor: '#FFF', borderTopLeftRadius: 2 },
  userBubble: { backgroundColor: '#DCF8C6', borderTopRightRadius: 2 },
  botMsgText: { fontSize: FONTS.sizes.sm, color: COLORS.dark, lineHeight: 20 },
  userMsgText: {},
  suggestedContainer: { padding: SPACING.md, backgroundColor: '#FFF' },
  suggestedTitle: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.gray, marginBottom: SPACING.sm },
  suggestedGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  suggestedBtn: { backgroundColor: '#E3F2FD', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: 20 },
  suggestedText: { fontSize: FONTS.sizes.xs, color: '#1565C0', fontWeight: '600' },
  botInputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: SPACING.sm, borderTopWidth: 1, borderTopColor: '#E0E0E0' },
  botInput: { flex: 1, backgroundColor: '#F5F5F5', borderRadius: 20, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, fontSize: FONTS.sizes.sm, maxHeight: 80 },
  botSendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginLeft: SPACING.sm },
  botSendIcon: { fontSize: 18, color: '#FFF' },
  
  contactHeader: { padding: SPACING.lg, alignItems: 'center' },
  contactTitle: { fontSize: FONTS.sizes.xl, fontWeight: 'bold', color: COLORS.dark },
  contactSubtitle: { fontSize: FONTS.sizes.sm, color: COLORS.gray, textAlign: 'center', marginTop: SPACING.sm },
  contactCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', marginHorizontal: SPACING.md, marginBottom: SPACING.sm, padding: SPACING.md, borderRadius: 12, borderLeftWidth: 4, ...SHADOWS.small },
  contactIcon: { fontSize: 28, marginRight: SPACING.md, width: 40, textAlign: 'center' },
  contactInfo: { flex: 1 },
  contactLabel: { fontSize: FONTS.sizes.sm, fontWeight: 'bold', color: COLORS.dark },
  contactValue: { fontSize: FONTS.sizes.sm, color: COLORS.primary, marginTop: 2 },
  contactHint: { fontSize: FONTS.sizes.xs, color: COLORS.gray, marginTop: 2 },
  contactArrow: { fontSize: 22, color: COLORS.gray },
  
  // Info Cards (replacing business hours)
  infoCard: { backgroundColor: '#FFF', margin: SPACING.md, padding: SPACING.lg, borderRadius: 12, ...SHADOWS.small },
  infoTitle: { fontSize: FONTS.sizes.md, fontWeight: 'bold', color: COLORS.dark, marginBottom: SPACING.sm },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  infoLabel: { fontSize: FONTS.sizes.sm, color: COLORS.gray },
  infoValue: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.dark },
  issueText: { fontSize: FONTS.sizes.sm, color: COLORS.gray, marginBottom: 4, lineHeight: 20 },
  
  reportBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', marginHorizontal: SPACING.md, marginBottom: SPACING.sm, padding: SPACING.md, borderRadius: 12, ...SHADOWS.small },
  reportIcon: { fontSize: 20, marginRight: SPACING.md },
  reportText: { flex: 1, fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.dark },
  arrow: { fontSize: 22, color: COLORS.lightGray },
});

export default HelpScreen;
