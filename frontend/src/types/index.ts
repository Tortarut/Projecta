export interface Project {
  id: number;
  name: string;
  deadline: string;
  completion_percent: number;
  user_tasks_remaining: number;
}

export interface Task {
  id: number;
  name: string;
  deadline: string;
  status: string;
  project: {
    id: number;
    name: string;
  };
}

export interface Team {
  name: string;
}

export interface User {
  name: string;
}

export interface DashboardData {
  user: User;
  team: Team;
  upcoming_tasks: Task[];
  upcoming_projects: Project[];
}


export interface ProjectDetails {
  id: number;
  name: string;
  description: string;
  deadline: string;
  image: string | null;
  progress_percent: number;
  user_tasks: Task[];
}