# 🎡 Boraq Spin-to-Win – README

A modern React-based spin-to-win system with glassmorphism design for Boraq's booth marketing campaign featuring Google authentication and automated lead capture.

## 📌 Overview

* Visitors scan a **QR code** at the booth
* Redirected to a **Spinner Web App** with glassmorphism UI
* Must **Sign in with Google** before playing
* Each **email gets only 1 spin** (enforced)
* **Spin result + user's email** automatically logged into **Google Sheet** for lead generation

## 🎨 Design Guidelines

### Theme Requirements
- **Primary Theme**: Glassmorphism (Glass Theme)
- **Color Palette**: Black and white combination
    - Primary Black: `#000000`
    - Primary White: `#FFFFFF`
    - Glass Background: `rgba(255, 255, 255, 0.1)`
    - Glass Border: `rgba(255, 255, 255, 0.2)`
    - Backdrop Blur: `blur(10px)`

### Visual Style
- Use frosted glass effects with `backdrop-filter: blur()`
- Semi-transparent overlays with subtle borders
- Smooth animations and transitions
- Clean, modern typography
- Subtle shadows and gradients

### CSS Glass Effect Example
```css
.glass-container {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

## 🚀 Tech Stack

- **Frontend Framework**: React.js (Latest version)
- **Build Tool**: Vite or Next.js
- **Styling**: TailwindCSS + Custom Glass CSS
- **Authentication**: Firebase Auth (Google sign-in)
- **Database/Logging**: Google Sheets API
- **Deployment**: Vercel or Netlify
- **Language**: JavaScript (ES6+)

## 🔧 Core Features

### 1. QR Code Integration
- Generate QR code pointing to spinner website
- Example: `https://boraq-spin.vercel.app/`
- Mobile-optimized landing page

### 2. Google Authentication
- Firebase Authentication for Google sign-in
- Capture user's name and email
- Secure authentication flow

### 3. One-Spin Limit System
- Check if email exists in Google Sheet before allowing spin
- **If email found** → Show message: *"You already used your spin!"*
- **If email not found** → Allow one spin only
- Disable spin button after use

### 4. Spin Wheel Mechanics
- Interactive spinning wheel with 7 prize slices
- Smooth rotation animations with easing
- Random result selection with weighted probabilities
- Visual feedback and prize announcement

### 5. Google Sheets Integration
- Real-time data logging via Google Sheets API
- Automated lead capture and storage
- Secure API key management

### 6. Prize Management
- Dynamic prize configuration
- Instant prize display after spin
- Prize redemption instructions

## 🎁 Prize List & Configuration

### Available Prizes (7 Slices)
1. **Keyring (Single)** - 14% chance
2. **Keyring (Double Win!)** - 14% chance
3. **Discount – 20% Off** - 18% chance
4. **Discount – 50% Off (Big Win)** - 10% chance
5. **৳2000 OFF Voucher** (Web & App OR UI & Branding) - 14% chance
6. **Free 1-Page Landing Website** - 10% chance
7. **Try Again / No Win** (give brochure) - 20% chance

### Prize Rationale
- Common wins (Keyrings, 20% off) keep engagement high
- Rare big wins (50% off, Free website) create excitement
- Safety margin on high-value freebies maintains budget control

## 📂 Recommended File Structure

```
boraq-spin-to-win/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   ├── qr-code.png
│   └── assets/
│       ├── images/
│       │   ├── logo.png
│       │   ├── wheel-bg.png
│       │   └── prizes/
│       └── sounds/
│           ├── spin.mp3
│           └── win.mp3
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── GoogleAuth.jsx
│   │   │   └── AuthGuard.jsx
│   │   ├── Spinner/
│   │   │   ├── SpinWheel.jsx
│   │   │   ├── WheelSlice.jsx
│   │   │   └── SpinButton.jsx
│   │   ├── UI/
│   │   │   ├── GlassContainer.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── Modal.jsx
│   │   ├── Prize/
│   │   │   ├── PrizeDisplay.jsx
│   │   │   └── PrizeModal.jsx
│   │   └── Layout/
│   │       ├── Header.jsx
│   │       ├── Footer.jsx
│   │       └── Layout.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useSpinner.js
│   │   ├── useGoogleSheets.js
│   │   └── useLocalStorage.js
│   ├── services/
│   │   ├── firebase.js
│   │   ├── googleSheets.js
│   │   ├── prizeLogic.js
│   │   └── api.js
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── validation.js
│   ├── styles/
│   │   ├── globals.css
│   │   ├── glass.css
│   │   └── animations.css
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Spinner.jsx
│   │   ├── Result.jsx
│   │   └── NotFound.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── SpinContext.jsx
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── .env.local
├── .gitignore
├── package.json
├── vite.config.js
├── tailwind.config.js
├── README.md
└── vercel.json
```

## 📊 Data Structure (Google Sheets)

### Sheet Columns
```
| Timestamp | Name | Email | Prize Won | UID | SpinID | Source | Status | Notes |
```

### Example Data
```
2025-01-15 10:45AM | Tanvir Ahmed | tanvir@gmail.com | Free 1-Page Website | abc123 | spin001 | BoothAUST | Won | Contacted
2025-01-15 10:47AM | Sarah Khan | sarah@gmail.com | Keyring (Double) | def456 | spin002 | BoothAUST | Won | Collected
```

## 📂 Basic Workflow

1. **QR Scan** → Visitor scans QR code → Opens spinner website
2. **Authentication** → User signs in with Google account
3. **Eligibility Check** → System checks email in Google Sheet:
    - ✅ **Email not found** → Allow spin → Save result
    - ❌ **Email found** → Show "Already used your spin" message
4. **Spinning** → User clicks spin → Wheel rotates → Prize revealed
5. **Data Logging** → Email + Prize + Timestamp saved to Google Sheet
6. **Prize Display** → Show winning message with next steps

## ⚙️ Environment Variables

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id

# Google Sheets API
VITE_GOOGLE_SHEETS_API_KEY=your_sheets_api_key
VITE_GOOGLE_SHEET_ID=your_sheet_id

# App Configuration
VITE_APP_URL=https://boraq-spin.vercel.app
```

## ✅ Development Checklist

### Setup Phase
- [ ] Initialize React project with Vite
- [ ] Install and configure TailwindCSS
- [ ] Set up Firebase project and authentication
- [ ] Create Google Sheets API credentials
- [ ] Implement glassmorphism theme components

### Core Development
- [ ] Build Google Authentication flow
- [ ] Create spinning wheel component with animations
- [ ] Implement prize logic and probabilities
- [ ] Connect Google Sheets API for data logging
- [ ] Add one-spin-per-email validation
- [ ] Design responsive glassmorphism UI

### Testing & Deployment
- [ ] Test authentication flow thoroughly
- [ ] Verify spin mechanics and prize distribution
- [ ] Test Google Sheets integration
- [ ] Cross-browser and mobile testing
- [ ] Generate and test QR code
- [ ] Deploy to production (Vercel/Netlify)

### Pre-Event
- [ ] Print QR codes for booth setup
- [ ] Prepare prize inventory
- [ ] Brief booth staff on system usage
- [ ] Set up monitoring and analytics

## 🔒 Security Considerations

- Store API keys securely (never in public code)
- Use environment variables for sensitive data
- Implement rate limiting to prevent abuse
- Validate all user inputs
- Use HTTPS for all communications
- Regularly rotate API keys

## 🎯 Success Metrics

- **Lead Capture**: Email addresses collected
- **Engagement Rate**: Spin completion vs. visits
- **Prize Distribution**: Track actual vs. expected odds
- **User Experience**: Mobile responsiveness and load times
- **Conversion**: Follow-up success rate from captured leads

## 🚀 Quick Start

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and fill in your keys
4. Start development server: `npm run dev`
5. Build for production: `npm run build`
6. Deploy: `npm run deploy`

## 📞 Support & Contact

For technical issues or questions about the Boraq Spin-to-Win system, please contact the development team or create an issue in the project repository.

---

⚡ **With this setup, Boraq will collect high-quality leads, ensure fair play (1 spin per person), and showcase professionalism through a modern glassmorphism interface.**