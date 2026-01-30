import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Team } from '../../../../shared/models';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-team-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './team-card.html',
  styleUrls: ['./team-card.scss'],
})
export class TeamCard {
  @Input() team!: Team;
  @Output() addMember = new EventEmitter<number>();
  @Output() deleteTeam = new EventEmitter<number>();

  private readonly router = inject(Router);

  navigateToProjectsPage() {
   this.router.navigate(['/teams', this.team.id, 'projects']);

  }

  requestAddMember() {
    this.addMember.emit(this.team.id);
  }

  requestDeleteTeam() {
    // Just emit the event - parent will handle confirmation
    this.deleteTeam.emit(this.team.id);
  }
}