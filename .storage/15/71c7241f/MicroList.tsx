// src/components/MicroList.tsx
import React, { useRef, useEffect } from 'react';
import { Task } from '@/data/mockData';
import { useAmbientMode } from '@/contexts/AmbientModeContext';

interface MicroListProps {
  bucket: 'Work' | 'Life' | 'Hobbies';
  tasks: Task[];
}

const MicroList: React.FC<MicroListProps> = ({ bucket, tasks }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { isAmbientMode } = useAmbientMode();
  
  // Determine color based on bucket
  const getAccentColor = () => {
    switch (bucket) {
      case 'Work': return '#00E0FF';
      case 'Life': return '#FF55FF';
      case 'Hobbies': return '#00E0FF';
      default: return '#00E0FF';
    }
  };
  
  // Auto-scroll effect for horizontal overflow
  useEffect(() => {
    if (!scrollRef.current || tasks.length <= 5) return;
    
    const scrollContainer = scrollRef.current;
    const contentWidth = scrollContainer.scrollWidth;
    const visibleWidth = scrollContainer.clientWidth;
    
    if (contentWidth <= visibleWidth) return;
    
    let scrollPosition = 0;
    const scrollSpeed = isAmbientMode ? 0.15 : 0.3; // pixels per frame
    
    const scroll = () => {
      scrollPosition += scrollSpeed;
      
      // Reset scroll position when reached the end
      if (scrollPosition > contentWidth - visibleWidth) {
        scrollPosition = 0;
      }
      
      scrollContainer.scrollLeft = scrollPosition;
      requestAnimationFrame(scroll);
    };
    
    const animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [tasks, isAmbientMode]);
  
  return (
    <div className="mt-2 mb-6">
      <div className="mb-2 text-gray-400 text-sm font-medium">Quick Tasks</div>
      <div 
        ref={scrollRef} 
        className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {tasks.slice(0, 15).map((task) => (
          <div
            key={task.id}
            className="flex-shrink-0 px-4 py-2 bg-gray-800 rounded-md whitespace-nowrap text-sm"
            style={{
              borderLeft: `2px solid ${getAccentColor()}`,
              transition: 'transform 200ms ease-in-out',
            }}
          >
            {task.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MicroList;
