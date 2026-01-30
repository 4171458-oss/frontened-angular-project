import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, of } from 'rxjs';
import { switchMap, map, catchError, startWith } from 'rxjs/operators';
import { TasksService } from '../../services/tasks';
import { Task } from '../../../../shared/models';
import { TaskEditorDialog } from '../../components/task-editor-dialog/task-editor-dialog';
import { ToastService } from '../../../../shared/services/toast.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-tasks-page',
  standalone: true,
  imports: [
    CommonModule,
    TaskEditorDialog,
    MatProgressSpinnerModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule
  ],
  templateUrl: './all-tasks-page.html',
  styleUrl: './all-tasks-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AllTasksPage {
  private readonly tasksService = inject(TasksService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  private readonly refreshTrigger$ = new BehaviorSubject<void>(undefined);

  readonly state = toSignal(
    this.refreshTrigger$.pipe(
      switchMap(() =>
        this.tasksService.getTasks().pipe(
          map(tasks => ({ tasks, isLoading: false, error: null })),
          startWith({ tasks: [], isLoading: true, error: null }),
          catchError(() => of({ tasks: [], isLoading: false, error: 'Failed to load tasks' }))
        )
      )
    ),
    { initialValue: { tasks: [], isLoading: true, error: null } }
  );

  readonly selectedTask = signal<Task | null>(null);

  openEditTask(task: Task) {
    this.selectedTask.set(task);
  }

  closeEditTask() {
    this.selectedTask.set(null);
  }

  handleUpdateTask(event: {id: number, data: Partial<Task>}) {
    this.tasksService.updateTask(event.id, event.data).subscribe({
      next: () => {
        this.closeEditTask();
        this.refreshTrigger$.next();
        this.toastService.success('Task updated successfully!');
      },
      error: (err) => {
        console.error('Failed to update task', err);
        this.toastService.error('Failed to update task. Please try again');
      }
    });
  }

  handleDeleteTask(id: number) {
    this.tasksService.deleteTask(id).subscribe({
      next: () => {
        this.closeEditTask();
        this.refreshTrigger$.next();
        this.toastService.success('Task deleted successfully');
      },
      error: (err) => {
        console.error('Failed to delete task', err);
        this.toastService.error('Failed to delete task. Please try again');
      }
    });
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'TODO': 'To Do',
      'IN_PROGRESS': 'In Progress',
      'DONE': 'Done'
    };
    return labels[status] || status;
  }

  getPriorityColor(priority: string): string {
    const colors: Record<string, string> = {
      'HIGH': 'warn',
      'MEDIUM': 'accent',
      'LOW': 'primary'
    };
    return colors[priority] || 'primary';
  }

  navigateToTaskBoard(task: Task) {
    this.router.navigate(['/teams', task.projectId, 'tasks'], {
      queryParams: { projectId: task.projectId }
    });
  }
}
