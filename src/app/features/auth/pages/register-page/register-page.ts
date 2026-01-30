import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth';
import { AuthResponse } from '../../../../shared/models';
import { ToastService } from '../../../../shared/services/toast.service';

// Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './register-page.html',
  styleUrl: './register-page.scss',
})
export class RegisterPage {
  isSubmitting: boolean = false;
  errorMessage: string | null = null;

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly toastService = inject(ToastService);
  
  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  ngOnInit() {
    
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['']);
    }
  }

  get name() {
    return this.form.get('name');
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  onSubmit() {
    this.form.markAllAsTouched();

    if (this.form.invalid || this.isSubmitting) {
      this.toastService.warning('Please fill in all required fields correctly');
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    this.authService
      .register(this.form.value as any)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: (res: AuthResponse) => {
          this.toastService.success('Account created successfully! Welcome to TeamTasks');
          this.router.navigate(['']);
        },
        error: (err: any) => {
          this.errorMessage =
            'Registration failed. Please try again with a different email.';
          this.toastService.error('Registration failed. This email may already be in use');
        },
      });
  }
}
