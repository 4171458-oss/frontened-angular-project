import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { ProjectsService } from '../../services/projects';
import { ProjectCreateDialog } from '../../components/project-create-dialog/project-create-dialog';
import { ProjectList } from '../../components/project-list/project-list';
import { ToastService } from '../../../../shared/services/toast.service';
import { ConfirmDialogService } from '../../../../shared/services/confirm-dialog.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ProjectCreateDialog,
    ProjectList,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './projects-page.html',
  styleUrl: './projects-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsPageComponent {
  private readonly projectsService = inject(ProjectsService);
  private readonly route = inject(ActivatedRoute);
  private readonly toastService = inject(ToastService);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly refreshTrigger$ = new BehaviorSubject<void>(undefined);


  private readonly paramMap = toSignal(this.route.paramMap);
  

  readonly currentTeamId = computed(() => {
    const params = this.paramMap();
    const id = params?.get('teamId');
    return id ? Number(id) : null;
  });


  readonly state = toSignal(
    this.refreshTrigger$.pipe(
      switchMap(() => 
        this.projectsService.getProjects().pipe(
          map(projects => ({
            allProjects: projects,
            isLoading: false,
            error: null
          })),
          startWith({ allProjects: [], isLoading: true, error: null }),
          catchError(() => of({ 
            allProjects: [], 
            isLoading: false, 
            error: 'Failed to load projects' 
          }))
        )
      )
    ),
    { initialValue: { allProjects: [], isLoading: true, error: null } }
  );

  // 4. Senior Architect Level: Computed Filter
  // This derives the view purely from the current state and current team ID
  readonly filteredProjects = computed(() => {
    const { allProjects } = this.state();
    const teamId = this.currentTeamId();

    if (!teamId) return allProjects;
    
    return allProjects.filter(p => p.team_id === teamId);
  });

  readonly createProjectModalOpen = signal(false);
  readonly createError = signal<string | null>(null);

  openCreateProjectModal(): void {
    this.createProjectModalOpen.set(true);
    this.createError.set(null);
  }

  closeCreateProjectModal(): void {
    this.createProjectModalOpen.set(false);
  }

  onCreateProjectSubmit(payload: { name: string; description?: string }): void {
    const teamId = this.currentTeamId();
    if (!teamId) return;

    const createPayload = {
      teamId: teamId.toString(),
      ...payload
    };

    this.projectsService.createProject(createPayload).subscribe({
      next: (newProject) => {
        this.closeCreateProjectModal();
        this.refreshTrigger$.next();
        this.toastService.success('Project created successfully!');
      },
      error: (err) => {
        this.createError.set('Failed to create project. Please try again.');
        this.toastService.error('Failed to create project. Please try again');
      }
    });
  }

  onDeleteProject(projectId: number) {
    this.confirmDialog.confirm({
      title: 'Delete Project',
      message: 'Are you sure you want to delete this project? This action cannot be undone and all project tasks will be lost.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger'
    }).subscribe(confirmed => {
      if (confirmed) {
        this.projectsService.deleteProject(projectId.toString()).subscribe({
          next: () => {
            this.toastService.success('Project deleted successfully');
            this.refreshTrigger$.next();
          },
          error: (err) => {
            console.error('Failed to delete project', err);
            this.toastService.error('Failed to delete project. Please try again');
          }
        });
      }
    });
  }
}