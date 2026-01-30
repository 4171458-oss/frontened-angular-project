import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { switchMap, map, catchError, startWith } from 'rxjs/operators';
import { TasksService } from '../../services/tasks';
import { Task, TaskStatus, CreateTaskRequest, UpdateTaskRequest } from '../../../../shared/models';
import { TaskCreate } from '../../components/task-create/task-create';
import { TaskEditorDialog } from '../../components/task-editor-dialog/task-editor-dialog';
import { TaskColumn } from '../../components/task-column/task-column';
import { ToastService } from '../../../../shared/services/toast.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-task-board-page',
  standalone: true,
  imports: [
    CommonModule, 
    TaskCreate, 
    TaskEditorDialog, 
    TaskColumn,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    DragDropModule
  ],
  templateUrl: './task-board-page.html',
  styleUrl: './task-board-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskBoardPage {
  private readonly tasksService = inject(TasksService);
  private readonly route = inject(ActivatedRoute);
  private readonly toastService = inject(ToastService);
  private readonly refreshTrigger$ = new BehaviorSubject<void>(undefined);

  readonly connectedLists = ['TODO', 'IN_PROGRESS', 'DONE'];

  readonly projectId = toSignal(
    this.route.queryParams.pipe(
      map(params => {
        const id = params['projectId'];
        return id ? Number(id) : null;
      })
    ),
    { initialValue: null }
  );

  readonly state = toSignal(
    combineLatest([
      this.route.queryParams.pipe(map(p => Number(p['projectId']) || null)), 
      this.refreshTrigger$
    ]).pipe(
      switchMap(([projectId]) => {
        if (!projectId) {
          return of({ tasks: [], isLoading: false, error: 'No Project Selected' });
        }
        return this.tasksService.getTasks(projectId).pipe(
          map(tasks => ({ tasks, isLoading: false, error: null })),
          startWith({ tasks: [], isLoading: true, error: null }),
          catchError(() => of({ tasks: [], isLoading: false, error: 'Failed to load tasks' }))
        );
      })
    ),
    { initialValue: { tasks: [], isLoading: false, error: null } }
  );

  readonly todoTasks = computed(() => 
    this.state().tasks.filter(t => t.status === TaskStatus.TODO)
  );
  readonly inProgressTasks = computed(() => 
    this.state().tasks.filter(t => t.status === TaskStatus.IN_PROGRESS)
  );
  readonly doneTasks = computed(() => 
    this.state().tasks.filter(t => t.status === TaskStatus.DONE)
  );

  readonly isCreateTaskOpen = signal(false);
  readonly selectedTask = signal<Task | null>(null);

  openCreateTask() {
    this.isCreateTaskOpen.set(true);
  }

  closeCreateTask() {
    this.isCreateTaskOpen.set(false);
  }

  handleCreateTask(payload: any) {
    const pid = this.projectId();
    if (!pid) return;

    const request: CreateTaskRequest = {
      projectId: pid,
      title: payload.title,
      description: payload.description,
      status: TaskStatus.TODO,
      priority: payload.priority,
      dueDate: payload.dueDate
    };

    this.tasksService.createTask(request).subscribe({
      next: () => {
        this.closeCreateTask();
        this.refreshTrigger$.next();
      },
      error: () => console.error('Failed to create task')
    });
  }

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

  // Handle Drag and Drop
  onTaskDrop(event: CdkDragDrop<Task[]>) {
    // 1. If moving in same list (reordering) - optional implementation:
    // Support local optimistic update then API call if project supports ordering.
    // simpler: do nothing for now since we just sort by ID in backend normally
    
    // 2. If moving between lists (status change):
    if (event.previousContainer !== event.container) {
      const task = event.item.data as Task;
      const newStatus = event.container.id as TaskStatus; // TODO: Ensure container ID matches Status enum values
      
      // Optimistic Update (Optional: could be complex with signals) 
      // We will trigger API then refresh for safety first.
      
      this.tasksService.updateTask(task.id, { status: newStatus }).subscribe({
        next: () => {
          this.refreshTrigger$.next();
        },
        error: () => console.error('Failed to move task')
      });
    }
  }
}
