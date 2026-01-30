import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../../../shared/models';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatTooltipModule, RouterModule],
  templateUrl: './project-card.html',
  styleUrl: './project-card.scss',
})
export class ProjectCard {
  @Input() project!: Project;
  @Input() teamId!: number;
  @Output() deleteProject = new EventEmitter<number>();

  onDeleteClick(event: Event) {
    event.stopPropagation();
    this.deleteProject.emit(this.project.id);
  }
}
