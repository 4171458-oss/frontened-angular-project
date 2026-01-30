import { TaskStatus, TaskPriority } from './enums';

export interface CreateTaskRequest {
  projectId: number;
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: number;
  dueDate?: string;
  orderIndex?: number;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: number;
  dueDate?: string;
  orderIndex?: number;
}

export interface Task {
  id: number;
  projectId: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: number;
  dueDate?: string;
  createdAt: string;
  orderIndex: number;
}