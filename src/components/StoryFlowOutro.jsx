import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Section from './Section';
import AnimatedText from './AnimatedText';

const StoryFlowOutro = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    container: containerRef,
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Reusing the nice background effects but maybe slightly different colors or motion?
  // Let's keep consistency for now but maybe calmer motion.
  const x1 = useTransform(smoothProgress, v => `${Math.sin(v * Math.PI * 2) * 10}%`);
  const y1 = useTransform(smoothProgress, v => `${Math.cos(v * Math.PI * 2) * 10}%`);
  
  const rotate1 = useTransform(smoothProgress, [0, 1], [0, 180]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black/20">
      {/* Reactive Background - slightly different to signal change */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-50">
        <motion.div 
          style={{ x: x1, y: y1, rotate: rotate1 }} 
          className="blob blob-1 bg-rose-500/30"
        />
         <motion.div 
          className="blob blob-2 bg-amber-500/30"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div 
        ref={containerRef}
        className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-transparent relative z-10 scrollbar-hide"
      >
        <Section>
          <p className="font-geom text-4xl font-light text-rose-200 leading-relaxed drop-shadow-md">
            <AnimatedText text="You played through that? Damn alright, its pretty stupid tho" />
          </p>
        </Section>

        <Section>
          <p className="font-geom text-4xl font-light text-amber-200 leading-relaxed drop-shadow-md">
            <AnimatedText text="Hope you liked it" />
          </p>
        </Section>

        <Section>
          <h1 className="font-geom text-6xl font-bold text-white mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
            <AnimatedText text="Happy Birthday Sky!" />
          </h1>
          <div className="mt-8 text-2xl animate-bounce">
            ❤️
          </div>
        </Section>
      </div>
    </div>
  );
};

export default StoryFlowOutro;
