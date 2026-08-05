

## 📖 Overview

Un-locka is a comprehensive messaging and content monetization mobile app built with React Native and Expo. It features WhatsApp-style chat, Instagram Reels-style creators, View Once paid content, and a full wallet system.

### Quick Stats
- **15+ Screens**
- **40+ Components**
- **25+ Services**
- **100+ Features**

---

## ✨ Features

### 💬 Chat System
- End-to-end encrypted messaging
- Text, image, video, audio messages
- Voice notes (up to 30 minutes)
- Document sharing
- Location sharing
- Contact sharing
- Polls
- Message reactions (❤️😂😮😢😡)
- Reply, forward, delete
- Star messages
- Pin chats
- Mute notifications
- Archive chats
- Read receipts (✓✓)
- Typing indicators
- Online status
- Chat wallpapers
- Disappearing messages

### 💎 View Once
- Send photo/video that disappears
- Set price (KSH 20-500)
- E2E encrypted
- Anti-screenshot protection
- 90% earnings to sender
- Auto-delete after viewing
- 48-hour expiry

### 📊 Status
- Text, photo, video status
- 24-hour auto-expire
- Privacy controls
- View counts
- Reactions & replies
- Status highlights

### 🎬 Creators (Reels)
- Full-screen video feed
- Like, comment, share
- Follow creators
- 10 categories
- Music integration
- Hashtags
- Save videos

### 💰 Wallet
- Balance tracking
- Transaction history
- M-Pesa withdrawals
- Referral system (KSH 20/referral)
- Share via WhatsApp, SMS, Email, Telegram

### 🛡️ Security
- End-to-end encryption
- Biometric login
- App passcode
- Anti-screenshot
- Watermark
- 2FA support

### 👑 Admin Dashboard
- 70 admin privileges
- User management
- Content moderation
- Platform analytics
- Broadcast messages
- System health monitoring

---

## 🚀 Installation

```bash
# 1. Clone repository
git clone https://github.com/yourusername/unlocka-frontend.git
cd unlocka-frontend

# 2. Install dependencies
npm install

# 3. Start development server
npx expo start

# 4. Run on device
# Scan QR code with Expo Go app
# OR press 'a' for Android
# OR press 'i' for iOS
# OR press 'w' for web
```

---

📁 Project Structure

```
Un-locka/
├── App.tsx                    # Main application entry
├── app.json                   # Expo configuration
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
├── assets/                    # Images, fonts
└── src/
    ├── screens/               # Screen components
    │   ├── HomeScreen.tsx
    │   ├── LoginScreen.tsx
    │   ├── ChatListScreen.tsx
    │   ├── ChatScreen.tsx
    │   ├── StatusListScreen.tsx
    │   ├── CreatorsScreen.tsx
    │   ├── WalletScreen.tsx
    │   ├── SettingsScreen.tsx
    │   ├── HelpScreen.tsx
    │   ├── AboutScreen.tsx
    │   ├── AdminDashboard.tsx
    │   ├── ProfileScreen.tsx
    │   ├── SearchScreen.tsx
    │   ├── NotificationsScreen.tsx
    │   └── legal/
    │       ├── TermsOfService.tsx
    │       ├── PrivacyPolicy.tsx
    │       └── CopyrightNotice.tsx
    │
    ├── components/            # Reusable components
    │   ├── HeaderBar.tsx
    │   ├── HamburgerMenu.tsx
    │   ├── BottomNavBar.tsx
    │   ├── Toast.tsx
    │   ├── LoadingOverlay.tsx
    │   ├── InputField.tsx
    │   ├── Button.tsx
    │   ├── Footer.tsx
    │   ├── MarqueeText.tsx
    │   ├── TermsCheckbox.tsx
    │   ├── PinLock.tsx
    │   ├── TrustedDevice.tsx
    │   ├── ActivityLog.tsx
    │   ├── QuickActions.tsx
    │   ├── LegalLinks.tsx
    │   ├── chat/
    │   │   ├── ChatBubble.tsx
    │   │   ├── PaidMediaBubble.tsx
    │   │   ├── CallButtons.tsx
    │   │   ├── ChatStats.tsx
    │   │   ├── ArchivedChats.tsx
    │   │   └── MediaDownloadButton.tsx
    │   ├── viewOnce/
    │   │   ├── ViewOnceList.tsx
    │   │   ├── ViewOnceViewer.tsx
    │   │   ├── SendViewOnceScreen.tsx
    │   │   ├── CameraRecorder.tsx
    │   │   └── ExpiryTimer.tsx
    │   ├── status/
    │   │   ├── StatusViewer.tsx
    │   │   ├── StatusHighlights.tsx
    │   │   ├── StatusPrivacyModal.tsx
    │   │   ├── StatusScheduler.tsx
    │   │   └── StatusMentions.tsx
    │   └── creators/
    │       ├── CreatorPaywall.tsx
    │       └── VideoDownloadButton.tsx
    │
    ├── services/              # API services
    │   ├── api.ts
    │   ├── localMockData.ts
    │   ├── walletService.ts
    │   ├── viewOnceService.ts
    │   ├── adminService.ts
    │   ├── contactService.ts
    │   ├── creatorsService.ts
    │   ├── notificationService.ts
    │   ├── themeService.ts
    │   ├── i18nService.ts
    │   ├── appLockService.ts
    │   ├── e2eEncryption.ts
    │   └── googleAuth.ts
    │
    ├── types/                 # TypeScript types
    │   ├── index.ts
    │   ├── chat.ts
    │   ├── status.ts
    │   ├── viewOnce.ts
    │   ├── wallet.ts
    │   ├── admin.ts
    │   └── creators.ts
    │
    ├── context/               # React contexts
    │   └── ThemeContext.tsx
    │
    ├── constants/             # Constants
    │   └── theme.ts
    │
    └── utils/                 # Utilities
        ├── validators.ts
        ├── permissions.ts
        └── mediaDownloader.ts
```

---

📦 Dependencies

Core

· react-native - Mobile framework
· expo - Development platform
· typescript - Type safety

Navigation

· @react-navigation/native - Navigation
· @react-navigation/stack - Stack navigator

UI Components

· expo-linear-gradient - Gradient backgrounds
· expo-camera - Camera access
· expo-image-picker - Media picker
· expo-document-picker - File picker
· expo-av - Audio/video playback
· expo-contacts - Contacts access
· expo-location - GPS location
· expo-notifications - Push notifications
· expo-clipboard - Clipboard
· expo-sharing - Share files
· expo-file-system - File operations
· expo-media-library - Save to gallery
· expo-local-authentication - Biometrics

State & Storage

· @react-native-async-storage/async-storage - Local storage

---

⚙️ Configuration

app.json

```json
{
  "expo": {
    "name": "Un-locka",
    "slug": "un-locka",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "scheme": "unlocka",
    "plugins": [
      "expo-camera",
      "expo-media-library",
      "expo-contacts",
      "expo-location",
      "expo-notifications"
    ]
  }
}
```

API Configuration

Edit src/services/api.ts:

```typescript
const API_URL = 'http://localhost:8000/api/v1';
const USE_MOCK = false; // Set true for offline testing
```

---

🧪 Testing

Mock Data

Set USE_MOCK = true in src/services/api.ts to use local mock data without backend.

Test Accounts

Account Email Password
User usertest@unlocka.app Test1234
Admin admintest@unlocka.app Test1234

---

🏗️ Building

Android

```bash
expo build:android
# or
eas build --platform android
```

iOS

```bash
expo build:ios
# or
eas build --platform ios
```

Web

```bash
expo build:web
```

---

👨‍💻 Developer

Mwolobi Javanson - Lead Developer & Founder

· Email: mwolobijavanson@gmail.com
· WhatsApp: +254 784 095 825

---

🏢 Company

Jans Tech - Innovating for Tomorrow

Founded 2026 | Kenya 🇰🇪

---

📄 License

Copyright © 2026 Jans Tech. All Rights Reserved.

---



Built with ❤️ in Kenya 🇰🇪

© 2026 Jans Tech. All Rights Reserved.

</div>
EOF

echo "✅ Complete README created for frontend"

```

## QUICK PUSH TO GITHUB
```bash
# Push backend with README
cd ~/unlocka
git add README.md
git commit -m "Add comprehensive README documentation"
git push origin main

# Push frontend with README
cd
