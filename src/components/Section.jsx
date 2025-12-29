import React from 'react';
import { motion } from 'framer-motion';

const Section = ({ children, className = '' }) => {
  return (
    <section className={`h-screen w-full flex items-center justify-center snap-start snap-always relative overflow-hidden ${className}`}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.5 }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.08,
              delayChildren: 0.2,
            }
          }
        }}
        className="max-w-md px-8 text-center"
      >
        {children}
      </motion.div>
    </section>
  );
};

export default Section;
