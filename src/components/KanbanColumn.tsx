// src/components/KanbanColumn.tsx
import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Task } from '@/data/mockData';
import KanbanCard from './KanbanCard';

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  onDragEnd: (result: { destination?: { index: number; droppableId: string }; source: { index: number; droppableId: string }; draggableId: string }) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  id,
  title,
  tasks,
  onDragEnd
}) => {
  const getColumnColor = () => {
    switch (id) {
      case 'Now': return '#00E0FF';
      case 'Next': return '#FF55FF';
      case 'Later': return '#6B7280';
      default: return '#6B7280';
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-900 rounded-lg overflow-hidden">
      <div 
        className="px-4 py-2 text-white font-medium"
        style={{ borderBottom: `2px solid ${getColumnColor()}` }}
      >
        {title}
      </div>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={id}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`flex-1 p-2 overflow-y-auto ${
                snapshot.isDraggingOver ? 'bg-gray-800' : 'bg-gray-900'
              }`}
            >
              {tasks.map((task, index) => (
                <KanbanCard
                  key={task.id}
                  task={task}
                  index={index}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default KanbanColumn;