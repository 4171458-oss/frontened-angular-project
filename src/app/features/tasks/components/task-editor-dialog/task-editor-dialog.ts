import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task, TaskStatus } from '../../../../shared/models';
import { CommentList } from '../../../comments/components/comment-list/comment-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { TaskDeleteConfirmDialog } from '../task-delete-confirm-dialog/task-delete-confirm-dialog'; // Import

@Component({
  selector: 'app-task-editor-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    CommentList,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatDividerModule,
    TaskDeleteConfirmDialog // Add to imports
  ],
  templateUrl: './task-editor-dialog.html',
  styleUrl: './task-editor-dialog.scss',
})
export class TaskEditorDialog implements OnChanges {
  @Input({ required: true }) task!: Task;
  @Output() save = new EventEmitter<{id: number, data: Partial<Task>}>();
  @Output() delete = new EventEmitter<number>();
  @Output() cancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  
  form: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    dueDate: [''],
    priority: ['MEDIUM'],
    status: ['TODO']
  });

  isSubmitting = false;
  showDeleteConfirm = signal<boolean>(false); // Signal for confirmation dialog

  get modalTitle(): string {
    return `Edit Task #${this.task.id}`;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task'] && this.task) {
      this.form.patchValue({
        title: this.task.title,
        description: this.task.description,
        dueDate: this.task.dueDate ? new Date(this.task.dueDate) : null,
        priority: this.task.priority,
        status: this.task.status
      });
    }
  }

  onSave() {
    if (this.form.invalid || this.isSubmitting) return;
    
    this.isSubmitting = true;
    const formValue = this.form.value;
    const payload: Partial<Task> = {
      title: formValue.title,
      description: formValue.description,
  
      dueDate: formValue.dueDate ? new Date(formValue.dueDate).toISOString() : undefined,
      priority: formValue.priority,
      status: formValue.status
    };

    this.save.emit({ id: this.task.id, data: payload });
  }

  onDeleteClick() {
     this.showDeleteConfirm.set(true);
  }

  onDeleteConfirm() {
    this.showDeleteConfirm.set(false);
    this.delete.emit(this.task.id);
  }

  onDeleteCancel() {
      this.showDeleteConfirm.set(false);
  }

  onCancel() {
    this.cancel.emit();
  }
}
  

