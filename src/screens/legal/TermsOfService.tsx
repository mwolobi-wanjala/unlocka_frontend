// screens/legal/TermsOfService.tsx - Complete Terms of Service
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, SHADOWS, APP_INFO } from '../../constants/theme';

interface TermsOfServiceProps {
  onClose: () => void;
  onAgree?: () => void;
  showAgreeButton?: boolean;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ onClose, onAgree, showAgreeButton }) => {
  return (
    <View style={styles.container}>
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.backBtn}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.lastUpdated}>Last Updated: January 2026</Text>
        <Text style={styles.effective}>Effective Date: January 1, 2026</Text>

        {/* SECTION 1 */}
        <Text style={styles.section}>1. ACCEPTANCE OF TERMS</Text>
        <Text style={styles.text}>
          By accessing or using Un-locka ("the App"), you agree to be bound by these Terms of Service 
          ("Terms"). If you do not agree to these Terms, please do not use the App. These Terms constitute 
          a legally binding agreement between you and Jans Tech ("Company", "we", "us", or "our"), 
          a company registered in Kenya.
        </Text>
        <Text style={styles.text}>
          BY CHECKING THE "I AGREE" BOX DURING SIGNUP OR BY USING THE APP, YOU ACKNOWLEDGE THAT 
          YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS.
        </Text>

        {/* SECTION 2 */}
        <Text style={styles.section}>2. DEFINITIONS</Text>
        <Text style={styles.text}>
          <Text style={styles.bold}>"App"</Text> means the Un-locka mobile application.
          {'\n'}<Text style={styles.bold}>"User"</Text> means any person who creates an account or uses the App.
          {'\n'}<Text style={styles.bold}>"Content"</Text> means any text, images, videos, audio, or other materials.
          {'\n'}<Text style={styles.bold}>"View Once"</Text> means content that disappears after a single viewing.
          {'\n'}<Text style={styles.bold}>"KSH"</Text> means Kenyan Shillings, the currency used for transactions.
          {'\n'}<Text style={styles.bold}>"M-Pesa"</Text> means the mobile money service by Safaricom PLC.
        </Text>

        {/* SECTION 3 */}
        <Text style={styles.section}>3. ELIGIBILITY</Text>
        <Text style={styles.text}>
          3.1. You must be at least 18 years of age to use this App.
          {'\n'}3.2. By using the App, you represent and warrant that you are 18 or older.
          {'\n'}3.3. If you are under 18, you must have parental consent.
          {'\n'}3.4. You must have the legal capacity to enter into this agreement.
          {'\n'}3.5. The App is currently available only in Kenya.
        </Text>

        {/* SECTION 4 */}
        <Text style={styles.section}>4. ACCOUNT REGISTRATION</Text>
        <Text style={styles.text}>
          4.1. <Text style={styles.bold}>Accurate Information:</Text> You must provide accurate, current, and complete 
          information during registration including your full name (at least two words), a valid email address, 
          and a working phone number.
          {'\n'}4.2. <Text style={styles.bold}>Username Requirements:</Text> Your username must contain an underscore (_) 
          and only use letters, numbers, and underscores.
          {'\n'}4.3. <Text style={styles.bold}>Password Requirements:</Text> Passwords must be at least 8 characters, 
          containing uppercase, lowercase, numbers, and special characters.
          {'\n'}4.4. <Text style={styles.bold}>One Account:</Text> Each user may maintain only one account.
          {'\n'}4.5. <Text style={styles.bold}>Account Security:</Text> You are responsible for maintaining the 
          confidentiality of your login credentials.
          {'\n'}4.6. <Text style={styles.bold}>Account Transfer:</Text> Accounts are non-transferable.
        </Text>

        {/* SECTION 5 */}
        <Text style={styles.section}>5. PAYMENTS AND FEES</Text>
        <Text style={styles.text}>
          5.1. <Text style={styles.bold}>Signup Fee:</Text> A one-time, non-refundable signup fee of KSH 40 is required 
          to activate your account. Payment is processed via M-Pesa STK Push.
          {'\n'}5.2. <Text style={styles.bold}>View Once Revenue:</Text> When you send view-once content, you earn 90% 
          of the amount paid by the recipient. The remaining 10% is retained as platform fee.
          {'\n'}5.3. <Text style={styles.bold}>Paid Chat Media:</Text> For paid media in chats, you earn 85% of the 
          amount. The platform retains 15%.
          {'\n'}5.4. <Text style={styles.bold}>Referral Bonus:</Text> You earn KSH 20 for each successful referral 
          who completes signup and payment using your referral code.
          {'\n'}5.5. <Text style={styles.bold}>Withdrawals:</Text> A 2% processing fee applies to all withdrawals. 
          Minimum withdrawal is KSH 50, maximum is KSH 50,000 per transaction.
          {'\n'}5.6. <Text style={styles.bold}>Currency:</Text> All transactions are in Kenyan Shillings (KSH).
          {'\n'}5.7. <Text style={styles.bold}>Fee Changes:</Text> Jans Tech reserves the right to modify fees with 
          30 days' notice to users.
        </Text>

        {/* SECTION 6 */}
        <Text style={styles.section}>6. USER CONDUCT</Text>
        <Text style={styles.text}>
          You agree NOT to:
          {'\n'}6.1. Upload, share, or transmit any content that is illegal, harmful, threatening, abusive, 
          harassing, defamatory, obscene, pornographic, or invasive of another's privacy.
          {'\n'}6.2. Impersonate any person or entity, or falsely state your affiliation.
          {'\n'}6.3. Engage in any activity that interferes with or disrupts the App.
          {'\n'}6.4. Attempt to gain unauthorized access to any part of the App.
          {'\n'}6.5. Use the App for any illegal purpose or in violation of any Kenyan laws.
          {'\n'}6.6. Harass, abuse, stalk, or harm other users.
          {'\n'}6.7. Share content that infringes on intellectual property rights.
          {'\n'}6.8. Use automated systems (bots, scripts) to access the App.
          {'\n'}6.9. Collect or harvest user information without consent.
          {'\n'}6.10. Sell or transfer your account to another person.
        </Text>

        {/* SECTION 7 */}
        <Text style={styles.section}>7. CONTENT POLICY</Text>
        <Text style={styles.text}>
          7.1. <Text style={styles.bold}>Ownership:</Text> You retain ownership of all content you create and share.
          {'\n'}7.2. <Text style={styles.bold}>License:</Text> By posting content, you grant Jans Tech a non-exclusive, 
          royalty-free license to host, display, and distribute your content within the App.
          {'\n'}7.3. <Text style={styles.bold}>Prohibited Content:</Text> The following content is strictly prohibited:
          {'\n'}   - Nudity, pornography, or sexually explicit material
          {'\n'}   - Violence, gore, or graphic content
          {'\n'}   - Hate speech or discriminatory content
          {'\n'}   - Harassment or bullying
          {'\n'}   - Spam, scams, or fraudulent content
          {'\n'}   - Malware, viruses, or harmful code
          {'\n'}   - Content that exploits minors
          {'\n'}   - Content promoting illegal activities
          {'\n'}7.4. <Text style={styles.bold}>Removal Rights:</Text> We reserve the right to remove any content 
          that violates these Terms without prior notice.
        </Text>

        {/* SECTION 8 */}
        <Text style={styles.section}>8. INTELLECTUAL PROPERTY</Text>
        <Text style={styles.text}>
          8.1. The Un-locka name, logo, design, source code, and all related materials are the exclusive 
          property of Jans Tech, protected by copyright and intellectual property laws.
          {'\n'}8.2. You may not copy, modify, distribute, sell, or create derivative works of the App.
          {'\n'}8.3. "Un-locka", "Omoka!!!", and the 🔓 logo are trademarks of Jans Tech.
          {'\n'}8.4. User-generated content remains the intellectual property of the user who created it.
        </Text>

        {/* SECTION 9 */}
        <Text style={styles.section}>9. PRIVACY AND DATA</Text>
        <Text style={styles.text}>
          9.1. Your privacy is governed by our Privacy Policy, which is incorporated into these Terms.
          {'\n'}9.2. All messages are end-to-end encrypted.
          {'\n'}9.3. We collect and process data as described in our Privacy Policy.
          {'\n'}9.4. By using the App, you consent to data processing as described.
        </Text>

        {/* SECTION 10 */}
        <Text style={styles.section}>10. TERMINATION</Text>
        <Text style={styles.text}>
          10.1. <Text style={styles.bold}>By You:</Text> You may terminate your account at any time through 
          Settings → Account → Delete My Account.
          {'\n'}10.2. <Text style={styles.bold}>By Us:</Text> Jans Tech reserves the right to suspend or terminate 
          your account for violation of these Terms, with or without notice.
          {'\n'}10.3. <Text style={styles.bold}>Effect of Termination:</Text> Upon termination, your right to use 
          the App ceases immediately. Wallet balances may be forfeited in cases of fraud.
          {'\n'}10.4. <Text style={styles.bold}>Survival:</Text> Provisions relating to intellectual property, 
          disclaimers, and limitations of liability survive termination.
        </Text>

        {/* SECTION 11 */}
        <Text style={styles.section}>11. DISCLAIMER OF WARRANTIES</Text>
        <Text style={styles.text}>
          11.1. THE APP IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND.
          {'\n'}11.2. WE DO NOT GUARANTEE THAT THE APP WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
          {'\n'}11.3. WE ARE NOT RESPONSIBLE FOR ANY LOSS OF DATA, CONTENT, OR FUNDS.
          {'\n'}11.4. WE DO NOT ENDORSE ANY USER-GENERATED CONTENT.
        </Text>

        {/* SECTION 12 */}
        <Text style={styles.section}>12. LIMITATION OF LIABILITY</Text>
        <Text style={styles.text}>
          12.1. TO THE MAXIMUM EXTENT PERMITTED BY LAW, JANS TECH SHALL NOT BE LIABLE FOR ANY INDIRECT, 
          INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.
          {'\n'}12.2. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU HAVE PAID US IN THE PAST 12 MONTHS.
          {'\n'}12.3. WE ARE NOT LIABLE FOR DISPUTES BETWEEN USERS.
          {'\n'}12.4. WE ARE NOT LIABLE FOR LOSSES RESULTING FROM UNAUTHORIZED ACCOUNT ACCESS.
        </Text>

        {/* SECTION 13 */}
        <Text style={styles.section}>13. INDEMNIFICATION</Text>
        <Text style={styles.text}>
          You agree to indemnify and hold harmless Jans Tech, its officers, directors, employees, and agents 
          from any claims, damages, or expenses arising from your use of the App or violation of these Terms.
        </Text>

        {/* SECTION 14 */}
        <Text style={styles.section}>14. GOVERNING LAW</Text>
        <Text style={styles.text}>
          14.1. These Terms are governed by the laws of the Republic of Kenya.
          {'\n'}14.2. Any disputes shall be resolved in Kenyan courts.
          {'\n'}14.3. Users agree to submit to the jurisdiction of Kenyan courts.
        </Text>

        {/* SECTION 15 */}
        <Text style={styles.section}>15. DISPUTE RESOLUTION</Text>
        <Text style={styles.text}>
          15.1. Users are encouraged to contact us first to resolve disputes amicably.
          {'\n'}15.2. If resolution is not reached, disputes may be referred to mediation.
          {'\n'}15.3. As a last resort, disputes shall be resolved in Kenyan courts.
        </Text>

        {/* SECTION 16 */}
        <Text style={styles.section}>16. CHANGES TO TERMS</Text>
        <Text style={styles.text}>
          16.1. We reserve the right to modify these Terms at any time.
          {'\n'}16.2. Users will be notified of material changes via the App or email.
          {'\n'}16.3. Continued use after changes constitutes acceptance of new Terms.
          {'\n'}16.4. If you disagree with changes, you must stop using the App.
        </Text>

        {/* SECTION 17 */}
        <Text style={styles.section}>17. CONTACT INFORMATION</Text>
        <Text style={styles.text}>
          For questions about these Terms:
          {'\n'}📧 Email: mwolobijavanson@gmail.com
          {'\n'}💬 WhatsApp: +254 784 095 825
          {'\n'}📞 Phone: +254 784 095 825 / +254 115 995 514
          {'\n'}🏢 Company: Jans Tech
          {'\n'}📍 Location: Kenya
          {'\n'}👨‍💻 Developer: Mwolobi Javanson
        </Text>

        {/* Agree Button (shown during signup) */}
        {showAgreeButton && onAgree && (
          <TouchableOpacity style={styles.agreeBtn} onPress={onAgree}>
            <Text style={styles.agreeBtnText}>✅ I Agree to the Terms of Service</Text>
          </TouchableOpacity>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerMain}>© 2026 Jans Tech. All Rights Reserved.</Text>
          <Text style={styles.footerSub}>Developed by Mwolobi Javanson</Text>
          <Text style={styles.footerSub}>Un-locka v{APP_INFO.version}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    paddingTop: 50, padding: SPACING.md 
  },
  backBtn: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
  headerTitle: { color: '#FFF', fontSize: FONTS.sizes.lg, fontWeight: 'bold' },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxl },
  lastUpdated: { 
    fontSize: FONTS.sizes.xs, color: COLORS.gray, textAlign: 'center', 
    marginBottom: 4, fontStyle: 'italic' 
  },
  effective: { 
    fontSize: FONTS.sizes.xs, color: COLORS.gray, textAlign: 'center', 
    marginBottom: SPACING.lg 
  },
  section: { 
    fontSize: FONTS.sizes.md, fontWeight: 'bold', color: COLORS.dark, 
    marginTop: SPACING.lg, marginBottom: SPACING.sm 
  },
  text: { 
    fontSize: FONTS.sizes.sm, color: COLORS.darkGray, lineHeight: 22, 
    marginBottom: SPACING.sm 
  },
  bold: { fontWeight: 'bold', color: COLORS.dark },
  agreeBtn: {
    backgroundColor: '#4CAF50', padding: SPACING.md, borderRadius: 12,
    alignItems: 'center', marginVertical: SPACING.lg, ...SHADOWS.medium
  },
  agreeBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: FONTS.sizes.md },
  footer: { 
    marginTop: SPACING.xl, paddingTop: SPACING.lg, 
    borderTopWidth: 1, borderTopColor: '#E0E0E0', alignItems: 'center' 
  },
  footerMain: { fontSize: FONTS.sizes.sm, fontWeight: 'bold', color: COLORS.dark, marginBottom: 4 },
  footerSub: { fontSize: FONTS.sizes.xs, color: COLORS.gray, marginBottom: 2 },
});

export default TermsOfService;
