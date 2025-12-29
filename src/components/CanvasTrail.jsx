import React, { useEffect, useRef } from 'react';

const CanvasTrail = () => {
  const canvasRef = useRef(null);
  const pointsRef = useRef([]);
  const animationFrameRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Add point function
    const addPoint = (x, y) => {
      pointsRef.current.push({
        x,
        y,
        age: 0,
        life: 50, // Increased life for longer trail
        vx: 0,
        vy: 0
      });
    };

    // Event listeners
    const handlePointerMove = (e) => {
      // Handle both mouse and touch events
      if (e.touches) {
        for (let i = 0; i < e.touches.length; i++) {
          addPoint(e.touches[i].clientX, e.touches[i].clientY);
        }
      } else {
        addPoint(e.clientX, e.clientY);
      }
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove, { passive: false });

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const points = pointsRef.current;
      
      // Update points
      for (let i = points.length - 1; i >= 0; i--) {
        const p = points[i];
        p.age++;
        
        // Remove dead points
        if (p.age >= p.life) {
          points.splice(i, 1);
          continue;
        }
      }

      // Draw trail
      if (points.length > 1) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // Draw segments
        for (let i = 0; i < points.length - 1; i++) {
          const p1 = points[i];
          const p2 = points[i+1];
          
          const lifePercent = 1 - (p1.age / p1.life);
          
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          
          ctx.lineWidth = 12 * lifePercent; // Slightly thicker start
          
          // Gradient interpolation: Rose (#F43F5E) to Amber (#F59E0B)
          // Rose: 244, 63, 94
          // Amber: 245, 158, 11
          // We can just use HSL for easier interpolation? 
          // Rose is approx HSL(350, 89%, 60%)
          // Amber is approx HSL(38, 92%, 50%)
          // Let's interpolate Hue from 340 to 40 (wrapping around? No, just linear 340 -> 30 is fine if we go backwards or just pick nice colors)
          // Let's do simple RGB interpolation or HSL.
          // Start (New): Rose
          // End (Old): Amber
          
          // Actually, let's make it shift color along the length.
          // New points (age 0) = Rose. Old points (age life) = Amber.
          
          const hue = 340 + (40 * (1 - lifePercent)); // 340 -> 380 (which is 20)
          // Wait, 340 + 40 = 380 = 20 deg. 
          
          ctx.strokeStyle = `hsla(${hue}, 90%, 60%, ${0.8 * lifePercent})`;
          
          // Use quadratic curve to midpoint
          const midX = (p1.x + p2.x) / 2;
          const midY = (p1.y + p2.y) / 2;
          
          ctx.quadraticCurveTo(p1.x, p1.y, midX, midY);
          ctx.stroke();
        }
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ touchAction: 'none' }}
    />
  );
};

export default CanvasTrail;
