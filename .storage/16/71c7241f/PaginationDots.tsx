// src/components/PaginationDots.tsx
import React from 'react';
import { useAmbientMode } from '@/contexts/AmbientModeContext';

interface PaginationDotsProps {
  totalSlides: number;
  currentSlide: number;
  onDotClick: (index: number) => void;
}

const PaginationDots: React.FC<PaginationDotsProps> = ({ 
  totalSlides, 
  currentSlide,
  onDotClick 
}) => {
  const { isAmbientMode } = useAmbientMode();
  
  // Generate dots based on total slides
  const dots = Array.from({ length: totalSlides }, (_, i) => i);
  
  // Pulse animation for active dot
  const dotStyle = (isActive: boolean) => ({
    width: isActive ? '12px' : '8px',
    height: isActive ? '12px' : '8px',
    backgroundColor: isActive ? '#00E0FF' : '#6B7280',
    borderRadius: '50%',
    margin: '0 6px',
    transition: isAmbientMode ? 'all 400ms ease-in-out' : 'all 200ms ease-in-out',
    cursor: 'pointer',
    opacity: isActive ? 1 : 0.6,
    boxShadow: isActive ? '0 0 8px 2px #00E0FF' : 'none',
    animation: isActive ? `${isAmbientMode ? 'pulseAmbient' : 'pulse'} 2s infinite` : 'none',
  });
  
  return (
    <div 
      className="flex justify-center items-center fixed bottom-6 left-0 right-0"
      style={{ 
        zIndex: 10, 
        pointerEvents: 'none' 
      }}
    >
      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        @keyframes pulseAmbient {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>
      
      <div 
        className="flex items-center p-3 rounded-full bg-gray-900 bg-opacity-70 backdrop-blur-sm"
        style={{ pointerEvents: 'auto' }}
      >
        {dots.map(index => (
          <div
            key={index}
            onClick={() => onDotClick(index)}
            style={dotStyle(currentSlide === index)}
          />
        ))}
      </div>
    </div>
  );
};

export default PaginationDots;
