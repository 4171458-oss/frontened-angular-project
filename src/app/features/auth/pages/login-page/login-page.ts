import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { AuthResponse, LoginRequest } from '../../../../shared/models';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../../shared/services/toast.service';

// Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-login-page',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly toastService = inject(ToastService);
  
  form = this.fb.nonNullable.group({
    email:['', [Validators.required, Validators.email]],
    password:['', [Validators.required, Validators.minLength(6)]],
  });
 
  isSubmitting: boolean = false;
  errorMessage: string | null = null;
  
  ngOnInit() {

  if (this.authService.isAuthenticated()) {
    this.router.navigate(['']);
  }
}


get email() {
  return this.form.get('email');
}
get password() {
  return this.form.get('password');
}

onSubmit() {
  this.form.markAllAsTouched();
  

  if (this.form.invalid||this.isSubmitting) {
    this.toastService.warning('Please fill in all required fields correctly');
    return;
  }
  this.isSubmitting = true;
  this.errorMessage = null;
  this.authService.login(this.form.value as LoginRequest).pipe(finalize(() => { this.isSubmitting = false; })).subscribe({
    next: (res: AuthResponse) => {
      this.toastService.success('Welcome back! Login successful');
      this.router.navigate(['']);
    },
        error: (err: any) => {
          this.errorMessage = 'Login failed. Please check your email and password and try again.';
          this.toastService.error('Login failed. Please check your credentials and try again');
        }
      });
  }
}






