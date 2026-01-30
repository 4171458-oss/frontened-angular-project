import { Injectable, inject } from '@angular/core';
import { ApiClient } from '../../../core/services/api-client';
import { CreateTeamRequest, AddTeamMemberRequest, Team, TeamDto } from '../../../shared/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TeamsService {
  private readonly api = inject(ApiClient);

  getTeams(): Observable<Team[]> {
    return this.api.get<TeamDto[]>('teams').pipe(
      map(teams => teams.map(team => ({
        id: team.id,
        name: team.name,
        description: team.description,
        ownerId: team.owner_id,
        ownerName: team.owner_name,
        createdAt: team.created_at,
        memberCount: team.members_count || 0
      } as Team)))
    );
  }

  createTeam(payload: CreateTeamRequest): Observable<Team> {
    return this.api.post<Team>('teams', payload);
  }

  addTeamMember(teamId: number, payload: { userId: number, role?: 'member' }): Observable<void> {
    const requestPayload: AddTeamMemberRequest = {
      userId: payload.userId,
      role: payload.role || 'member'
    };
    return this.api.post<void>(`teams/${teamId}/members`, requestPayload);
  }

  deleteTeam(teamId: number): Observable<void> {
    return this.api.delete<void>(`teams/${teamId}`);
  }
}

