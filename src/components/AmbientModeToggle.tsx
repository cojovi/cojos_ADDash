// src/components/AmbientModeToggle.tsx
import React, { useEffect, useRef } from 'react';
import { Switch } from '@/components/ui/switch';
import { useAmbientMode } from '@/contexts/AmbientModeContext';

const AmbientModeToggle: React.FC = () => {
  const { isAmbientMode, toggleAmbientMode } = useAmbientMode();
  const toggleRef = useRef<HTMLDivElement>(null);
  
  // Subtle animation effect for the toggle container
  useEffect(() => {
    if (!toggleRef.current) return;
    
    const toggleContainer = toggleRef.current;
    let opacity = 0.7;
    let increasing = true;
    
    const animate = () => {
      if (increasing) {
        opacity += 0.005;
        if (opacity >= 1) increasing = false;
      } else {
        opacity -= 0.005;
        if (opacity <= 0.7) increasing = true;
      }
      
      toggleContainer.style.opacity = opacity.toString();
      requestAnimationFrame(animate);
    };
    
    const animationId = requestAnimationFrame(animate);
    
    return () => cancelAnimationFrame(animationId);
  }, []);
  
  return (
    <div 
      ref={toggleRef}
      className="fixed bottom-6 left-6 p-3 bg-gray-900 rounded-lg text-white flex items-center space-x-3"
      style={{ 
        transition: 'background-color 500ms ease-in-out',
        backgroundColor: isAmbientMode ? '#0E0E10' : '#1F1F23',
        boxShadow: isAmbientMode ? '0 0 15px 1px rgba(0, 224, 255, 0.2)' : 'none'
      }}
    >
      <div className="text-sm">
        {isAmbientMode ? 'Ambient Mode: On' : 'Ambient Mode'}
      </div>
      
      <Switch 
        checked={isAmbientMode} 
        onCheckedChange={toggleAmbientMode}
        className={isAmbientMode ? 'bg-[#00E0FF]/50' : 'bg-gray-700'}
      />
    </div>
  );
};

export default AmbientModeToggle;