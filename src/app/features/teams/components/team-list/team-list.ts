import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Team } from '../../../../shared/models';
import { TeamCard } from '../team-card/team-card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [CommonModule, TeamCard, MatIconModule],
  templateUrl: './team-list.html',
  styleUrls: ['./team-list.scss'],
})
export class TeamList {
  @Input() teams: Team[] = [];
  @Output() addMember = new EventEmitter<number>();
  @Output() deleteTeam = new EventEmitter<number>();

  forwardAddMember(teamId: number) {
    this.addMember.emit(teamId);
  }

  forwardDeleteTeam(teamId: number) {
    this.deleteTeam.emit(teamId);
  }
}

