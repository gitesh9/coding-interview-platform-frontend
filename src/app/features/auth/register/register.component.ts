import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@core/services/auth-service/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  role: 'interviewer' | 'candidate' = 'candidate';
  error = signal<string | null>(null);
  loading = signal(false);

  onSubmit(): void {
    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      this.error.set('Please fill in all fields.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error.set('Passwords do not match.');
      return;
    }

    if (this.password.length < 8) {
      this.error.set('Password must be at least 8 characters.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.authService
      .register({
        name: this.name,
        email: this.email,
        password: this.password,
        role: this.role,
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
          if (this.authService.isInterviewer()) {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/problemset']);
          }
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(
            err.error?.message || 'Registration failed. Please try again.',
          );
        },
      });
  }
}
