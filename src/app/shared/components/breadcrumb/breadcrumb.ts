import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, ActivatedRoute, RouterLink } from '@angular/router';
import { filter, map, startWith, switchMap } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { combineLatest, of } from 'rxjs';
import { TeamsService } from '../../../features/teams/services/teams';
import { ProjectsService } from '../../../features/projects/services/projects';

interface Breadcrumb {
  label: string;
  url: string;
  icon?: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.scss'
})
export class BreadcrumbComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly teamsService = inject(TeamsService);
  private readonly projectsService = inject(ProjectsService);

  readonly breadcrumbs = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      startWith(null),
      switchMap(() => this.buildBreadcrumbsAsync())
    ),
    { initialValue: [] }
  );

  private buildBreadcrumbsAsync() {
    const url = this.router.url.split('?')[0];
    const segments = url.split('/').filter(s => s);

    // Always add home
    const breadcrumbs: Breadcrumb[] = [{ label: 'Teams', url: '/teams', icon: 'groups' }];

    // Parse URL segments
    if (segments.length === 0 || segments[0] === 'teams' && segments.length === 1) {
      return of(breadcrumbs);
    }

    // Handle teams/:teamId/projects
    if (segments[0] === 'teams' && segments.length >= 3 && segments[2] === 'projects') {
      const teamId = Number(segments[1]);
      return this.teamsService.getTeams().pipe(
        map(teams => {
          const team = teams.find(t => t.id === teamId);
          breadcrumbs.push({ 
            label: team ? team.name : `Team ${teamId}`, 
            url: `/teams/${teamId}/projects`,
            icon: 'folder'
          });
          breadcrumbs.push({ 
            label: 'Projects', 
            url: `/teams/${teamId}/projects`
          });
          return breadcrumbs;
        })
      );
    }

    // Handle teams/:teamId/tasks with projectId query param
    if (segments[0] === 'teams' && segments.length >= 3 && segments[2] === 'tasks') {
      const teamId = Number(segments[1]);
      const queryParams = new URLSearchParams(this.router.url.split('?')[1] || '');
      const projectId = queryParams.get('projectId');

      if (!projectId) {
        return of(breadcrumbs);
      }

      return combineLatest([
        this.teamsService.getTeams(),
        this.projectsService.getProjects()
      ]).pipe(
        map(([teams, projects]) => {
          const team = teams.find(t => t.id === teamId);
          const project = projects.find(p => p.id === Number(projectId));
          
          breadcrumbs.push({ 
            label: team ? team.name : `Team ${teamId}`, 
            url: `/teams/${teamId}/projects`,
            icon: 'folder'
          });
          
          breadcrumbs.push({ 
            label: project ? project.name : `Project ${projectId}`, 
            url: `/teams/${teamId}/projects`,
            icon: 'work'
          });
          
          breadcrumbs.push({ 
            label: 'Task Board', 
            url: `/teams/${teamId}/tasks?projectId=${projectId}`,
            icon: 'view_kanban'
          });
          
          return breadcrumbs;
        })
      );
    }

    return of(breadcrumbs);
  }
}
