import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import GoogleAuth from './components/Auth/GoogleAuth';
import SpinWheel from './components/Spinner/SpinWheel';
import PrizeModal from './components/Prize/PrizeModal';
import ModernBackground from './components/Background/LightningBackground';
import { checkEmailExists, logSpinResult } from './services/firebaseDatabase';
import { initializeFirestore } from './services/firestoreInit';
import { signOutUser } from './services/firebase';
import { User, LogOut, AlertCircle, CheckCircle, Loader, Crown } from 'lucide-react';
import boraqLogo from './assets/boraq_logo_light.png';
import './App.css';

// Main App Content Component
const AppContent = () => {
  const { user, loading } = useAuth();
  const [hasSpun, setHasSpun] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [showPrizeModal, setShowPrizeModal] = useState(false);
  const [wonPrize, setWonPrize] = useState(null);
  const [error, setError] = useState('');
  const [firestoreStatus, setFirestoreStatus] = useState('checking');

  // Initialize Firestore when app starts
  useEffect(() => {
    const initFirestore = async () => {
      const result = await initializeFirestore();
      if (result.success) {
        setFirestoreStatus('connected');
      } else {
        setFirestoreStatus('failed');
        if (result.code === 'permission-denied') {
          setError(result.userMessage || 'Database setup needed.');
        } else {
          setError(result.userMessage || 'Database connection failed.');
        }
      }
    };
    initFirestore();
  }, []);

  // Check if user has already spun when they authenticate
  useEffect(() => {
    const checkUserEligibility = async () => {
      if (user?.email) {
        setIsCheckingEmail(true);
        setError('');

        try {
          const result = await checkEmailExists(user.email);
          if (result.exists) {
            setHasSpun(true);
          } else {
            setHasSpun(false);
          }
        } catch (err) {
          setError('Unable to verify spin status. Please try again.');
          setHasSpun(false);
        } finally {
          setIsCheckingEmail(false);
        }
      }
    };
    checkUserEligibility();
  }, [user]);

  const handleSpinComplete = async (prize) => {
    setWonPrize(prize);
    setShowPrizeModal(true);
    setHasSpun(true);

    try {
      await logSpinResult(user, prize.name);
    } catch (err) {
      // Log error silently, don't interrupt user experience
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setHasSpun(false);
      setWonPrize(null);
      setError('');
    } catch (err) {
      // Handle error silently
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <ModernBackground />
        <div className="glass-card max-w-sm w-full mx-4 relative z-10">
          <Loader className="animate-spin w-12 h-12 text-boraq-primary mx-auto" />
          <p className="text-boraq-text mt-4 text-center">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - show login
  if (!user) {
    return (
      <div className="relative">
        <ModernBackground />
        <GoogleAuth />
      </div>
    );
  }

  // Authenticated - show main app
  return (
    <div className="min-h-screen max-h-screen overflow-hidden relative flex flex-col">
      <ModernBackground />

      {/* Header */}
      <motion.header
        className="relative z-10 p-2 md:p-3 flex-shrink-0"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-between items-center max-w-6xl mx-auto w-full">
          {/* Brand Logo Only - Following Brand Guidelines */}
          <div className="glass-container px-3 py-2 md:px-4 md:py-3 flex items-center h-12 md:h-14">
            <img
              src={boraqLogo}
              alt="Boraq Logo"
              className="h-5 md:h-8 object-contain"
              style={{ minHeight: '20px' }}
            />
          </div>

          {/* User Info & Sign Out */}
          <div className="glass-container px-2 py-2 md:px-3 md:py-3 flex items-center space-x-2 h-12 md:h-14">
            {user.photo ? (
              <img
                src={user.photo}
                alt={user.name}
                className="w-7 h-7 md:w-9 md:h-9 rounded-full flex-shrink-0"
              />
            ) : (
              <User className="w-7 h-7 md:w-9 md:h-9 text-white flex-shrink-0" />
            )}
            <div className="text-right hidden sm:block min-w-0">
              <p className="text-white text-xs md:text-sm font-medium truncate max-w-[100px] md:max-w-none">
                {user.name || 'User'}
              </p>
              <p className="text-white/80 text-xs truncate max-w-[100px] md:max-w-none">
                {user.email}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="text-white/80 hover:text-white transition-colors text-xs md:text-sm px-2 py-1 rounded hover:bg-white/10 flex items-center space-x-1 flex-shrink-0"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 px-3 md:px-4 relative z-10 flex flex-col overflow-hidden">
        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="max-w-md mx-auto mb-2 p-2 md:p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm flex items-start space-x-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <span>{error}</span>
                <button
                  onClick={() => setError('')}
                  className="ml-2 text-red-300 hover:text-red-100"
                >
                  ×
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status Messages */}
        <AnimatePresence>
          {firestoreStatus === 'checking' && (
            <motion.div
              className="max-w-md mx-auto mb-2 p-2 md:p-3 bg-boraq-mint/20 border border-boraq-mint/30 rounded-lg text-boraq-primary text-center text-sm flex items-center justify-center space-x-2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Loader className="w-4 h-4 animate-spin" />
              <span>Connecting to database...</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Area */}
        <div className="flex-1 flex items-center justify-center min-h-0 overflow-hidden">
          {/* Checking Email State */}
          {isCheckingEmail ? (
            <motion.div
              className="glass-card text-center max-w-sm w-full p-4 md:p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div className="w-10 md:w-12 h-10 md:h-12 rounded-full mx-auto mb-3 flex items-center justify-center bg-boraq-mint/20">
                <Loader className="w-5 md:w-6 h-5 md:h-6 animate-spin text-boraq-primary" />
              </div>
              <h2 className="text-base md:text-lg font-medium text-boraq-primary mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Checking your spin status...
              </h2>
              <p className="text-boraq-text text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                We're verifying if you've already used your spin.
              </p>
            </motion.div>
          ) : hasSpun ? (
            // Already Spun - Show Message
            <motion.div
              className="glass-card max-w-md text-center p-4 md:p-6"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full mx-auto mb-3 flex items-center justify-center bg-boraq-mint/20">
                <Crown className="w-6 h-6 md:w-7 md:h-7 text-boraq-primary" />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-boraq-primary mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                You've Already Spun!
              </h2>
              <p className="text-boraq-text mb-4 text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                You've already used your one spin with this email address:
                <br />
                <span className="font-semibold text-boraq-primary break-all text-xs">{user.email}</span>
              </p>
              <p className="text-xs text-boraq-gray mb-4" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Each email address gets only one spin to ensure fairness for everyone!
              </p>

              {/* Contact Info */}
              <div className="glass-container p-3 bg-boraq-light/10">
                <h3 className="font-semibold text-boraq-primary mb-2 text-sm flex items-center justify-center space-x-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  <CheckCircle className="w-4 h-4" />
                  <span>Contact Boraq:</span>
                </h3>
                <div className="text-xs text-boraq-text space-y-1" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  <p>Website: boraq.com.bd</p>
                  <p>Email: info@boraq.com.bd</p>
                  <p>Visit our booth for more info!</p>
                </div>
              </div>
            </motion.div>
          ) : (
            // Can Spin - Show Wheel
            <SpinWheel
              onSpinComplete={handleSpinComplete}
              disabled={isCheckingEmail}
            />
          )}
        </div>
      </main>

      {/* Prize Modal */}
      <PrizeModal
        isOpen={showPrizeModal}
        prize={wonPrize}
        userName={user?.name}
        onClose={() => setShowPrizeModal(false)}
      />

      {/* Footer */}
      <motion.footer
        className="relative z-10 p-2 md:p-3 text-center flex-shrink-0"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <div className="glass-container inline-block px-2 py-1 md:px-3 md:py-2">
          <p className="text-xs text-boraq-text flex items-center justify-center space-x-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
            <CheckCircle className="w-3 h-3" />
            <span>Powered by Boraq • One spin per person • Secure & Fair</span>
          </p>
        </div>
      </motion.footer>
    </div>
  );
};

// Main App Component with Provider
function App() {
  return (
    <AuthProvider>
      <div className="App">
        <AppContent />
      </div>
    </AuthProvider>
  );
}

export default App;
