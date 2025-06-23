// src/components/Ticker.tsx
import React, { useRef, useEffect, useState } from 'react';
import { Task } from '@/data/mockData';

interface TickerProps {
  tasks: Task[];
}

export const Ticker: React.FC<TickerProps> = ({ tasks }) => {
  const tickerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  
  useEffect(() => {
    if (!tickerRef.current) return;
    
    const tickerElement = tickerRef.current;
    const tickerContent = tickerElement.querySelector('.ticker-content') as HTMLElement;
    if (!tickerContent) return;
    
    // Clone the content for seamless looping
    const clone = tickerContent.cloneNode(true);
    tickerElement.appendChild(clone);
    
    let animationId: number;
    let position = 0;
    
    const animate = () => {
      if (isPaused) {
        animationId = requestAnimationFrame(animate);
        return;
      }
      
      position -= 80 / 60; // 80px per second, assuming 60fps
      
      // Reset position when first set of content has scrolled out of view
      if (position <= -tickerContent.offsetWidth) {
        position = 0;
      }
      
      tickerContent.style.transform = `translateX(${position}px)`;
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPaused]);
  
  return (
    <div 
      ref={tickerRef} 
      className="h-12 bg-[#0E0E10] overflow-hidden fixed top-0 left-0 right-0 z-50 border-b border-gray-800"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="ticker-content inline-flex whitespace-nowrap">
        {tasks.map((task, index) => (
          <div 
            key={`${task.id}-${index}`} 
            className="px-4 flex items-center h-12 text-gray-300"
          >
            <span className="mr-6">{task.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ticker;
