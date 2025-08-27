// Main spinning wheel component with glassmorphism design and animations
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { PRIZES, getRandomPrize, calculateWheelRotation } from '../../services/prizeLogic';

const SpinWheel = ({ onSpinComplete, disabled = false }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef(null);

  const handleSpin = async () => {
    if (isSpinning || disabled) return;

    setIsSpinning(true);

    // Get random prize
    const wonPrize = getRandomPrize();
    const prizeIndex = PRIZES.findIndex(p => p.id === wonPrize.id);

    // Calculate final rotation
    const finalRotation = calculateWheelRotation(prizeIndex);
    setRotation(finalRotation);

    // Set CSS custom property for animation
    if (wheelRef.current) {
      wheelRef.current.style.setProperty('--final-rotation', `${finalRotation}deg`);
    }

    // Wait for animation to complete
    setTimeout(() => {
      setIsSpinning(false);
      onSpinComplete?.(wonPrize);
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {/* Wheel Container */}
      <div className="relative mb-8">
        {/* Wheel Background */}
        <motion.div
          className="glass-container relative w-80 h-80 rounded-full p-2"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          {/* Spinning Wheel */}
          <div
            ref={wheelRef}
            className={`w-full h-full rounded-full relative overflow-hidden ${
              isSpinning ? 'animate-spin-wheel' : ''
            }`}
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? 'none' : 'transform 0.5s ease-out'
            }}
          >
            {PRIZES.map((prize, index) => {
              const angle = (360 / PRIZES.length) * index;
              const nextAngle = (360 / PRIZES.length) * (index + 1);

              return (
                <div
                  key={prize.id}
                  className="absolute w-full h-full"
                  style={{
                    clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((angle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((angle - 90) * Math.PI / 180)}%, ${50 + 50 * Math.cos((nextAngle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((nextAngle - 90) * Math.PI / 180)}%)`,
                    backgroundColor: prize.color
                  }}
                >
                  {/* Prize Content */}
                  <div
                    className="absolute text-white text-center"
                    style={{
                      top: '25%',
                      left: '50%',
                      transform: `translate(-50%, -50%) rotate(${angle + 25.7}deg)`,
                      width: '80px'
                    }}
                  >
                    <div className="text-2xl mb-1">{prize.icon}</div>
                    <div className="text-xs font-semibold leading-tight">
                      {prize.name.split(' ').slice(0, 2).join(' ')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Center Pointer */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
          <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-white"></div>
        </div>

        {/* Center Circle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="glass-container w-16 h-16 rounded-full flex items-center justify-center">
            <span className="text-2xl">🎯</span>
          </div>
        </div>
      </div>

      {/* Spin Button */}
      <motion.button
        onClick={handleSpin}
        disabled={isSpinning || disabled}
        className={`glass-button px-12 py-4 text-xl font-bold ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        whileHover={!disabled && !isSpinning ? { scale: 1.05 } : {}}
        whileTap={!disabled && !isSpinning ? { scale: 0.95 } : {}}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        {isSpinning ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full"></div>
            <span>Spinning...</span>
          </div>
        ) : disabled ? (
          'Already Used'
        ) : (
          '🎡 SPIN TO WIN!'
        )}
      </motion.button>

      {/* Instructions */}
      {!disabled && (
        <motion.p
          className="text-glass-text text-center mt-4 max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          Click the button to spin the wheel and discover your prize!
          Remember, you only get one spin per email address.
        </motion.p>
      )}
    </div>
  );
};

export default SpinWheel;
