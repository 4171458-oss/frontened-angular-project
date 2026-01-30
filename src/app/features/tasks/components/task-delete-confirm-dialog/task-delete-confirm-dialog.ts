import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../../../shared/models';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-task-delete-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './task-delete-confirm-dialog.html',
  styleUrl: './task-delete-confirm-dialog.scss',
})
export class TaskDeleteConfirmDialog {
  @Input({ required: true }) task!: Task;
  @Output()confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }
  
  onCancel() {
    this.cancel.emit();
  }
}
