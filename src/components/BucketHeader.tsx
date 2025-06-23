// src/components/BucketHeader.tsx
import React, { useEffect, useRef } from 'react';
import { useAmbientMode } from '@/contexts/AmbientModeContext';

interface BucketHeaderProps {
  bucket: 'Work' | 'Life' | 'Hobbies';
}

const BucketHeader: React.FC<BucketHeaderProps> = ({ bucket }) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const { isAmbientMode } = useAmbientMode();

  // Define icon based on bucket type
  const getIcon = () => {
    switch (bucket) {
      case 'Work':
        return (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'Life':
        return (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'Hobbies':
        return (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  // Color theme based on bucket
  const getGlowColor = () => {
    switch (bucket) {
      case 'Work': return '#00E0FF';
      case 'Life': return '#FF55FF';
      case 'Hobbies': return '#00E0FF';
    }
  };

  // Pulse animation effect
  useEffect(() => {
    if (!headerRef.current) return;
    
    const header = headerRef.current;
    const glowColor = getGlowColor();
    
    const animationSpeed = isAmbientMode ? 2000 : 1000; // Slow down in ambient mode
    
    let opacity = 0.3;
    let increasing = true;
    
    const animate = () => {
      if (increasing) {
        opacity += 0.01;
        if (opacity >= 0.7) increasing = false;
      } else {
        opacity -= 0.01;
        if (opacity <= 0.3) increasing = true;
      }
      
      header.style.boxShadow = `0 0 15px ${opacity * 5}px ${glowColor}`;
      header.style.textShadow = `0 0 5px ${glowColor}, 0 0 10px ${glowColor}`;
    };
    
    const interval = setInterval(animate, animationSpeed / 100);
    return () => clearInterval(interval);
  }, [bucket, isAmbientMode]);

  return (
    <div
      ref={headerRef}
      className="flex items-center space-x-3 p-4 rounded-lg bg-gray-900 text-white"
      style={{
        borderLeft: `3px solid ${getGlowColor()}`,
        textShadow: `0 0 5px ${getGlowColor()}, 0 0 10px ${getGlowColor()}`,
        boxShadow: `0 0 15px 1px ${getGlowColor()}`,
        transition: 'box-shadow 200ms ease-in-out, text-shadow 200ms ease-in-out'
      }}
    >
      <div className="text-[#00E0FF]">
        {getIcon()}
      </div>
      <h2 className="text-2xl font-bold">{bucket}</h2>
    </div>
  );
};

export default BucketHeader;