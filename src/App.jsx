import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import GoogleAuth from './components/Auth/GoogleAuth';
import SpinWheel from './components/Spinner/SpinWheel';
import PrizeModal from './components/Prize/PrizeModal';
import { checkEmailExists, logSpinResult } from './services/googleSheets';
import { signOutUser } from './services/firebase';
import './App.css';

// Main App Content Component
const AppContent = () => {
  const { user, loading } = useAuth();
  const [hasSpun, setHasSpun] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [showPrizeModal, setShowPrizeModal] = useState(false);
  const [wonPrize, setWonPrize] = useState(null);
  const [error, setError] = useState('');

  // Check if user has already spun when they authenticate
  useEffect(() => {
    const checkUserEligibility = async () => {
      if (user?.email) {
        setIsCheckingEmail(true);
        try {
          const emailExists = await checkEmailExists(user.email);
          setHasSpun(emailExists);
        } catch (err) {
          console.error('Error checking email:', err);
          setError('Unable to verify spin status. Please try again.');
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

    // Log the result to Google Sheets
    try {
      await logSpinResult(user, prize.name);
      console.log('Spin result logged successfully');
    } catch (err) {
      console.error('Failed to log spin result:', err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setHasSpun(false);
      setWonPrize(null);
      setError('');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card">
          <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto"></div>
          <p className="text-glass-text mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - show login
  if (!user) {
    return <GoogleAuth />;
  }

  // Authenticated - show main app
  return (
    <div className="min-h-screen relative">
      {/* Header */}
      <motion.header
        className="absolute top-0 left-0 right-0 z-10 p-4"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          {/* Brand */}
          <div className="glass-container px-4 py-2">
            <h1 className="text-xl font-bold text-white">🎡 Boraq Spin-to-Win</h1>
          </div>

          {/* User Info & Sign Out */}
          <div className="glass-container px-4 py-2 flex items-center space-x-3">
            {user.photo && (
              <img
                src={user.photo}
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
            )}
            <div className="text-right hidden sm:block">
              <p className="text-white text-sm font-medium">
                {user.name || 'User'}
              </p>
              <p className="text-glass-text text-xs">
                {user.email}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="text-glass-text hover:text-white transition-colors text-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="pt-20">
        {/* Error Message */}
        {error && (
          <motion.div
            className="max-w-md mx-auto mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
            <button
              onClick={() => setError('')}
              className="ml-2 text-red-300 hover:text-red-100"
            >
              ✕
            </button>
          </motion.div>
        )}

        {/* Checking Email State */}
        {isCheckingEmail ? (
          <div className="min-h-screen flex items-center justify-center">
            <div className="glass-card text-center">
              <div className="animate-pulse-glass w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">📧</span>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">
                Checking your spin status...
              </h2>
              <p className="text-glass-text">
                We're verifying if you've already used your spin.
              </p>
            </div>
          </div>
        ) : hasSpun ? (
          // Already Spun - Show Message
          <div className="min-h-screen flex items-center justify-center">
            <motion.div
              className="glass-card max-w-md text-center"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-6xl mb-4">🎯</div>
              <h2 className="text-2xl font-bold text-yellow-400 mb-4">
                You've Already Spun!
              </h2>
              <p className="text-glass-text mb-6">
                You've already used your one spin with this email address:
                <br />
                <span className="font-semibold text-white">{user.email}</span>
              </p>
              <p className="text-sm text-gray-400 mb-6">
                Each email address gets only one spin to ensure fairness for everyone!
              </p>

              {/* Contact Info */}
              <div className="glass-container p-4 bg-glass-secondary">
                <h3 className="font-semibold text-white mb-2">📞 Contact Boraq:</h3>
                <p className="text-sm text-glass-text">
                  🌐 Website: boraq.com.bd<br/>
                  📧 Email: info@boraq.com.bd<br/>
                  📍 Visit our booth for more info!
                </p>
              </div>
            </motion.div>
          </div>
        ) : (
          // Can Spin - Show Wheel
          <SpinWheel
            onSpinComplete={handleSpinComplete}
            disabled={isCheckingEmail}
          />
        )}
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
        className="absolute bottom-0 left-0 right-0 p-4 text-center"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <div className="glass-container inline-block px-4 py-2">
          <p className="text-xs text-glass-text">
            ⚡ Powered by Boraq • One spin per person • Secure & Fair
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
