// App.tsx - Un-locka Main App
import React, { useState, useCallback, createContext, useContext, useEffect } from 'react';
import {
  View, Text, StyleSheet, StatusBar, Platform, TouchableOpacity,
  ScrollView, KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS, SPACING, SHADOWS, APP_INFO } from './src/constants/theme';
import Toast from './src/components/Toast';
import LoadingOverlay from './src/components/LoadingOverlay';
import HeaderBar from './src/components/HeaderBar';
import HamburgerMenu from './src/components/HamburgerMenu';
import BottomNavBar, { BottomTab } from './src/components/BottomNavBar';
import LoginScreen from './src/screens/LoginScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import SecuritySettings from './src/screens/SecuritySettings';
import WalletScreen from './src/screens/WalletScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import HelpScreen from './src/screens/HelpScreen';
import TermsOfService from './src/screens/legal/TermsOfService';
import PrivacyPolicy from './src/screens/legal/PrivacyPolicy';
import CopyrightNotice from './src/screens/legal/CopyrightNotice';
import AboutScreen from './src/screens/AboutScreen';
import AdminDashboard from './src/screens/AdminDashboard';
import ChatListScreen from './src/screens/ChatListScreen';
import ChatScreen from './src/screens/ChatScreen';
import NewChatScreen from './src/screens/NewChatScreen';
import StatusListScreen from './src/screens/StatusListScreen';
import AddStatusScreen from './src/screens/AddStatusScreen';
import StatusViewer from './src/components/status/StatusViewer';
import CreatorsScreen from './src/screens/CreatorsScreen';
import UploadVideoScreen from './src/screens/UploadVideoScreen';
import CreatorProfileScreen from './src/screens/CreatorProfileScreen';
import CreatorPaywall from './src/components/creators/CreatorPaywall';
import SendViewOnceScreen from './src/screens/SendViewOnceScreen';
import ViewOnceList from './src/components/viewOnce/ViewOnceList';
import ViewOnceViewer from './src/components/viewOnce/ViewOnceViewer';
import NotificationsScreen from './src/screens/NotificationsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SearchScreen from './src/screens/SearchScreen';
import TermsCheckbox from './src/components/TermsCheckbox';
import ProgressIndicator from './src/components/ProgressIndicator';
import InputField from './src/components/InputField';
import Button from './src/components/Button';
import Footer from './src/components/Footer';
import { SignupFormData, SignupStep, ScreenName } from './src/types';
import { validateStep1 } from './src/utils/validators';
import { mockLogin, mockSignup, TEST_ACCOUNTS } from './src/services/localMockData';

export const ToastContext = createContext<any>({});
export const useToast = () => useContext(ToastContext);

const App: React.FC = () => {
  const [appMode, setAppMode] = useState<'signup' | 'main'>('signup');
  const [screen, setScreen] = useState<ScreenName>('home');
  const [activeTab, setActiveTab] = useState<BottomTab>('chats');
  const [currentStep, setCurrentStep] = useState<SignupStep>(1);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [walletBalance, setWalletBalance] = useState(0);
  const [userId, setUserId] = useState<number | null>(null);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [showStatusViewer, setShowStatusViewer] = useState(false);
  const [statusViewerData, setStatusViewerData] = useState<any>(null);
  const [showCreateStatus, setShowCreateStatus] = useState(false);
  const [viewOnceViewer, setViewOnceViewer] = useState<any>(null);
  const [showSendViewOnce, setShowSendViewOnce] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [formData, setFormData] = useState<SignupFormData>({
    full_name: '', username: '', email: '', phone: '',
    mpesa_number: '', password: '', confirm_password: '', referral_code: '',
  });

  const [referralCode, setReferralCode] = useState('');
  const [mpesaPayment, setMpesaPayment] = useState('');

  const showToast = useCallback((msg: string) => { setToastMessage(msg); setToastVisible(true); }, []);
  const hideToast = useCallback(() => setToastVisible(false), []);
  const showLoadingFn = useCallback((msg: string = 'Please wait...') => { setLoadingMessage(msg); setLoading(true); }, []);
  const hideLoadingFn = useCallback(() => setLoading(false), []);

  const handleLoginSuccess = (user: any) => {
    setLoggedInUser(user); setIsLoggedIn(true); setUserId(user.id);
    setUserEmail(user.email); setUserName(user.fullName || user.username);
    setWalletBalance(user.walletBalance || 0);
    setAppMode('main'); setScreen('chats'); setActiveTab('chats');
    showToast(`Welcome, ${user.fullName || user.username}! 🎉`);
  };

  const handleNavigate = (screenName: string, params?: any) => {
    const screens: Record<string, ScreenName> = {
      forgotPassword: 'forgotPassword', security: 'security', wallet: 'wallet',
      admin: 'admin', settings: 'settings', help: 'help', about: 'about',
      signup: 'signup', login: 'login', chats: 'chats', viewOnce: 'viewOnce',
      status: 'status', creators: 'creators', home: 'home',
      termsOfService: 'termsOfService', privacyPolicy: 'privacyPolicy',
      copyrightNotice: 'copyrightNotice', profile: 'profile',
      notifications: 'notifications', search: 'search',
      newChat: 'newChat', uploadVideo: 'uploadVideo', creatorProfile: 'creatorProfile',
    };
    const target = screens[screenName] || 'home';
    setScreen(target);
    if (['chats', 'viewOnce', 'status', 'creators'].includes(screenName)) {
      setActiveTab(screenName as BottomTab);
    }
    if (screenName === 'chats') setActiveChat(null);
  };

  const handleTabPress = (tab: BottomTab) => {
    setActiveTab(tab); setScreen(tab as ScreenName);
    if (tab === 'chats') setActiveChat(null);
  };

  const handleStep1 = async () => {
    if (!termsAgreed) { showToast('⚠️ Please agree to Terms'); return; }
    const errors = validateStep1(formData);
    if (Object.keys(errors).length > 0) { showToast(errors[Object.keys(errors)[0]]); return; }
    showLoadingFn('Creating account...');
    const res = await mockSignup(formData);
    if (res.success && res.user) {
      setUserId(res.user.id); setUserEmail(res.user.email); setUserName(res.user.fullName);
      showToast('✅ Account created!');
      hideLoadingFn(); setCurrentStep(2);
    } else { showToast('Failed'); hideLoadingFn(); }
  };

  const updateField = (field: keyof SignupFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const showBottomNav = appMode === 'main' && isLoggedIn && ['chats', 'viewOnce', 'status', 'creators'].includes(screen);
  const showHamburger = appMode === 'main' && isLoggedIn && screen !== 'login';
  const toastContextValue = { showToast, showLoading: showLoadingFn, hideLoading: hideLoadingFn };

  const renderScreenContent = () => {
    if (screen === 'home') return <View style={styles.center}><Text style={{ fontSize: 60 }}>🔓</Text><Text style={styles.placeholderTitle}>Un-locka</Text></View>;
    if (screen === 'login') return <LoginScreen onNavigate={(s: string) => { if (s === 'signup') { setAppMode('signup'); setCurrentStep(1); } else if (s === 'forgotPassword') setScreen('forgotPassword'); else handleNavigate(s); }} onLoginSuccess={handleLoginSuccess} />;
    if (screen === 'forgotPassword') return <ForgotPasswordScreen onNavigate={handleNavigate} onBack={() => setScreen('login')} />;
    if (screen === 'security') return <SecuritySettings onNavigate={handleNavigate} />;
    if (screen === 'help') return <HelpScreen onClose={() => setScreen('chats')} />;
    if (screen === 'about') return <AboutScreen onClose={() => setScreen('chats')} onNavigate={handleNavigate} />;
    if (screen === 'settings') return <SettingsScreen onNavigate={handleNavigate} onClose={() => setScreen('chats')} userEmail={userEmail} userName={userName} />;
    if (screen === 'wallet') return <WalletScreen userId={userId || 1} onClose={() => setScreen('chats')} />;
    if (screen === 'admin') return <AdminDashboard userEmail={userEmail} onClose={() => setScreen('chats')} />;
    if (screen === 'termsOfService') return <TermsOfService onClose={() => setScreen('signup')} />;
    if (screen === 'privacyPolicy') return <PrivacyPolicy onClose={() => setScreen('about')} />;
    if (screen === 'copyrightNotice') return <CopyrightNotice onClose={() => setScreen('about')} />;
    if (screen === 'profile') return <ProfileScreen userId={userId || 1} userName={userName} userEmail={userEmail} onClose={() => setScreen('chats')} onNavigate={handleNavigate} />;
    if (screen === 'notifications') return <NotificationsScreen userId={userId || 1} onClose={() => setScreen('chats')} />;
    if (screen === 'search') return <SearchScreen onClose={() => setScreen('chats')} onNavigate={handleNavigate} />;
    if (screen === 'newChat') return <NewChatScreen onBack={() => setScreen('chats')} onStartChat={(contact) => { setActiveChat(contact); setScreen('chats'); }} />;
    if (screen === 'uploadVideo') return <UploadVideoScreen userId={userId || 1} onClose={() => setScreen('creators')} onUploaded={() => { showToast('Uploaded!'); setScreen('creators'); }} />;
    if (screen === 'creatorProfile') return <CreatorProfileScreen userId={userId || 1} userName={userName} onClose={() => setScreen('creators')} onNavigate={handleNavigate} />;
    
    if (screen === 'chats') return activeChat ? <ChatScreen chat={activeChat} onBack={() => setActiveChat(null)} userId={userId || 1} /> : <ChatListScreen onChatPress={setActiveChat} onNavigate={handleNavigate} />;
    
    if (screen === 'viewOnce') return viewOnceViewer ? <ViewOnceViewer content={viewOnceViewer} userId={userId || 1} onClose={() => setViewOnceViewer(null)} onOpened={() => showToast('Content opened!')} /> : showSendViewOnce ? <SendViewOnceScreen onClose={() => setShowSendViewOnce(false)} onSent={() => { setShowSendViewOnce(false); showToast('Sent!'); }} senderId={userId || 1} senderName={userName} /> : <ViewOnceList userId={userId || 1} onViewOncePress={(c) => setViewOnceViewer(c)} onCreatePress={() => setShowSendViewOnce(true)} />;
    
    if (screen === 'status') return showStatusViewer && statusViewerData ? <StatusViewer userStatus={statusViewerData.userStatus} initialIndex={statusViewerData.initialIndex} currentUserId={userId || 1} currentUserName={userName} onClose={() => { setShowStatusViewer(false); setStatusViewerData(null); }} onNext={() => {}} onPrevious={() => {}} /> : showCreateStatus ? <AddStatusScreen userId={userId || 1} onClose={() => setShowCreateStatus(false)} onPost={() => { setShowCreateStatus(false); showToast('Posted!'); }} /> : <StatusListScreen onStatusPress={(userStatus, index) => { setStatusViewerData({ userStatus, initialIndex: index }); setShowStatusViewer(true); }} onAddStatus={() => setShowCreateStatus(true)} currentUserId={userId || 1} currentUserName={userName} />;
    
    if (screen === 'creators') return <CreatorsScreen userId={userId || 1} userName={userName} onNavigate={handleNavigate} />;
    
    return null;
  };

  const SignupScreenComponent = () => (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.signupContent} keyboardShouldPersistTaps="handled" keyboardDismissMode="none">
        <View style={styles.signupHeader}>
          <Text style={styles.signupEmoji}>🔓</Text>
          <Text style={styles.signupTitle}>{APP_INFO.name}</Text>
          <Text style={styles.signupTagline}>Create Account, Omoka!!!</Text>
        </View>
        <View style={styles.progressCard}><ProgressIndicator currentStep={currentStep} totalSteps={3} /></View>
        <View style={styles.signupCard}>
          {currentStep === 1 && (
            <>
              <Text style={styles.stepTitle}>👤 Create Account</Text>
              <InputField label="Full Name" icon="👤" value={formData.full_name} onChangeText={t => updateField('full_name', t)} placeholder="Mwolobi Junior" autoCapitalize="words" />
              <InputField label="Username" icon="📝" value={formData.username} onChangeText={t => updateField('username', t.toLowerCase())} placeholder="mwolobi_junior" />
              <InputField label="Email" icon="📧" value={formData.email} onChangeText={t => updateField('email', t.toLowerCase())} placeholder="mwolobi@example.com" keyboardType="email-address" />
              <InputField label="Phone" icon="📞" value={formData.phone} onChangeText={t => updateField('phone', t.replace(/\D/g, ''))} placeholder="0712345678" keyboardType="phone-pad" maxLength={10} />
              <InputField label="Password" icon="🔒" value={formData.password} onChangeText={t => updateField('password', t)} placeholder="Min 8 characters" secureTextEntry={!showPassword} showSecureToggle onToggleSecure={() => setShowPassword(!showPassword)} />
              <InputField label="Confirm Password" icon="🔐" value={formData.confirm_password} onChangeText={t => updateField('confirm_password', t)} placeholder="Repeat password" secureTextEntry={!showConfirm} showSecureToggle onToggleSecure={() => setShowConfirm(!showConfirm)} />
              <TermsCheckbox agreed={termsAgreed} onToggle={() => setTermsAgreed(!termsAgreed)} onViewTerms={() => setScreen('termsOfService')} onViewPrivacy={() => setScreen('privacyPolicy')} />
              <Button title="Continue" icon="💳" onPress={handleStep1} loading={loading} disabled={!termsAgreed} />
            </>
          )}
        </View>
        <TouchableOpacity style={styles.loginLink} onPress={() => { setAppMode('main'); setScreen('login'); }}>
          <Text style={styles.loginLinkText}>Already have an account? <Text style={styles.loginLinkBold}>Sign In</Text></Text>
        </TouchableOpacity>
        <Footer onNavigate={handleNavigate} />
      </ScrollView>
    </KeyboardAvoidingView>
  );

  return (
    <SafeAreaProvider>
      <ToastContext.Provider value={toastContextValue}>
        <SafeAreaView style={styles.safe} edges={['top']}>
          <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
          <Toast visible={toastVisible} message={toastMessage} onDismiss={hideToast} duration={3000} />
          <LoadingOverlay visible={loading} message={loadingMessage} />
          {showHamburger && <HamburgerMenu visible={menuVisible} onClose={() => setMenuVisible(false)} onNavigate={handleNavigate} currentScreen={screen} userEmail={userEmail} userName={userName} isLoggedIn={isLoggedIn} walletBalance={walletBalance} />}
          
          {appMode === 'signup' ? <SignupScreenComponent /> : (
            <View style={styles.flex}>
              {screen !== 'login' && <HeaderBar title={APP_INFO.name} onMenuPress={() => setMenuVisible(true)} showMarquee={true} userEmail={userEmail} onNotificationPress={() => handleNavigate('notifications')} onSearchPress={() => handleNavigate('search')} />}
              <View style={styles.flex}>{renderScreenContent()}</View>
              {showBottomNav && <BottomNavBar activeTab={activeTab} onTabPress={handleTabPress} />}
            </View>
          )}
        </SafeAreaView>
      </ToastContext.Provider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.primaryDark },
  flex: { flex: 1, backgroundColor: COLORS.offWhite },
  scroll: { flex: 1 },
  signupContent: { paddingBottom: SPACING.xxl },
  signupHeader: { alignItems: 'center', paddingTop: 60, paddingBottom: SPACING.lg, backgroundColor: COLORS.primary },
  signupEmoji: { fontSize: 48, marginBottom: SPACING.sm },
  signupTitle: { fontSize: FONTS.sizes.xxxl, fontWeight: 'bold', color: '#FFF' },
  signupTagline: { fontSize: FONTS.sizes.sm, color: 'rgba(255,255,255,0.8)', marginTop: SPACING.xs },
  progressCard: { marginHorizontal: SPACING.md, marginTop: -SPACING.lg, backgroundColor: '#FFF', borderRadius: 16, ...SHADOWS.medium },
  signupCard: { backgroundColor: '#FFF', marginHorizontal: SPACING.md, marginTop: SPACING.sm, padding: SPACING.lg, borderRadius: 20, ...SHADOWS.large },
  stepTitle: { fontSize: FONTS.sizes.xl, fontWeight: 'bold', color: COLORS.dark, textAlign: 'center', marginBottom: SPACING.lg },
  loginLink: { alignItems: 'center', marginTop: SPACING.lg },
  loginLinkText: { fontSize: FONTS.sizes.sm, color: COLORS.gray },
  loginLinkBold: { color: COLORS.primary, fontWeight: 'bold' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  placeholderTitle: { fontSize: FONTS.sizes.lg, fontWeight: 'bold', color: COLORS.dark, marginTop: SPACING.md },
});

export default App;
