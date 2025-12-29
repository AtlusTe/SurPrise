import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Section from './Section';
import AnimatedText from './AnimatedText';

const StoryFlow = ({ onComplete }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    container: containerRef,
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Circular/Elliptical motion for background blobs
  const x1 = useTransform(smoothProgress, v => `${Math.sin(v * Math.PI * 2) * 20}%`);
  const y1 = useTransform(smoothProgress, v => `${Math.cos(v * Math.PI * 2) * 20}%`);
  
  const x2 = useTransform(smoothProgress, v => `${Math.cos(v * Math.PI * 2) * -25}%`);
  const y2 = useTransform(smoothProgress, v => `${Math.sin(v * Math.PI * 2) * 25}%`);
  
  const x3 = useTransform(smoothProgress, v => `${Math.sin(v * Math.PI * 2 + Math.PI) * 15}%`);
  const y3 = useTransform(smoothProgress, v => `${Math.cos(v * Math.PI * 2 + Math.PI) * 15}%`);

  const rotate1 = useTransform(smoothProgress, [0, 1], [0, 360]);
  const rotate2 = useTransform(smoothProgress, [0, 1], [360, 0]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [onComplete]);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Reactive Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          style={{ x: x1, y: y1, rotate: rotate1 }} 
          className="blob blob-1"
        />
        <motion.div 
          style={{ x: x2, y: y2, rotate: rotate2 }} 
          className="blob blob-2"
        />
        <motion.div 
          style={{ x: x3, y: y3 }} 
          className="blob blob-3"
        />
      </div>

      <div 
        ref={containerRef}
        className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-transparent relative z-10 scrollbar-hide"
      >
        <Section>
          <h1 className="font-geom text-4xl font-bold text-blue-100 mb-4 drop-shadow-lg">
            <AnimatedText text="Hey Sky" speed={0.1} />
          </h1>
          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white/50"
            animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
            </svg>
          </motion.div>
        </Section>

        <Section>
          <p className="font-geom text-4xl font-light text-blue-200 leading-relaxed drop-shadow-md">
            <AnimatedText text="So it’s your birthday today and I thought I should make something for you" delay={0.2} />
          </p>
        </Section>

        <Section>
          <p className="font-geom text-4xl font-light text-purple-200 leading-relaxed drop-shadow-md">
            <AnimatedText text="But mostly, I just kept thinking about taking you out." delay={0.5} speed={0.08} />
          </p>
        </Section>

        <Section>
          <p className="font-geom text-4xl font-light text-indigo-200 leading-relaxed drop-shadow-md">
            <AnimatedText text="If I could, I’d be treating you to the best medium-rare steak in the city right now." delay={0.8} speed={0.06} />
          </p>
        </Section>

        {/* Final trigger section for the game */}
        <Section className="">
          <div className="flex flex-col items-center gap-4">
            <p className="font-geom text-4xl text-white/90">
              <AnimatedText text="But since I can't be there..." delay={1} />
            </p>
            <motion.button 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5, duration: 0.5 }}
              onClick={onComplete}
              className="mt-8 px-8 py-3 bg-blue-600/80 hover:bg-blue-500 text-white rounded-full font-geom font-semibold shadow-[0_0_15px_rgba(37,99,235,0.5)] transition-all animate-bounce backdrop-blur-sm border border-blue-400/30"
            >
              I Made This Stupid Thing
            </motion.button>
          </div>
        </Section>
      </div>
    </div>
  );
};

export default StoryFlow;
