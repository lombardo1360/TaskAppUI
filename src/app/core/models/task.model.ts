export enum Priority {
  Low = 0,
  Medium = 1,
  High = 2
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  isCompleted: boolean;
  priority: Priority;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  isCompleted?: boolean;
  priority?: Priority;
  dueDate?: string;
}

export type TaskFilter = 'all' | 'completed' | 'pending';
