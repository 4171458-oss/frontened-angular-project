import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../../../shared/models';
import { ProjectCard } from '../project-card/project-card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, ProjectCard, MatIconModule],
  templateUrl: './project-list.html',
  styleUrl: './project-list.scss',
})
export class ProjectList {
  @Input() projects: Project[] = [];
  @Input() teamId!: number;
  @Output() deleteProject = new EventEmitter<number>();

  onDeleteProject(projectId: number) {
    this.deleteProject.emit(projectId);
  }
}
