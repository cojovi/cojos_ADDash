// src/components/SlideView.tsx
import React, { useState, useEffect, useRef } from 'react';
import BucketHeader from './BucketHeader';
import KanbanBoard from './KanbanBoard';
import MicroList from './MicroList';
import PaginationDots from './PaginationDots';
import { getKanbanItems, getMicroListItems, Task } from '@/data/mockData';
import { useAmbientMode } from '@/contexts/AmbientModeContext';

interface SlideViewProps {
  tasks: Task[];
}

export const SlideView: React.FC<SlideViewProps> = ({ tasks }) => {
  const slides = ['Work', 'Life', 'Hobbies'] as const;
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideContainerRef = useRef<HTMLDivElement>(null);
  const { isAmbientMode } = useAmbientMode();

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setCurrentSlide(prev => (prev > 0 ? prev - 1 : slides.length - 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentSlide(prev => (prev < slides.length - 1 ? prev + 1 : 0));
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle swipe navigation
  useEffect(() => {
    if (!slideContainerRef.current) return;
    
    let touchStartX = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diffX = touchEndX - touchStartX;
      
      if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
          setCurrentSlide(prev => (prev > 0 ? prev - 1 : slides.length - 1));
        } else {
          setCurrentSlide(prev => (prev < slides.length - 1 ? prev + 1 : 0));
        }
      }
    };
    
    const container = slideContainerRef.current;
    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // Apply transformation based on current slide
  const slideStyle = {
    transition: 'transform 100ms ease',
    transform: `translateX(-${currentSlide * 100}%)`,
    opacity: isAmbientMode ? 0.7 : 1,
  };

  return (
    <div 
      ref={slideContainerRef}
      className="flex-1 overflow-hidden pt-12"
    >
      <div 
        className="flex h-full" 
        style={slideStyle}
      >
        {slides.map((bucket, index) => {
          const bucketTasks = getKanbanItems(bucket);
          const microListItems = getMicroListItems(bucket);
          
          return (
            <div 
              key={bucket} 
              className="flex-none w-full h-full flex flex-col p-6 space-y-6"
            >
              <BucketHeader bucket={bucket} />
              <KanbanBoard bucket={bucket} tasks={bucketTasks} />
              <MicroList bucket={bucket} tasks={microListItems} />
            </div>
          );
        })}
      </div>
      <PaginationDots 
        totalSlides={slides.length} 
        currentSlide={currentSlide} 
        onDotClick={setCurrentSlide}
      />
    </div>
  );
};

export default SlideView;