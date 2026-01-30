import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-task-create-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './task-create.html',
  styleUrl: './task-create.scss',
})
export class TaskCreate {
  @Output() taskCreated = new EventEmitter<any>();
  @Output() dialogClosed = new EventEmitter<void>();

  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    dueDate: [''],
    priority: ['MEDIUM'], 
  });

  isSubmitting = false;

  onSubmit() {
    if (this.form.invalid || this.isSubmitting) return;
    this.isSubmitting = true;

    this.taskCreated.emit(this.form.value);
  }

  onCancel() {
    this.dialogClosed.emit();
  }
}
