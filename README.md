I'll create a comprehensive README for your Un-locka backend. Here's the complete documentation:

```bash
cd ~/unlocka

cat > README.md << 'EOF'
# 🔓 Un-locka Backend API

<div align="center">

![Un-locka](https://img.shields.io/badge/Un--locka-Backend-6C63FF?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.10+-blue?style=for-the-badge&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-009688?style=for-the-badge&logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?style=for-the-badge&logo=postgresql)
![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)

**Complete Backend for Un-locka Messaging & Content Monetization Platform**

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Authentication](#authentication)
- [Features](#features)
- [Security](#security)
- [Payment Integration](#payment-integration)
- [WebSocket Events](#websocket-events)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 📖 Overview

Un-locka is a revolutionary messaging and content monetization platform built with FastAPI. The backend provides a robust, secure, and scalable API for:

- **Secure Messaging** - End-to-end encrypted chat system
- **Content Monetization** - View Once content with payment integration
- **Social Features** - Status updates, Creator videos (Reels-style)
- **Payment Processing** - M-Pesa STK Push integration
- **Wallet System** - User earnings, withdrawals, and referrals
- **Admin Dashboard** - Comprehensive platform management

### Key Statistics
- **50+ API Endpoints**
- **30+ Database Tables**
- **70 Admin Privileges**
- **100+ Features**

---

## 🏗️ Architecture

```

┌─────────────────────────────────────────────────────────┐
│                     CLIENT (Mobile App)                  │
└────────────────────┬────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────┐
│                   FASTAPI APPLICATION                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────────┐ │
│  │  Routes  │ │  Models  │ │ Services │ │  Middleware  │ │
│  └──────────┘ └──────────┘ └──────────┘ └─────────────┘ │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────────┐ │
│  │ Schemas  │ │   Core   │ │   Auth   │ │   Socket.IO  │ │
│  └──────────┘ └──────────┘ └──────────┘ └─────────────┘ │
└────────────────────┬────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────┐
│                    POSTGRESQL DATABASE                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────────┐ │
│  │  Users   │ │  Chats   │ │  Wallet  │ │   Content   │ │
│  └──────────┘ └──────────┘ └──────────┘ └─────────────┘ │
└─────────────────────────────────────────────────────────┘

```

---

## 💻 Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Python** | 3.10+ | Programming Language |
| **FastAPI** | 0.104.1 | Web Framework |
| **Uvicorn** | 0.24.0 | ASGI Server |
| **SQLAlchemy** | 2.0.23 | ORM |
| **PostgreSQL** | 15+ | Database |
| **Socket.IO** | Latest | Real-time Communication |
| **Python-Jose** | 3.3.0 | JWT Authentication |
| **Passlib** | 1.7.4 | Password Hashing (bcrypt) |
| **Pydantic** | 2.5.0 | Data Validation |
| **Alembic** | 1.13.0 | Database Migrations |

---

## 📁 Project Structure

```

unlocka/
├── app/
│   ├── init.py
│   ├── main.py                 # FastAPI application entry point
│   │
│   ├── api/                    # API Route Handlers
│   │   ├── init.py
│   │   ├── signup.py           # User registration (3-step)
│   │   ├── auth.py             # Authentication & login
│   │   ├── payment.py          # M-Pesa payment processing
│   │   ├── chat_api.py         # Chat messaging
│   │   ├── status_api.py       # Status/stories
│   │   ├── view_once_api.py    # View once content
│   │   ├── creators_api.py     # Creator videos (Reels)
│   │   ├── wallet_api.py       # Wallet & withdrawals
│   │   ├── admin_api.py        # Admin dashboard (70 privileges)
│   │   ├── contacts_api.py     # Contact sync & mutual
│   │   ├── settings_api.py     # User settings
│   │   ├── notifications_api.py # Push notifications
│   │   ├── search_api.py       # Global search
│   │   ├── profile_api.py      # User profiles
│   │   ├── highlights_api.py   # Status highlights
│   │   ├── paid_media_api.py   # Paid chat media
│   │   ├── app_lock_api.py     # App lock/passcode
│   │   ├── keys_api.py         # Encryption keys
│   │   ├── view_once_admin.py  # Admin view once access
│   │   └── creator_subscription_api.py # Creator subscriptions
│   │
│   ├── models/                 # Database Models
│   │   ├── init.py
│   │   ├── user.py             # User model
│   │   ├── chat.py             # Chat, messages, view once, creators
│   │   ├── wallet.py           # Wallet transactions
│   │   ├── contact.py          # Contacts & blocking
│   │   └── notification.py     # Push notification tokens
│   │
│   ├── services/               # Business Logic
│   │   ├── init.py
│   │   ├── user_service.py     # User management
│   │   ├── auth_service.py     # Authentication logic
│   │   ├── payment_service.py  # M-Pesa integration
│   │   ├── chat_socket.py      # WebSocket chat server
│   │   ├── referral_service.py # Referral system
│   │   ├── translate_service.py # Message translation
│   │   ├── encryption_service.py # E2E encryption
│   │   ├── bot_service.py      # Chat bots
│   │   ├── privacy_service.py  # Privacy settings
│   │   ├── bookmark_service.py # Bookmarks & export
│   │   ├── status_services.py  # Status insights, polls
│   │   ├── view_once_service.py # View once operations
│   │   └── mock_data.py        # Test data generator
│   │
│   ├── core/                   # Core Configuration
│   │   ├── init.py
│   │   ├── config.py           # App configuration
│   │   ├── database.py         # Database connection
│   │   └── security.py         # Security utilities
│   │
│   ├── middleware/              # Middleware
│   │   ├── init.py
│   │   ├── admin_middleware.py # Admin access control
│   │   └── rate_limit.py      # Rate limiting
│   │
│   └── templates/              # HTML Templates
│       ├── index.html
│       ├── signup.html
│       └── login.html
│
├── uploads/                    # Uploaded files
│   ├── chat/                   # Chat media
│   ├── status/                 # Status media
│   ├── creators/               # Creator videos
│   └── avatars/                # Profile pictures
│
├── requirements.txt            # Python dependencies
├── .env                        # Environment variables
├── README.md                   # This file
└── run.sh                      # Startup script

```

---

## 🚀 Installation

### Prerequisites

```bash
# Install Python 3.10+
pkg install python -y

# Install PostgreSQL
pkg install postgresql -y

# Install required system packages
pkg install build-essential python-dev -y
```

Setup Steps

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/unlocka-backend.git
cd unlocka-backend

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate     # Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. Setup PostgreSQL
# Start PostgreSQL
pg_ctl -D ~/postgres_data -l ~/postgres_data/logfile start

# Create database
createdb unlockadb

# 5. Configure environment
cp .env.example .env
# Edit .env with your settings

# 6. Initialize database
python -c "from app.core.database import Base, engine; Base.metadata.create_all(bind=engine)"

# 7. Create test data (optional)
python create_test_data.py

# 8. Start the server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Quick Start

```bash
# One command setup
chmod +x setup.sh && ./setup.sh
```

---

⚙️ Configuration

Environment Variables (.env)

```env
# Application
PROJECT_NAME=Un-locka
API_V1_PREFIX=/api/v1
SECRET_KEY=your-secret-key-here
DEBUG=True
ENVIRONMENT=development

# Database
DATABASE_URL=postgresql://localhost/unlockadb

# Admin Emails
ADMIN_EMAILS=mwolobijavanson@gmail.com,javansonwanjala@gmail.com

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@unlocka.app
SMTP_PASSWORD=your-app-password

# M-Pesa (Safaricom)
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_PASSKEY=your_passkey
MPESA_BUSINESS_SHORTCODE=174379
MPESA_CALLBACK_URL=https://your-domain.com/api/v1/payment/callback

# Security
JWT_SECRET_KEY=your-jwt-secret
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

---

📚 API Documentation

Base URL

```
http://localhost:8000/api/v1
```

Interactive Docs

· Swagger UI: http://localhost:8000/docs
· ReDoc: http://localhost:8000/redoc

API Categories

🔐 Authentication (6 endpoints)

Method Endpoint Description
POST /signup Register new user (Step 1 of 3)
POST /login User login
POST /logout User logout
POST /validate-session Validate session token
POST /refresh-token Refresh access token
POST /forgot-password Request password reset

💰 Payments (3 endpoints)

Method Endpoint Description
POST /payment/request Request STK Push (Step 2)
GET /payment/status/{id} Check payment status (Step 3)
POST /payment/callback M-Pesa callback webhook

💬 Chats (10+ endpoints)

Method Endpoint Description
GET /chats Get conversations
GET /chats/{id}/messages Get messages
POST /chats/{id}/send Send message
POST /chats/media/pay Pay for media
GET /chats/search Search messages
GET /chats/starred Get starred messages

💎 View Once (8 endpoints)

Method Endpoint Description
GET /view-once/inbox Unified inbox
POST /view-once/create Create view once
POST /view-once/pay Pay to view
GET /view-once/open/{id} Open content
DELETE /view-once/{id} Delete view once

📊 Status (6 endpoints)

Method Endpoint Description
GET /status Get statuses
POST /status/create Create status
POST /status/view Mark as viewed
POST /status/react React to status
DELETE /status/{id} Delete status

🎬 Creators (12 endpoints)

Method Endpoint Description
GET /creators/feed Video feed
POST /creators/upload Upload video
POST /creators/like Like video
POST /creators/comment Add comment
POST /creators/follow Follow creator
GET /creators/profile/{id} Creator profile

💰 Wallet (5 endpoints)

Method Endpoint Description
GET /wallet/info Wallet balance
GET /wallet/transactions Transaction history
POST /wallet/withdraw Request withdrawal
GET /wallet/referral Referral info

🛡️ Admin (40+ endpoints)

Method Endpoint Description
GET /admin/dashboard Dashboard stats
GET /admin/users Manage users
POST /admin/users/toggle-status Activate/deactivate
GET /admin/transactions View transactions
GET /admin/analytics Platform analytics
POST /admin/broadcast Broadcast message
GET /admin/system/health System health

---

🗄️ Database Schema

Core Tables

users

Column Type Description
id INTEGER Primary key
full_name VARCHAR(100) User's full name
username VARCHAR(50) Unique username
email VARCHAR(100) Unique email
phone VARCHAR(10) Phone number
hashed_password VARCHAR(200) Bcrypt hashed password
wallet_balance FLOAT Current balance
total_earned FLOAT Lifetime earnings
referral_code VARCHAR(10) Unique referral code
is_admin BOOLEAN Admin flag
is_active BOOLEAN Account status
created_at DATETIME Registration date

chats

Column Type Description
id VARCHAR(50) Chat ID
type VARCHAR(20) individual/group/broadcast
name VARCHAR(100) Chat name
disappearing_duration INTEGER Auto-delete timer

chat_messages

Column Type Description
id VARCHAR(50) Message ID
chat_id VARCHAR(50) Parent chat
sender_id INTEGER Message sender
type VARCHAR(20) text/image/video/audio
content TEXT Message content
status VARCHAR(20) sent/delivered/read
is_encrypted BOOLEAN E2E encryption flag

view_once_content

Column Type Description
id VARCHAR(50) Content ID
sender_id INTEGER Content creator
recipient_id INTEGER Intended viewer
type VARCHAR(20) image/video
amount FLOAT Price to view
status VARCHAR(20) pending/paid/viewed
expires_at DATETIME Auto-delete time

Complete Entity Relationship Diagram

```
users
├── chats (via chat_participants)
│   └── chat_messages
│       └── chat_paid_media
├── contacts
│   ├── contact_requests
│   └── blocked_contacts
├── wallet_transactions
├── withdrawal_requests
├── view_once_content (sender/recipient)
├── creator_videos
│   ├── video_likes
│   ├── video_comments
│   ├── video_saves
│   └── video_shares
├── creator_follows
├── user_statuses
│   └── status_views
├── notifications
├── push_tokens
├── privacy_settings
├── encryption_keys
└── login_history
```

---

🔐 Authentication

JWT Token Flow

```
1. User logs in → Server returns access_token + refresh_token
2. Access token expires after 24 hours
3. Refresh token valid for 30 days
4. Session tokens for persistent login
```

Password Requirements

· Minimum 8 characters
· At least 1 uppercase letter
· At least 1 lowercase letter
· At least 1 number
· At least 1 special character

Security Features

· Bcrypt password hashing (cost factor 12)
· JWT with HS256 algorithm
· Session management
· Rate limiting
· Account lockout after 5 failed attempts
· 2FA support
· Biometric login support

---

🔒 Security

Encryption

Layer Algorithm
Password Hashing bcrypt (12 rounds)
JWT Tokens HS256
E2E Messages AES-256-GCM
Key Exchange RSA-2048
Data at Rest AES-256

Security Headers

· CORS configured
· XSS protection
· CSRF protection
· Rate limiting
· Input sanitization
· SQL injection prevention (ORM)

Admin Security

· Only 2 specified emails can be admin
· All admin actions logged
· IP-based access control
· Session timeout

---

💳 Payment Integration

M-Pesa STK Push Flow

```
1. User initiates payment
2. Server sends STK Push request to Safaricom
3. User receives popup on phone
4. User enters M-Pesa PIN
5. Safaricom sends callback to server
6. Server confirms payment
7. Account activated/Content unlocked
```

Payment Types

Type Amount Distribution
Signup Fee KSH 40 Platform: 100%
View Once User-set Sender: 90%, Platform: 10%
Paid Media User-set Sender: 85%, Platform: 15%
Creator Access KSH 10 Platform: 100%
Withdrawal Fee 2% Platform: 100%

---

🔌 WebSocket Events

Chat Events

Event Direction Description
send_message Client→Server Send a message
new_message Server→Client Receive message
typing Bidirectional Typing indicator
message_status Server→Client Read receipts
delete_message Bidirectional Delete message
edit_message Bidirectional Edit message
react_message Bidirectional Add reaction

Connection

```javascript
const socket = io('http://localhost:8000', {
  auth: { token: 'your-jwt-token' },
  transports: ['websocket']
});
```

---

🧪 Testing

Create Test Data

```bash
python create_test_data.py
```

This creates:

· 2 test accounts (user & admin)
· Chat messages
· View once content
· Wallet transactions
· Creator videos
· Status updates

Test Accounts

Account Email Password
User usertest@unlocka.app Test1234
Admin admintest@unlocka.app Test1234

API Testing

```bash
# Test signup
curl -X POST http://localhost:8000/api/v1/signup \
  -d "full_name=Test User&username=test_user&email=test@test.com&phone=0712345678&password=Test@1234&confirm_password=Test@1234"

# Test login
curl -X POST http://localhost:8000/api/v1/login \
  -d "username=test_user&password=Test@1234"

# Health check
curl http://localhost:8000/health
```

---

🚀 Deployment

Production Setup

```bash
# 1. Set environment
export ENVIRONMENT=production
export DEBUG=False

# 2. Use production server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4

# 3. With Gunicorn (recommended)
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

Docker Deployment

```bash
# Build
docker build -t unlocka-backend .

# Run
docker run -d -p 8000:8000 --env-file .env unlocka-backend
```

Systemd Service

```ini
[Unit]
Description=Un-locka Backend
After=network.target postgresql.service

[Service]
User=unlocka
WorkingDirectory=/home/unlocka/backend
ExecStart=/home/unlocka/backend/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

---

👨‍💻 Developer

<div align="center">

Mwolobi Javanson

Lead Developer & Founder

https://img.shields.io/badge/Email-mwolobijavanson%40gmail.com-red?style=flat-square&logo=gmail
https://img.shields.io/badge/WhatsApp-%2B254784095825-green?style=flat-square&logo=whatsapp

</div>

---

🏢 Company

<div align="center">

Jans Tech

Innovating for Tomorrow

Founded: 2026 | Location: Kenya 🇰🇪

</div>

---

📄 License

```
Copyright © 2026 Jans Tech. All Rights Reserved.

This software is proprietary and confidential. Unauthorized copying,
modification, distribution, or use of this software is strictly prohibited.
```

---

📞 Support

Channel Contact
Email mwolobijavanson@gmail.com
WhatsApp +254 784 095 825
Phone +254 784 095 825 / +254 115 995 514
Telegram +254 115 995 514

---

🙏 Credits

· Developer: Mwolobi Javanson
· Company: Jans Tech
· Framework: FastAPI
· Database: PostgreSQL
· Payment: Safaricom M-Pesa
· Testers: Jans Tech Testing Team

---

<div align="center">

Built with ❤️ in Kenya 🇰🇪

© 2026 Jans Tech. All Rights Reserved.

</div>
EOF

echo "✅ Complete README created for backend"

```

## CREATE FRONTEND README
```bash
cd ~/Un-locka

cat > README.md << 'EOF'
# 🔓 Un-locka Mobile App

<div align="center">

![Un-locka](https://img.shields.io/badge/Un--locka-Frontend-6C63FF?style=for-the-badge)
![React Native](https://img.shields.io/badge/React_Native-0.73+-61DAFB?style=for-the-badge&logo=react)
![Expo](https://img.shields.io/badge/Expo-SDK_50-000020?style=for-the-badge&logo=expo)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript)
![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)

**Complete Mobile Frontend for Un-locka Platform**

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Screenshots](#screenshots)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Dependencies](#dependencies)
- [Configuration](#configuration)
- [Navigation](#navigation)
- [State Management](#state-management)
- [Testing](#testing)
- [Building](#building)
- [Contributing](#contributing)

---

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

<div align="center">

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
