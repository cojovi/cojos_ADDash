// src/components/KanbanBoard.tsx
import React, { useEffect, useState } from 'react';
import { Task } from '@/data/mockData';
import KanbanColumn from './KanbanColumn';
import { useTaskContext } from '@/contexts/TaskContext';

interface KanbanBoardProps {
  bucket: 'Work' | 'Life' | 'Hobbies';
  tasks: Task[];
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ bucket, tasks: initialTasks }) => {
  const [localTasks, setLocalTasks] = useState<Task[]>(initialTasks);
  const { updateTaskStatus } = useTaskContext();
  
  // Sort by due date every minute
  useEffect(() => {
    const sortTasksByDueDate = () => {
      setLocalTasks(prev => [...prev].sort(
        (a, b) => new Date(a.due).getTime() - new Date(b.due).getTime()
      ));
    };
    
    // Initial sort
    sortTasksByDueDate();
    
    // Set up interval
    const interval = setInterval(sortTasksByDueDate, 60000);
    return () => clearInterval(interval);
  }, []);
  
  // Keep local tasks updated with prop changes
  useEffect(() => {
    setLocalTasks(initialTasks);
  }, [initialTasks]);
  
  // Handle drag and drop
  const handleDragEnd = (result: { destination?: { index: number; droppableId: string }; source: { index: number; droppableId: string }; draggableId: string }) => {
    if (!result.destination) return;
    
    const { source, destination, draggableId } = result;
    
    if (source.droppableId === destination.droppableId) {
      // Reordering within the same column
      const columnTasks = localTasks
        .filter(task => task.status === source.droppableId)
        .slice();
      
      const [movedTask] = columnTasks.splice(source.index, 1);
      columnTasks.splice(destination.index, 0, movedTask);
      
      const otherTasks = localTasks.filter(task => task.status !== source.droppableId);
      setLocalTasks([...columnTasks, ...otherTasks]);
    } else {
      // Moving between columns
      const sourceColumnTasks = localTasks
        .filter(task => task.status === source.droppableId)
        .slice();
      
      const destinationColumnTasks = localTasks
        .filter(task => task.status === destination.droppableId)
        .slice();
      
      const [movedTask] = sourceColumnTasks.splice(source.index, 1);
      
      // Update task status
      const updatedTask = { ...movedTask, status: destination.droppableId as 'Now' | 'Next' | 'Later' };
      destinationColumnTasks.splice(destination.index, 0, updatedTask);
      
      // Update task status in context
      updateTaskStatus(movedTask.id, destination.droppableId as 'Now' | 'Next' | 'Later');
      
      const otherTasks = localTasks.filter(
        task => task.status !== source.droppableId && task.status !== destination.droppableId
      );
      
      setLocalTasks([...sourceColumnTasks, ...destinationColumnTasks, ...otherTasks]);
    }
  };
  
  const getColumnTasks = (columnId: 'Now' | 'Next' | 'Later') => {
    return localTasks
      .filter(task => task.status === columnId)
      .sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime());
  };

  return (
    <div className="flex flex-1 space-x-4 h-full max-h-[60%]">
      <KanbanColumn
        id="Now"
        title="Now"
        tasks={getColumnTasks('Now')}
        onDragEnd={handleDragEnd}
      />
      <KanbanColumn
        id="Next"
        title="Next"
        tasks={getColumnTasks('Next')}
        onDragEnd={handleDragEnd}
      />
      <KanbanColumn
        id="Later"
        title="Later"
        tasks={getColumnTasks('Later')}
        onDragEnd={handleDragEnd}
      />
    </div>
  );
};

export default KanbanBoard;