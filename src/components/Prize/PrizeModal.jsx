// Enhanced Prize display modal following Boraq brand guidelines
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Gift, Star, Award, Phone, Mail, MapPin, Camera, X, CheckCircle, AlertCircle, Globe } from 'lucide-react';
import { getPrizeInstructions } from '../../services/prizeLogic';

const PrizeModal = ({ isOpen, prize, onClose, userName }) => {
  if (!isOpen || !prize) return null;

  const isWin = prize.value !== 'none';
  const instructions = getPrizeInstructions(prize);

  // Get appropriate icon based on prize value
  const getPrizeIcon = () => {
    switch (prize.value) {
      case 'premium':
        return <Trophy className="w-8 h-8 md:w-10 md:h-10 text-yellow-500" />;
      case 'high':
        return <Award className="w-8 h-8 md:w-10 md:h-10 text-purple-500" />;
      case 'medium':
        return <Star className="w-8 h-8 md:w-10 md:h-10 text-boraq-mint" />;
      case 'low':
        return <Gift className="w-8 h-8 md:w-10 md:h-10 text-boraq-primary" />;
      default:
        return <AlertCircle className="w-8 h-8 md:w-10 md:h-10 text-boraq-gray" />;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="glass-card max-w-lg w-full text-center max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0, rotateY: 180 }}
          animate={{ scale: 1, rotateY: 0 }}
          exit={{ scale: 0, rotateY: 180 }}
          transition={{ type: "spring", duration: 0.8 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-boraq-text hover:text-boraq-primary transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Celebration Animation */}
          {isWin && (
            <motion.div
              className="text-4xl md:text-6xl mb-4 flex justify-center"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{
                duration: 0.6,
                repeat: 2
              }}
            >
              <Trophy className="w-12 h-12 md:w-16 md:h-16 text-yellow-500" />
            </motion.div>
          )}

          {/* Result Header */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className={`text-2xl md:text-3xl font-bold mb-2 flex items-center justify-center space-x-2 ${
              isWin ? 'text-boraq-primary' : 'text-boraq-mint'
            }`} style={{ fontFamily: 'Poppins, sans-serif' }}>
              {isWin ? <Trophy className="w-6 h-6 md:w-8 md:h-8" /> : <Star className="w-6 h-6 md:w-8 md:h-8" />}
              <span>{isWin ? 'Congratulations!' : 'Thanks for Playing!'}</span>
            </h2>

            <p className="text-boraq-text mb-4 md:mb-6 text-sm md:text-base" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {userName ? `Hey ${userName.split(' ')[0]}!` : 'Hey there!'}
              {isWin ? ' You won:' : ' Better luck next time!'}
            </p>
          </motion.div>

          {/* Prize Details */}
          <motion.div
            className="glass-container p-4 md:p-6 mb-4 md:mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
          >
            {/* Prize Icon and Color */}
            <div
              className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mb-3 md:mb-4 mx-auto"
              style={{ backgroundColor: prize.color }}
            >
              {getPrizeIcon()}
            </div>

            {/* Prize Name */}
            <h3 className="text-lg md:text-xl font-semibold text-boraq-primary mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {prize.name}
            </h3>

            {/* Prize Description */}
            <p className="text-boraq-text mb-3 md:mb-4 text-sm md:text-base" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {prize.description}
            </p>

            {/* Prize Value Badge */}
            {prize.value !== 'none' && (
              <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs md:text-sm font-semibold ${
                prize.value === 'premium' ? 'bg-yellow-500/20 text-yellow-600 border border-yellow-500/30' :
                prize.value === 'high' ? 'bg-purple-500/20 text-purple-600 border border-purple-500/30' :
                prize.value === 'medium' ? 'bg-boraq-mint/20 text-boraq-primary border border-boraq-mint/30' :
                'bg-boraq-primary/20 text-boraq-primary border border-boraq-primary/30'
              }`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                <Award className="w-3 h-3" />
                <span>{prize.value.toUpperCase()} VALUE</span>
              </span>
            )}
          </motion.div>

          {/* Instructions */}
          <motion.div
            className="mb-4 md:mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <h4 className="text-base md:text-lg font-semibold text-boraq-primary mb-2 flex items-center justify-center space-x-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {isWin ? <Gift className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
              <span>{isWin ? 'How to Claim:' : 'What\'s Next:'}</span>
            </h4>
            <p className="text-boraq-text text-xs md:text-sm leading-relaxed px-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
              {instructions}
            </p>
          </motion.div>

          {/* Contact Info for Winners */}
          {isWin && prize.value !== 'low' && (
            <motion.div
              className="glass-container p-3 md:p-4 mb-4 md:mb-6 bg-boraq-light/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <h5 className="font-semibold text-boraq-primary mb-2 text-sm md:text-base flex items-center justify-center space-x-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                <Phone className="w-4 h-4" />
                <span>Contact Information:</span>
              </h5>
              <div className="text-xs md:text-sm text-boraq-text space-y-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                <div className="flex items-center justify-center space-x-2">
                  <Globe className="w-4 h-4 text-boraq-mint" />
                  <span>Website: boraq.com.bd</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Mail className="w-4 h-4 text-boraq-primary" />
                  <span>Email: info@boraq.com.bd</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <MapPin className="w-4 h-4 text-boraq-deep-green" />
                  <span>Visit our booth for more info!</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Close Button */}
          <motion.button
            onClick={onClose}
            className="boraq-button w-full py-3 text-sm md:text-base flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            <CheckCircle className="w-5 h-5" />
            <span style={{ fontFamily: 'Poppins, sans-serif' }}>Got it! Close</span>
          </motion.button>

          {/* Screenshot Reminder */}
          {isWin && (
            <motion.p
              className="text-xs text-boraq-gray mt-3 px-2 flex items-center justify-center space-x-2"
              style={{ fontFamily: 'Roboto, sans-serif' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
            >
              <Camera className="w-4 h-4" />
              <span>Take a screenshot of this result for your records!</span>
            </motion.p>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PrizeModal;
