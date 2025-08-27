// Professional spinning wheel component following Boraq brand guidelines
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Target, Sparkles } from 'lucide-react';
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
    <div className="flex flex-col items-center justify-center w-full px-4 py-4 max-h-[80vh]">
      {/* Wheel Container */}
      <div className="relative mb-4 md:mb-6">
        {/* Wheel Background */}
        <motion.div
          className="glass-container relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-full p-2 boraq-border"
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
                      width: '60px'
                    }}
                  >
                    <div className="text-sm sm:text-base md:text-lg mb-1 font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {prize.icon}
                    </div>
                    <div className="text-xs font-medium leading-tight" style={{ fontFamily: 'Roboto, sans-serif' }}>
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
          <div className="w-0 h-0 border-l-3 border-r-3 border-b-6 sm:border-l-4 sm:border-r-4 sm:border-b-8 border-l-transparent border-r-transparent border-b-boraq-primary drop-shadow-lg"></div>
        </div>

        {/* Center Circle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="glass-container w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center bg-boraq-mint/20">
            <Target className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-boraq-primary" />
          </div>
        </div>
      </div>

      {/* Spin Button */}
      <motion.button
        onClick={handleSpin}
        disabled={isSpinning || disabled}
        className={`boraq-button px-6 py-3 sm:px-8 sm:py-3 text-base sm:text-lg font-bold ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        } w-full max-w-xs flex items-center justify-center space-x-2 group`}
        whileHover={!disabled && !isSpinning ? { scale: 1.02 } : {}}
        whileTap={!disabled && !isSpinning ? { scale: 0.98 } : {}}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        {isSpinning ? (
          <>
            <RotateCcw className="w-5 h-5 animate-spin" />
            <span style={{ fontFamily: 'Poppins, sans-serif' }}>Spinning...</span>
          </>
        ) : disabled ? (
          <>
            <Target className="w-5 h-5" />
            <span style={{ fontFamily: 'Poppins, sans-serif' }}>Already Used</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span style={{ fontFamily: 'Poppins, sans-serif' }}>SPIN TO WIN!</span>
          </>
        )}
      </motion.button>

      {/* Instructions */}
      {!disabled && (
        <motion.p
          className="text-boraq-text text-center mt-3 max-w-sm text-xs sm:text-sm px-2"
          style={{ fontFamily: 'Roboto, sans-serif' }}
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
