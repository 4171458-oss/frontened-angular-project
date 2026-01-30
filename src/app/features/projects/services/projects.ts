import { Injectable, inject } from '@angular/core';
import { Project } from '../../../shared/models';
import { ApiClient } from '../../../core/services/api-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private readonly api = inject(ApiClient);

  getProjects(): Observable<Project[]> {
    return this.api.get<Project[]>('projects');
  }

  getProject(projectId: string): Observable<Project> {
    return this.api.get<Project>(`projects/${projectId}`);
  }

  createProject(payload: {
    teamId: string;
    name: string;
    description?: string;
  }): Observable<Project> {
    return this.api.post<Project>('projects', payload);
  }

  updateProject(
    projectId: string,
    payload: { name?: string; description?: string }
  ): Observable<Project> {
    return this.api.put<Project>(`projects/${projectId}`, payload);
  }

  deleteProject(projectId: string): Observable<void> {
    return this.api.delete<void>(`projects/${projectId}`);
  }
}
