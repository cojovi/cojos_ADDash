// src/components/KanbanCard.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Task } from '@/data/mockData';
import { useAmbientMode } from '@/contexts/AmbientModeContext';

interface KanbanCardProps {
  task: Task;
  index: number;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ task, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isOverdue, setIsOverdue] = useState(false);
  const { isAmbientMode } = useAmbientMode();
  
  // Check if task is due today or overdue
  useEffect(() => {
    const checkDueDate = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const dueDate = new Date(task.due);
      dueDate.setHours(0, 0, 0, 0);
      
      setIsOverdue(dueDate <= today);
    };
    
    checkDueDate();
    const interval = setInterval(checkDueDate, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [task.due]);
  
  // Flash border if overdue
  useEffect(() => {
    if (!isOverdue || !cardRef.current) return;
    
    const card = cardRef.current;
    let isFlashing = false;
    
    const flashBorder = () => {
      if (isFlashing) {
        card.style.boxShadow = '0 0 0 2px #FF55FF';
        setTimeout(() => {
          card.style.boxShadow = 'none';
          isFlashing = false;
        }, 500);
      }
    };
    
    const interval = setInterval(() => {
      isFlashing = true;
      flashBorder();
    }, isAmbientMode ? 20000 : 10000); // Flash every 10s, or 20s in ambient mode
    
    return () => clearInterval(interval);
  }, [isOverdue, isAmbientMode]);
  
  // Format due date
  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dueDate = new Date(date);
    dueDate.setHours(0, 0, 0, 0);
    
    if (dueDate.getTime() === today.getTime()) return 'Today';
    if (dueDate.getTime() === tomorrow.getTime()) return 'Tomorrow';
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={(el) => {
            // Combine refs
            provided.innerRef(el);
            if (cardRef.current === null && el !== null) {
              cardRef.current = el;
            }
          }}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-3 mb-2 bg-gray-800 rounded-md cursor-move transition-shadow ${
            snapshot.isDragging ? 'shadow-lg' : ''
          }`}
        >
          <h3 className="font-medium text-white mb-2">{task.title}</h3>
          <div className={`text-xs ${isOverdue ? 'text-red-400' : 'text-gray-400'}`}>
            Due: {formatDueDate(task.due)}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default KanbanCard;