import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { TeamsService } from '../../services/teams';
import { UsersService } from '../../../../core/services/users';
import { Team } from '../../../../shared/models';
import { TeamList } from '../../components/team-list/team-list';
import { TeamAddMemberDialog } from '../../components/team-add-member-dialog/team-add-member-dialog';
import { TeamCreateDialog } from '../../components/team-create-dialog/team-create-dialog';
import { ToastService } from '../../../../shared/services/toast.service';
import { ConfirmDialogService } from '../../../../shared/services/confirm-dialog.service';

// Material Imports
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-teams-page',
  standalone: true,
  imports: [
    CommonModule, 
    TeamList, 
    TeamAddMemberDialog, 
    TeamCreateDialog,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './teams-page.html',
  styleUrl: './teams-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamsPage {
  private readonly teamsService = inject(TeamsService);
  private readonly usersService = inject(UsersService);
  private readonly toastService = inject(ToastService);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly refreshTrigger$ = new BehaviorSubject<void>(undefined);

  readonly state = toSignal(
    this.refreshTrigger$.pipe(
      switchMap(() => 
        this.teamsService.getTeams().pipe(
          map(teams => ({ teams, isLoading: false, error: null })),
          startWith({ teams: [], isLoading: true, error: null }),
          catchError(() => of({ teams: [], isLoading: false, error: 'Failed to load teams.' }))
        )
      )
    ),
    { initialValue: { teams: [], isLoading: true, error: null } }
  );


  readonly selectedTeamId = signal<number | null>(null);
  readonly isCreateTeamModalOpen = signal(false);
  
  // Add member dialog state
  readonly isAddMemberDialogOpen = signal(false);
  readonly isAddingMemberLoading = signal(false);
  readonly addMemberError = signal<string | null>(null);

  openAddMemberModal(teamId: number) {
    this.selectedTeamId.set(teamId);
    this.addMemberError.set(null);
    this.isAddMemberDialogOpen.set(true);
    this.isAddingMemberLoading.set(false);
  }

  closeAddMemberModal() {
    this.selectedTeamId.set(null);
    this.addMemberError.set(null);
    this.isAddMemberDialogOpen.set(false);
    this.isAddingMemberLoading.set(false);
  }

  openCreateTeamModal() {
    this.isCreateTeamModalOpen.set(true);
  }

  closeCreateTeamModal() {
    this.isCreateTeamModalOpen.set(false);
  }

  readonly users = toSignal(this.usersService.getUsers(), { initialValue: [] });

  onAddMemberSubmit(userIdInput: string) {
    const teamId = this.selectedTeamId();
    if (!teamId) return;

    const userId = Number(userIdInput);
    if (isNaN(userId)) {
      this.addMemberError.set('Invalid User ID');
      return;
    }

    // Get current member count before adding
    const currentTeam = this.state().teams.find(t => t.id === teamId);
    const memberCountBefore = currentTeam?.memberCount || 0;
    console.log('Member count BEFORE adding:', memberCountBefore);

    this.isAddingMemberLoading.set(true);
    this.addMemberError.set(null);

    this.teamsService.addTeamMember(teamId, { userId }).subscribe({
      next: () => {
        // Reload teams first
        this.teamsService.getTeams().subscribe({
          next: (teams) => {
            const updatedTeam = teams.find(t => t.id === teamId);
            const memberCountAfter = updatedTeam?.memberCount || 0;
            console.log('Member count AFTER adding:', memberCountAfter);
            
            this.closeAddMemberModal();
            
            // Check if member count actually changed
            if (memberCountAfter === memberCountBefore) {
              // Member was already in the group!
              this.confirmDialog.confirm({
                title: '⚠️ Member Already Exists',
                message: 'This user is already a member of this group! The member count did not change because this person was already part of the team.',
                confirmText: 'OK',
                cancelText: '',
                type: 'warning'
              }).subscribe();
            } else {
              this.toastService.success('Team member added successfully!');
            }
            
            this.refreshTrigger$.next();
          }
        });
      },
      error: (err) => {
        console.error('Failed to add member:', err);
        console.error('Error status:', err.status);
        this.isAddingMemberLoading.set(false);
        if (err.status === 409) {
           // Member already exists - show prominent error message
           const errorMsg = 'MEMBER ALREADY EXISTS IN THIS GROUP!';
           console.log('Setting error message:', errorMsg);
           this.addMemberError.set(errorMsg);
        } else if (err.status === 500) {
           this.addMemberError.set('User not found or server error.');
        } else if (err.status === 400 || err.status === 404) {
           this.addMemberError.set('Invalid request. Please select a valid user.');
        } else {
           this.addMemberError.set('Failed to add member. Please try again.');
        }
      },
    });
  }

  onDeleteTeam(teamId: number) {
    this.confirmDialog.confirm({
      title: 'Delete Team',
      message: 'Are you sure you want to delete this team? This action cannot be undone and all team data will be lost.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger'
    }).subscribe(confirmed => {
      if (confirmed) {
        this.teamsService.deleteTeam(teamId).subscribe({
          next: () => {
            this.toastService.success('Team deleted successfully');
            this.refreshTrigger$.next();
          },
          error: (err) => {
            console.error('Failed to delete team', err);
            this.toastService.error('Failed to delete team. Please try again');
          }
        });
      }
    });
  }

  onCreateTeamSubmit(payload: { name: string; description?: string }) {
    this.teamsService.createTeam(payload).subscribe({
      next: () => {
        this.closeCreateTeamModal();
        this.toastService.success('Team created successfully!');
        this.refreshTrigger$.next();
      },
      error: () => {
        this.toastService.error('Failed to create team. Please try again');
      },
    });
  }

  onTeamCreated() {
    this.isCreateTeamModalOpen.set(false);
    this.refreshTrigger$.next();
  }
}

