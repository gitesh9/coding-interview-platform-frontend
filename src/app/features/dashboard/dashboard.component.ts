import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SessionService } from '@core/services/session-service/session.service';
import { ProblemService } from '@core/services/problem-service/problem.service';
import { AuthService } from '@core/services/auth-service/auth.service';
import { InterviewSession } from '@core/models/auth.model';
import { ProblemListItem } from '@core/models/problem.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private sessionService = inject(SessionService);
  private problemService = inject(ProblemService);
  private authService = inject(AuthService);
  private router = inject(Router);

  sessions = this.sessionService.sessions;
  userName = this.authService.currentUser()?.name ?? 'Interviewer';
  loading = signal(true);
  showCreateModal = signal(false);

  // Create session form
  availableProblems = signal<ProblemListItem[]>([]);
  selectedProblemIds = signal<number[]>([]);
  timeLimit = 45;
  creating = signal(false);

  ngOnInit(): void {
    this.sessionService.getMySessions().subscribe({
      next: () => this.loading.set(false),
      error: () => this.loading.set(false),
    });

    this.problemService.getProblems().subscribe({
      next: (problems) => this.availableProblems.set(problems),
      error: () => {},
    });
  }

  openCreateModal(): void {
    this.showCreateModal.set(true);
  }

  closeCreateModal(): void {
    this.showCreateModal.set(false);
    this.selectedProblemIds.set([]);
    this.timeLimit = 45;
  }

  toggleProblem(id: number): void {
    this.selectedProblemIds.update((ids) =>
      ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id],
    );
  }

  createSession(): void {
    if (this.selectedProblemIds().length === 0) return;
    this.creating.set(true);

    this.sessionService
      .createSession({
        problemIds: this.selectedProblemIds(),
        timeLimit: this.timeLimit,
      })
      .subscribe({
        next: () => {
          this.creating.set(false);
          this.closeCreateModal();
        },
        error: () => this.creating.set(false),
      });
  }

  copyJoinCode(code: string): void {
    navigator.clipboard.writeText(code);
  }

  observeSession(session: InterviewSession): void {
    this.router.navigate(['/observe', session.id]);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'waiting':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'active':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'completed':
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  }
}
