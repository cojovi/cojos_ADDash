// src/data/mockData.ts
export interface Task {
  id: string;
  title: string;
  bucket: 'Work' | 'Life' | 'Hobbies';
  status: 'Now' | 'Next' | 'Later';
  due: string;
}

export const mockTasks: Task[] = [
  {
    id: "task-1",
    title: "Complete quarterly report",
    bucket: "Work",
    status: "Now",
    due: "2024-06-15"
  },
  {
    id: "task-2",
    title: "Review team presentations",
    bucket: "Work",
    status: "Now",
    due: "2024-06-10"
  },
  {
    id: "task-3",
    title: "Update project roadmap",
    bucket: "Work",
    status: "Next",
    due: "2024-06-20"
  },
  {
    id: "task-4",
    title: "Client meeting preparation",
    bucket: "Work",
    status: "Next",
    due: "2024-06-25"
  },
  {
    id: "task-5",
    title: "Research new analytics tools",
    bucket: "Work",
    status: "Later",
    due: "2024-07-10"
  },
  {
    id: "task-6",
    title: "Doctor appointment",
    bucket: "Life",
    status: "Now",
    due: "2024-06-12"
  },
  {
    id: "task-7",
    title: "Grocery shopping",
    bucket: "Life",
    status: "Now",
    due: "2024-06-05"
  },
  {
    id: "task-8",
    title: "Call parents",
    bucket: "Life",
    status: "Next",
    due: "2024-06-18"
  },
  {
    id: "task-9",
    title: "Schedule home repairs",
    bucket: "Life",
    status: "Later",
    due: "2024-07-05"
  },
  {
    id: "task-10",
    title: "Plan summer vacation",
    bucket: "Life",
    status: "Later",
    due: "2024-07-30"
  },
  {
    id: "task-11",
    title: "Practice guitar",
    bucket: "Hobbies",
    status: "Now",
    due: "2024-06-08"
  },
  {
    id: "task-12",
    title: "Finish current novel",
    bucket: "Hobbies",
    status: "Next",
    due: "2024-06-22"
  },
  {
    id: "task-13",
    title: "Sign up for photography workshop",
    bucket: "Hobbies",
    status: "Later",
    due: "2024-07-15"
  },
  {
    id: "task-14",
    title: "Start learning Spanish",
    bucket: "Hobbies",
    status: "Later",
    due: "2024-08-01"
  },
  {
    id: "task-15",
    title: "Bike maintenance",
    bucket: "Hobbies",
    status: "Now",
    due: "2024-06-11"
  },
  // Micro list items - Work
  {
    id: "micro-1",
    title: "Reply to emails",
    bucket: "Work",
    status: "Now",
    due: "2024-06-05"
  },
  {
    id: "micro-2",
    title: "Schedule meeting",
    bucket: "Work",
    status: "Now",
    due: "2024-06-06"
  },
  {
    id: "micro-3",
    title: "Submit expense report",
    bucket: "Work",
    status: "Next",
    due: "2024-06-20"
  },
  {
    id: "micro-4",
    title: "Upload documentation",
    bucket: "Work",
    status: "Later",
    due: "2024-07-01"
  },
  {
    id: "micro-5",
    title: "Prep for standup",
    bucket: "Work",
    status: "Now",
    due: "2024-06-07"
  },
  // Micro list items - Life
  {
    id: "micro-6",
    title: "Buy milk",
    bucket: "Life",
    status: "Now",
    due: "2024-06-05"
  },
  {
    id: "micro-7",
    title: "Pay utility bills",
    bucket: "Life",
    status: "Now",
    due: "2024-06-10"
  },
  {
    id: "micro-8",
    title: "Pick up prescription",
    bucket: "Life",
    status: "Now",
    due: "2024-06-08"
  },
  {
    id: "micro-9",
    title: "Return library books",
    bucket: "Life",
    status: "Next",
    due: "2024-06-15"
  },
  {
    id: "micro-10",
    title: "Water plants",
    bucket: "Life",
    status: "Now",
    due: "2024-06-06"
  },
  // Micro list items - Hobbies
  {
    id: "micro-11",
    title: "Order new guitar strings",
    bucket: "Hobbies",
    status: "Next",
    due: "2024-06-18"
  },
  {
    id: "micro-12",
    title: "Download new book",
    bucket: "Hobbies",
    status: "Now",
    due: "2024-06-05"
  },
  {
    id: "micro-13",
    title: "Check exhibition dates",
    bucket: "Hobbies",
    status: "Later",
    due: "2024-06-25"
  },
  {
    id: "micro-14",
    title: "Clean camera lenses",
    bucket: "Hobbies",
    status: "Now",
    due: "2024-06-07"
  },
  {
    id: "micro-15",
    title: "Tune bike gears",
    bucket: "Hobbies",
    status: "Next",
    due: "2024-06-20"
  }
];

export const getMicroListItems = (bucket: 'Work' | 'Life' | 'Hobbies'): Task[] => {
  return mockTasks
    .filter(task => task.bucket === bucket)
    .sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime())
    .slice(0, 15);
};

export const getKanbanItems = (bucket: 'Work' | 'Life' | 'Hobbies'): Task[] => {
  return mockTasks
    .filter(task => task.bucket === bucket && task.id.indexOf('micro-') === -1)
    .sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime());
};