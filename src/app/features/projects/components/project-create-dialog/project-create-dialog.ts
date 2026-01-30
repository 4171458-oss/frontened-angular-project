import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

export type CreateProjectPayload = {
  name: string;
  description?: string;
};

@Component({
  selector: 'app-project-create-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './project-create-dialog.html',
  styleUrl: './project-create-dialog.scss',
})
export class ProjectCreateDialog {
  @Output() close = new EventEmitter<void>();
  @Output() createProject = new EventEmitter<CreateProjectPayload>();

  isSubmitting = false;
  form: FormGroup;

  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
  });
  }

  onSubmit(): void {
    if (this.form.invalid || this.isSubmitting) return;

    const { name, description } = this.form.getRawValue();
    const payload: CreateProjectPayload = {
      name: name.trim(),
      description: description?.trim() || undefined,
    };

    console.log('ProjectCreateDialog emitting:', payload);
    this.isSubmitting = true;
    this.createProject.emit(payload);
    this.form.reset();
    this.isSubmitting = false;
  }

  onCancel(): void {
    this.form.reset();
    this.close.emit();
  }
}