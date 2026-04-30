import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SessionService } from '@core/services/session-service/session.service';

@Component({
  selector: 'app-join',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './join.component.html',
  styleUrl: './join.component.css',
})
export class JoinComponent {
  private sessionService = inject(SessionService);
  private router = inject(Router);

  joinCode = '';
  error = signal<string | null>(null);
  loading = signal(false);

  onSubmit(): void {
    const code = this.joinCode.trim();
    if (!code) {
      this.error.set('Please enter a join code.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.sessionService.joinSession(code).subscribe({
      next: (session) => {
        this.loading.set(false);
        const problemId = session.problemIds[0];
        this.router.navigate(['/problem', problemId], {
          queryParams: { session: session.id },
        });
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Invalid or expired join code.');
      },
    });
  }
}
