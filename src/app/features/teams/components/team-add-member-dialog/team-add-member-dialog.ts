import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { User } from '../../../../shared/models';

@Component({
  selector: 'app-team-add-member-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatButtonModule],
  templateUrl: './team-add-member-dialog.html',
  styleUrl: './team-add-member-dialog.scss',
})
export class TeamAddMemberDialog {
  @Input() teamid: string = '';
  @Input() isLoading: boolean = false;
  @Input() error: string | null = null;
  @Input() users: User[] = [];
  @Output() onClose = new EventEmitter<void>();
  @Output() addMember = new EventEmitter<string>();
  form: FormGroup;

  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.nonNullable.group({
      userId: [null, Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.invalid || this.isLoading) return;
    this.addMember.emit(this.form.value.userId);
  }

  closeDialog(): void {
    this.onClose.emit();
  }
}

