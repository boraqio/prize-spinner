// Professional Google Authentication component following Boraq brand guidelines
import { useState } from 'react';
import { signInWithGoogle } from '../../services/firebase';
import { motion } from 'framer-motion';
import { Shield, Zap, Gift, Chrome, Lock } from 'lucide-react';
import boraqLogo from '../../assets/boraq_logo_light.png';

const GoogleAuth = ({ onAuthSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await signInWithGoogle();
      if (result.success) {
        onAuthSuccess?.(result.user);
      } else {
        setError(result.error || 'Failed to sign in with Google');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen max-h-screen overflow-hidden flex items-center justify-center p-3 md:p-4 relative z-10">
      <motion.div
        className="glass-card max-w-md w-full text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Brand Logo - Following Brand Guidelines */}
        <motion.div
          className="mb-4 md:mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex items-center justify-center mb-4">
            <img
              src={boraqLogo}
              alt="Boraq Logo"
              className="h-10 md:h-14 object-contain"
              style={{ minHeight: '28px' }}
            />
          </div>
          <h2 className="text-lg md:text-xl font-medium text-boraq-primary flex items-center justify-center space-x-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            <Gift className="w-5 h-5 text-boraq-mint" />
            <span>Spin-to-Win</span>
          </h2>
        </motion.div>

        {/* Welcome Message */}
        <motion.div
          className="mb-4 md:mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <p className="text-boraq-text mb-2 md:mb-3 text-sm md:text-base" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Welcome to Boraq's exclusive prize wheel!
          </p>
          <p className="text-xs md:text-sm text-boraq-gray flex items-center justify-center space-x-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
            <Lock className="w-4 h-4 text-boraq-mint" />
            <span>Sign in with Google to spin and win amazing prizes!</span>
          </p>
        </motion.div>

        {/* Sign In Button */}
        <motion.button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="boraq-button w-full py-3 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base group relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin">
                <Chrome className="w-5 h-5" />
              </div>
              <span>Signing in...</span>
            </div>
          ) : (
            <>
              <Chrome className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Sign in with Google</span>
            </>
          )}
        </motion.button>

        {/* Error Message */}
        {error && (
          <motion.div
            className="mt-3 p-2 md:p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-xs md:text-sm flex items-center space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Shield className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Features - Following Brand Guidelines */}
        <motion.div
          className="mt-4 md:mt-6 pt-4 border-t border-boraq-mint/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <div className="grid grid-cols-3 gap-2 md:gap-3 text-center">
            <div className="text-boraq-text group">
              <div className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-1 md:mb-2 bg-boraq-mint/20 rounded-full flex items-center justify-center group-hover:bg-boraq-mint/30 transition-colors">
                <Shield className="w-4 h-4 md:w-5 md:h-5 text-boraq-primary" />
              </div>
              <p className="text-xs font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>Secure</p>
            </div>
            <div className="text-boraq-text group">
              <div className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-1 md:mb-2 bg-boraq-mint/20 rounded-full flex items-center justify-center group-hover:bg-boraq-mint/30 transition-colors">
                <Zap className="w-4 h-4 md:w-5 md:h-5 text-boraq-primary" />
              </div>
              <p className="text-xs font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>Fast</p>
            </div>
            <div className="text-boraq-text group">
              <div className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-1 md:mb-2 bg-boraq-mint/20 rounded-full flex items-center justify-center group-hover:bg-boraq-mint/30 transition-colors">
                <Gift className="w-4 h-4 md:w-5 md:h-5 text-boraq-primary" />
              </div>
              <p className="text-xs font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>Fair</p>
            </div>
          </div>
        </motion.div>

        {/* Terms */}
        <motion.div
          className="mt-3 md:mt-4 text-xs text-boraq-gray text-center flex items-center justify-center space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          style={{ fontFamily: 'Roboto, sans-serif' }}
        >
          <span>One spin per email</span>
          <span>•</span>
          <span>Terms apply</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default GoogleAuth;
