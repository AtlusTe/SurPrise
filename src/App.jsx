import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import StoryFlow from './components/StoryFlow';
import Game from './components/Game';
import StoryFlowOutro from './components/StoryFlowOutro';

function App() {
  const [phase, setPhase] = useState('intro'); // 'intro', 'game', 'outro'

  return (
    <div className="w-full h-screen bg-slate-900 overflow-hidden relative text-white">
      <div className="noise-overlay" />
      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <motion.div
            key="story"
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-10"
          >
            <StoryFlow onComplete={() => setPhase('game')} />
          </motion.div>
        )}

        {phase === 'game' && (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }} // Cinematic exit
            transition={{ duration: 1.5 }}
            className="absolute inset-0 z-20"
          >
            <Game onComplete={() => setPhase('outro')} />
          </motion.div>
        )}

        {phase === 'outro' && (
          <motion.div
            key="outro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 z-30"
          >
            <StoryFlowOutro />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
