// src/contexts/TaskContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, mockTasks } from '@/data/mockData';
import useLocalStorage from '@/hooks/useLocalStorage';

interface TaskContextProps {
  tasks: Task[];
  updateTaskStatus: (id: string, newStatus: 'Now' | 'Next' | 'Later') => void;
  completeTask: (id: string) => void;
}

const TaskContext = createContext<TaskContextProps>({
  tasks: [],
  updateTaskStatus: () => {},
  completeTask: () => {}
});

export const useTaskContext = () => useContext(TaskContext);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('focusdash-tasks', mockTasks);
  
  // Update task status
  const updateTaskStatus = (id: string, newStatus: 'Now' | 'Next' | 'Later') => {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, status: newStatus } : task
    );
    
    setTasks(updatedTasks);
  };
  
  // Mark task as complete (removes it)
  const completeTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };
  
  // Sort tasks by due date every minute
  useEffect(() => {
    const sortInterval = setInterval(() => {
      setTasks(prev => {
        const sorted = [...prev].sort(
          (a, b) => new Date(a.due).getTime() - new Date(b.due).getTime()
        );
        return sorted;
      });
    }, 60000);
    
    return () => clearInterval(sortInterval);
  }, []);
  
  return (
    <TaskContext.Provider value={{ tasks, updateTaskStatus, completeTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export default TaskProvider;
