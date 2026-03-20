"use client";
import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 }); // Start off-screen
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateCursor = (e) => {
      // 1. Move the cursor
      setPosition({ x: e.clientX, y: e.clientY });
      
      // 2. Check exactly what element the mouse is currently touching
      const target = e.target;
      const isInteractive = target.closest('a, button, .pill, .project-img-wrapper, label, input, .view-btn, .theme-switch');
      
      setIsHovering(!!isInteractive);
    };

    // Use mousemove for everything to prevent glitching
    document.addEventListener('mousemove', updateCursor);

    return () => {
      document.removeEventListener('mousemove', updateCursor);
    };
  }, []);

  return (
    <div 
      className={`custom-cursor ${isHovering ? 'hovering' : ''}`} 
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    ></div>
  );
}