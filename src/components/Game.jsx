import React, { useState, useEffect, useRef, useCallback } from 'react';
import Balloon from './Balloon';
import CanvasTrail from './CanvasTrail';

const COLORS = [
  'bg-red-400', 'bg-orange-400', 'bg-amber-400', 'bg-yellow-400', 
  'bg-lime-400', 'bg-green-400', 'bg-emerald-400', 'bg-teal-400', 
  'bg-cyan-400', 'bg-sky-400', 'bg-blue-400', 'bg-indigo-400', 
  'bg-violet-400', 'bg-purple-400', 'bg-fuchsia-400', 'bg-pink-400', 
  'bg-rose-400'
];

const Game = ({ onComplete }) => {
  const [balloons, setBalloons] = useState([]);
  const [poppedCount, setPoppedCount] = useState(0);
  const [steakSpawned, setSteakSpawned] = useState(false);
  const nextId = useRef(0);
  
  // New state for score color
  const [scoreColor, setScoreColor] = useState('text-blue-300');

  // Update color on score change
  useEffect(() => {
    const colors = [
      'text-blue-300', 'text-purple-300', 'text-pink-300', 
      'text-yellow-300', 'text-green-300', 'text-cyan-300',
      'text-rose-300', 'text-amber-300'
    ];
    setScoreColor(colors[Math.floor(Math.random() * colors.length)]);
  }, [poppedCount]);

  const spawnBalloon = useCallback(() => {
    if (steakSpawned) return; // Stop spawning normal balloons if steak is here

    const id = nextId.current++;
    const newBalloon = {
      id,
      x: Math.random() * 80 + 10, 
      speed: Math.random() * 3 + 2, // Faster: 2s to 5s duration
      scale: Math.random() * 0.5 + 0.8, 
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      isSteak: false
    };

    setBalloons(prev => [...prev, newBalloon]);

    if (balloons.length > 30) {
      setBalloons(prev => prev.slice(1));
    }
  }, [balloons.length, steakSpawned]);

  // Check for Steak Spawn
  useEffect(() => {
    if (poppedCount >= 100 && !steakSpawned) {
      setSteakSpawned(true);
      // setBalloons([]); // Removed to persist balloons
      
      // Spawn Steak after a brief pause
      setTimeout(() => {
        const id = nextId.current++;
        setBalloons(prev => [...prev, {
          id,
          x: 50, // Center
          speed: 15, // Very slow rise
          scale: 1.5,
          color: '',
          isSteak: true
        }]);
      }, 1000);
    }
  }, [poppedCount, steakSpawned]);

  useEffect(() => {
    if (steakSpawned) return;
    const interval = setInterval(spawnBalloon, 300); 
    return () => clearInterval(interval);
  }, [spawnBalloon, steakSpawned]);

  // Simple synth pop sound
  const playPopSound = useCallback(() => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(400 + Math.random() * 200, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
  }, []);

  const handlePop = (id) => {
    setBalloons(prev => {
      const balloon = prev.find(b => b.id === id);
      if (!balloon) return prev;
      
      playPopSound();
      
      if (balloon.isSteak) {
        // Trigger completion
        setTimeout(() => {
            onComplete && onComplete();
        }, 500);
        return prev.filter(b => b.id !== id);
      }

      setPoppedCount(c => c + 1);
      return prev.filter(b => b.id !== id);
    });
  };

  // Handle swipe to pop
  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (element) {
      const balloonId = element.getAttribute('data-balloon-id');
      if (balloonId) {
        handlePop(parseInt(balloonId));
      }
      // Also check parent if the touch hit the string or shine
      const parentId = element.parentElement?.getAttribute?.('data-balloon-id');
      if (parentId) {
        handlePop(parseInt(parentId));
      }
    }
  };

  return (
    <div 
      className="h-screen w-full bg-transparent overflow-hidden relative touch-none"
      onTouchMove={handleTouchMove}
    >
       <CanvasTrail />
       {/* Background for Game */}
       <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
         <div className="blob blob-1 opacity-40" />
         <div className="blob blob-2 opacity-40" />
         <div className="blob blob-3 opacity-40" />
       </div>

      {balloons.map(balloon => (
        <Balloon 
          key={balloon.id}
          {...balloon}
          onPop={handlePop}
        />
      ))}
      
      {/* Score Counter */}
      <div className={`absolute top-8 left-1/2 -translate-x-1/2 ${scoreColor} font-geom text-6xl select-none font-bold transition-colors duration-150 drop-shadow-lg z-20`}>
        {poppedCount}
      </div>
    </div>
  );
};

export default Game;
