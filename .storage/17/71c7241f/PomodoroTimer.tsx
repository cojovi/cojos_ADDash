// src/components/PomodoroTimer.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useAmbientMode } from '@/contexts/AmbientModeContext';

const PomodoroTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const timerRef = useRef<HTMLDivElement>(null);
  const { isAmbientMode } = useAmbientMode();
  const originalTitle = useRef(document.title);
  
  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      setIsCompleted(true);
      
      // Vibrate page title
      let count = 0;
      const titleInterval = setInterval(() => {
        document.title = count % 2 === 0 
          ? '⏰ Time\'s up! - FocusDash' 
          : '🔔 Break time! - FocusDash';
        count++;
        
        if (count > 10) {
          clearInterval(titleInterval);
          document.title = originalTitle.current;
        }
      }, 500);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);
  
  // Format time as MM:SS
  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Reset timer
  const resetTimer = () => {
    setTimeLeft(25 * 60);
    setIsActive(false);
    setIsCompleted(false);
  };
  
  // Toggle timer
  const toggleTimer = () => {
    setIsActive(!isActive);
    setIsCompleted(false);
  };
  
  // Glowing effect when timer is active
  useEffect(() => {
    if (!timerRef.current) return;
    
    const timer = timerRef.current;
    
    if (isActive) {
      const progress = timeLeft / (25 * 60);
      const intensity = Math.max(0.3, progress);
      
      timer.style.boxShadow = `0 0 15px ${intensity * 5}px #00E0FF`;
      
      // Pulsing effect
      const pulseAnimation = () => {
        let scale = 1;
        let increasing = true;
        
        const animate = () => {
          if (increasing) {
            scale += 0.001;
            if (scale >= 1.05) increasing = false;
          } else {
            scale -= 0.001;
            if (scale <= 1) increasing = true;
          }
          
          timer.style.transform = `scale(${scale})`;
          
          if (isActive) {
            requestAnimationFrame(animate);
          } else {
            timer.style.transform = 'scale(1)';
          }
        };
        
        requestAnimationFrame(animate);
      };
      
      pulseAnimation();
    } else {
      timer.style.boxShadow = 'none';
      timer.style.transform = 'scale(1)';
    }
  }, [isActive, timeLeft]);
  
  return (
    <div 
      ref={timerRef}
      className="fixed bottom-6 right-6 p-4 bg-gray-900 rounded-lg text-white flex flex-col items-center"
      style={{ 
        transition: isAmbientMode ? 'all 400ms ease-in-out' : 'all 200ms ease-in-out',
        opacity: isAmbientMode ? 0.7 : 1
      }}
    >
      <div className={`text-2xl font-bold mb-2 ${isCompleted ? 'text-[#FF55FF]' : isActive ? 'text-[#00E0FF]' : 'text-white'}`}>
        {formatTime()}
      </div>
      
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleTimer}
          className={isActive ? 'bg-red-500 hover:bg-red-600 border-none' : 'bg-[#00E0FF] hover:bg-[#00E0FF]/80 text-black border-none'}
        >
          {isActive ? 'Pause' : 'Start'}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={resetTimer}
          className="bg-transparent border-gray-500 hover:border-white"
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default PomodoroTimer;
