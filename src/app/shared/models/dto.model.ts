import { TaskStatus, TaskPriority } from './enums';

export interface TeamDto {
  id: number;
  name: string;
  description?: string;
  owner_id: number;
  owner_name?: string;
  created_at: string;
  members_count?: number;
}

export interface TaskDto {
  id: number;
  project_id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee_id?: number;
  due_date?: string;
  created_at: string;
  order_index?: number;
}
