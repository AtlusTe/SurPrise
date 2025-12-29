import React, { useState, useEffect, useCallback } from 'react';

const Trail = () => {
  const [trail, setTrail] = useState([]);

  const handleMove = useCallback((e) => {
    const { clientX, clientY } = e.touches ? e.touches[0] : e;
    const id = Date.now();
    
    setTrail(prev => [
      ...prev,
      { x: clientX, y: clientY, id }
    ]);

    // Cleanup point after delay - Reduced to 150ms
    setTimeout(() => {
      setTrail(prev => prev.filter(p => p.id !== id));
    }, 150);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
    };
  }, [handleMove]);

  if (trail.length < 2) return null;

  // Create smooth SVG path data using quadratic bezier curves
  const getPath = (points) => {
    if (points.length < 2) return "";
    
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      // Midpoint for quadratic bezier control
      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2;
      path += ` Q ${p1.x} ${p1.y}, ${midX} ${midY}`;
    }
    
    // Line to the last point
    path += ` L ${points[points.length - 1].x} ${points[points.length - 1].y}`;
    return path;
  };

  return (
    <svg className="fixed inset-0 pointer-events-none z-50 overflow-visible" style={{ width: '100%', height: '100%' }}>
      <path
        d={getPath(trail)}
        fill="none"
        stroke="rgba(255, 255, 255, 0.6)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
      />
    </svg>
  );
};

export default Trail;
