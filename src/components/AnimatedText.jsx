import React from 'react';
import { motion } from 'framer-motion';

const AnimatedText = ({ text, className = '' }) => {
  // Split text into words
  const words = text.split(' ');

  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.2, 0.65, 0.3, 0.9]
      }
    }
  };

  return (
    <span className={`inline-block ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="inline-block mr-[0.25em] whitespace-nowrap">
          <motion.span variants={wordVariants} className="inline-block">
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
};

export default AnimatedText;
