// src/pages/Dashboard.tsx
import React, { useEffect } from 'react';
import Ticker from '@/components/Ticker';
import SlideView from '@/components/SlideView';
import PomodoroTimer from '@/components/PomodoroTimer';
import AmbientModeToggle from '@/components/AmbientModeToggle';
import { TaskProvider, useTaskContext } from '@/contexts/TaskContext';
import { AmbientModeProvider } from '@/contexts/AmbientModeContext';

const DashboardContent: React.FC = () => {
  const { tasks } = useTaskContext();
  
  // Update document title
  useEffect(() => {
    document.title = 'FocusDash - ADHD-friendly Task Dashboard';
  }, []);
  
  return (
    <div className="min-h-screen bg-[#0E0E10] text-white overflow-hidden">
      <Ticker tasks={tasks} />
      <SlideView tasks={tasks} />
      <PomodoroTimer />
      <AmbientModeToggle />
    </div>
  );
};

const Dashboard: React.FC = () => {
  return (
    <AmbientModeProvider>
      <TaskProvider>
        <DashboardContent />
      </TaskProvider>
    </AmbientModeProvider>
  );
};

export default Dashboard;