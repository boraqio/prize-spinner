// Prize display modal component
import { motion, AnimatePresence } from 'framer-motion';
import { getPrizeInstructions } from '../../services/prizeLogic';

const PrizeModal = ({ isOpen, prize, onClose, userName }) => {
  if (!isOpen || !prize) return null;

  const isWin = prize.value !== 'none';
  const instructions = getPrizeInstructions(prize);

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
          className="glass-card max-w-lg w-full text-center"
          initial={{ scale: 0, rotateY: 180 }}
          animate={{ scale: 1, rotateY: 0 }}
          exit={{ scale: 0, rotateY: 180 }}
          transition={{ type: "spring", duration: 0.8 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Celebration Animation */}
          {isWin && (
            <motion.div
              className="text-6xl mb-4"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{
                duration: 0.6,
                repeat: 2
              }}
            >
              🎉
            </motion.div>
          )}

          {/* Result Header */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className={`text-3xl font-bold mb-2 ${
              isWin ? 'text-green-400' : 'text-yellow-400'
            }`}>
              {isWin ? '🎊 Congratulations!' : '🎯 Thanks for Playing!'}
            </h2>

            <p className="text-glass-text mb-6">
              {userName ? `Hey ${userName.split(' ')[0]}!` : 'Hey there!'}
              {isWin ? ' You won:' : ' Better luck next time!'}
            </p>
          </motion.div>

          {/* Prize Details */}
          <motion.div
            className="glass-container p-6 mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
          >
            {/* Prize Icon and Color */}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4 mx-auto"
              style={{ backgroundColor: prize.color }}
            >
              {prize.icon}
            </div>

            {/* Prize Name */}
            <h3 className="text-xl font-semibold text-white mb-2">
              {prize.name}
            </h3>

            {/* Prize Description */}
            <p className="text-glass-text mb-4">
              {prize.description}
            </p>

            {/* Prize Value Badge */}
            {prize.value !== 'none' && (
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                prize.value === 'premium' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                prize.value === 'high' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                prize.value === 'medium' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                'bg-green-500/20 text-green-300 border border-green-500/30'
              }`}>
                {prize.value.toUpperCase()} VALUE
              </span>
            )}
          </motion.div>

          {/* Instructions */}
          <motion.div
            className="mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <h4 className="text-lg font-semibold text-white mb-2">
              {isWin ? '🎁 How to Claim:' : '📋 What\'s Next:'}
            </h4>
            <p className="text-glass-text text-sm leading-relaxed">
              {instructions}
            </p>
          </motion.div>

          {/* Contact Info for Winners */}
          {isWin && prize.value !== 'low' && (
            <motion.div
              className="glass-container p-4 mb-6 bg-glass-secondary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <h5 className="font-semibold text-white mb-2">📞 Contact Information:</h5>
              <p className="text-sm text-glass-text">
                🌐 Website: boraq.com.bd<br/>
                📧 Email: info@boraq.com.bd<br/>
                📱 Phone: +880-XXX-XXXXXX
              </p>
            </motion.div>
          )}

          {/* Close Button */}
          <motion.button
            onClick={onClose}
            className="glass-button w-full py-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            🎯 Got it! Close
          </motion.button>

          {/* Screenshot Reminder */}
          {isWin && (
            <motion.p
              className="text-xs text-gray-400 mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
            >
              💡 Tip: Take a screenshot of this screen for easy reference!
            </motion.p>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PrizeModal;
