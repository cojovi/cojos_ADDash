// src/contexts/AmbientModeContext.tsx
import React, { createContext, useContext, useEffect } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';

interface AmbientModeContextProps {
  isAmbientMode: boolean;
  toggleAmbientMode: () => void;
}

const AmbientModeContext = createContext<AmbientModeContextProps>({
  isAmbientMode: false,
  toggleAmbientMode: () => {}
});

export const useAmbientMode = () => useContext(AmbientModeContext);

export const AmbientModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAmbientMode, setIsAmbientMode] = useLocalStorage('focusdash-ambient-mode', false);
  
  // Toggle ambient mode
  const toggleAmbientMode = () => {
    setIsAmbientMode(!isAmbientMode);
  };
  
  // Apply global ambient mode effects
  useEffect(() => {
    const root = document.documentElement;
    
    if (isAmbientMode) {
      // Apply ambient mode styles
      root.classList.add('ambient-mode');
      document.body.style.transition = 'all 500ms ease-in-out';
      document.body.style.backgroundColor = '#090909';
      
      // Add CSS variable for animation durations to slow animations by 50%
      root.style.setProperty('--animation-speed-factor', '2');
      
      // Add a subtle overlay to dim the entire UI
      let overlay = document.getElementById('ambient-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'ambient-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.25)';
        overlay.style.pointerEvents = 'none';
        overlay.style.zIndex = '1000';
        overlay.style.transition = 'opacity 500ms ease-in-out';
        document.body.appendChild(overlay);
      } else {
        overlay.style.display = 'block';
        overlay.style.opacity = '1';
      }
    } else {
      // Remove ambient mode styles
      root.classList.remove('ambient-mode');
      document.body.style.backgroundColor = '#0E0E10';
      
      // Reset animation speed
      root.style.removeProperty('--animation-speed-factor');
      
      // Hide overlay
      const overlay = document.getElementById('ambient-overlay');
      if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => {
          overlay.style.display = 'none';
        }, 500);
      }
    }
    
    return () => {
      // Clean up
      const overlay = document.getElementById('ambient-overlay');
      if (overlay) {
        document.body.removeChild(overlay);
      }
    };
  }, [isAmbientMode]);
  
  return (
    <AmbientModeContext.Provider value={{ isAmbientMode, toggleAmbientMode }}>
      {children}
    </AmbientModeContext.Provider>
  );
};

export default AmbientModeProvider;