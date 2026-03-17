"use client";
import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateCursor = (e) => setPosition({ x: e.clientX, y: e.clientY });
    
    const handleMouseOver = (e) => {
      // Add hover effect if hovering over links, buttons, or custom interactive elements
      if (e.target.closest('a') || e.target.closest('button') || e.target.closest('.pill') || e.target.closest('.project-img-wrapper') || e.target.closest('label')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    document.addEventListener('mousemove', updateCursor);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.removeEventListener('mousemove', updateCursor);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <div 
      className={`custom-cursor ${isHovering ? 'hovering' : ''}`} 
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    ></div>
  );
}