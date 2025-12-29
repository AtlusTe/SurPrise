import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Balloon = ({ id, x, speed, scale, color, onPop, isSteak }) => {
  const handlePop = (e) => {
    onPop(id);
  };

  return (
    <AnimatePresence>
      <motion.div
        key={id}
        initial={{ y: '110vh', x: `${x}vw`, scale: scale, opacity: 0.9 }}
        animate={{ y: '-20vh' }}
        exit={{ 
          scale: [1, 2], 
          opacity: [1, 0],
          filter: ['blur(0px)', 'blur(10px)'],
          transition: { duration: 0.2 } 
        }}
        transition={{ 
          y: { duration: speed, ease: "linear", repeat: Infinity },
        }}
        onPointerDown={handlePop}
        onPointerEnter={handlePop} // For mouse hover
        data-balloon-id={id} // For touch swipe detection
        className={`absolute cursor-pointer touch-manipulation shadow-lg flex items-center justify-center ${isSteak ? 'z-50' : ''}`}
        style={{ 
          width: isSteak ? '120px' : '64px',
          height: isSteak ? '120px' : '80px',
          borderRadius: isSteak ? '10px' : '50% 50% 50% 50% / 40% 40% 60% 60%',
          background: isSteak ? 'none' : undefined,
        }}
      >
        {isSteak ? (
          <img 
            src="/Steak.png" 
            alt="Steak" 
            className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(255,100,100,0.8)] animate-pulse"
            onError={(e) => {
              console.error('Failed to load steak image. Make sure Steak.png is in the public folder.');
              e.target.style.display = 'none';
              e.target.parentNode.innerHTML = '<div class="text-6xl">🥩</div>'; // Emoji fallback
            }}
          />
        ) : (
          <div className={`w-full h-full rounded-full ${color}`} style={{ borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%' }}>
             {/* Shine effect */}
             <div className="absolute top-3 left-3 w-4 h-8 bg-white opacity-20 rounded-full transform -rotate-45" />
             {/* String */}
             <div className="absolute bottom-[-20px] left-1/2 w-0.5 h-6 bg-white/40 transform -translate-x-1/2" />
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default Balloon;
