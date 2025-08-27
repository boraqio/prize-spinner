// Minimal geometric background animation with Boraq theme colors and dark tones
import { motion } from 'framer-motion';

const ModernBackground = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Dark base with theme color accents */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #1C1C1E 0%, #424242 25%, #047857 50%, #1C1C1E 75%, #424242 100%)'
        }}
      />

      {/* Animated geometric shapes */}
      <motion.div
        className="absolute top-20 left-20 w-32 h-32 opacity-10"
        style={{
          background: 'linear-gradient(45deg, #DEFFEE, #6EE7B7)',
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
        }}
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute top-40 right-32 w-24 h-24 opacity-8"
        style={{
          background: 'linear-gradient(135deg, #059669, #047857)',
          borderRadius: '50%'
        }}
        animate={{
          x: [0, 20, 0],
          y: [0, -30, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute bottom-32 left-1/4 w-20 h-20 opacity-6"
        style={{
          background: '#6EE7B7',
          transform: 'rotate(45deg)'
        }}
        animate={{
          rotate: [45, 405],
          scale: [1, 0.8, 1]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute top-1/3 right-20 w-16 h-40 opacity-5"
        style={{
          background: 'linear-gradient(180deg, #DEFFEE, transparent)',
          clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
        }}
        animate={{
          y: [0, -20, 0],
          opacity: [0.05, 0.15, 0.05]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute bottom-20 right-1/3 w-28 h-28 opacity-7"
        style={{
          background: 'conic-gradient(from 0deg, #047857, #059669, #6EE7B7, transparent)',
          clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'
        }}
        animate={{
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Subtle geometric grid overlay */}
      <div
        className="absolute inset-0 opacity-3"
        style={{
          backgroundImage: `
            linear-gradient(#059669 1px, transparent 1px),
            linear-gradient(90deg, #059669 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }}
      />

      {/* Floating minimal dots */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: ['#DEFFEE', '#6EE7B7', '#059669', '#047857'][i],
            left: `${20 + i * 20}%`,
            top: `${30 + i * 15}%`,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{
            duration: 5 + i,
            delay: i * 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

export default ModernBackground;
