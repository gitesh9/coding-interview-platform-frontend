import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, Subscription, debounceTime } from 'rxjs';
import { AngularSplitModule } from 'angular-split';
import { ProblemService } from '@core/services/problem-service/problem.service';
import { CodeExecutionService } from '@core/services/code-execution/code-execution.service';
import { CollaborationService } from '@core/services/collaboration-service/collaboration.service';
import { SessionService } from '@core/services/session-service/session.service';
import { AuthService } from '@core/services/auth-service/auth.service';
import { Problem, SubmissionResult } from '@core/models/problem.model';
import { ProblemDescriptionComponent } from './components/problem-description/problem-description.component';
import { CodeEditorComponent } from './components/code-editor/code-editor.component';
import { TestCasesComponent } from './components/test-cases/test-cases.component';
import { InterviewPanelComponent } from './components/interview-panel/interview-panel.component';
import { InterviewService } from '@core/services/interview-service/interview.service';

@Component({
  selector: 'app-problem-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AngularSplitModule,
    ProblemDescriptionComponent,
    CodeEditorComponent,
    TestCasesComponent,
    InterviewPanelComponent,
  ],
  templateUrl: './problem-page.component.html',
  styleUrl: './problem-page.component.css',
})
export class ProblemPageComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private problemService = inject(ProblemService);
  private executionService = inject(CodeExecutionService);
  private collaborationService = inject(CollaborationService);
  private sessionService = inject(SessionService);
  private authService = inject(AuthService);
  interviewService = inject(InterviewService);
  private subscriptions: Subscription[] = [];
  private codeUpdateSubject = new Subject<{ code: string; language: string }>();
  private isLiveSession = false;

  problem = signal<Problem | null>(null);
  error = signal<string | null>(null);
  loading = signal(true);
  submissionResult = signal<SubmissionResult | null>(null);
  currentCode = '';
  currentLanguage = 'python';

  ngOnInit(): void {
    // Debounce code updates to WebSocket — send at most every 500ms
    this.subscriptions.push(
      this.codeUpdateSubject
        .pipe(debounceTime(500))
        .subscribe(({ code, language }) => {
          this.collaborationService.sendCodeUpdate(code, language);
        }),
    );

    // Check for live session via query param
    const sessionId = this.route.snapshot.queryParamMap.get('session');
    if (sessionId) {
      const userId = this.authService.currentUser()?.id;
      if (userId) {
        this.isLiveSession = true;
        this.collaborationService.connect(sessionId, userId);
        this.sessionService.activeSession.set(
          this.sessionService.activeSession() ?? null,
        );
      }
    }

    this.subscriptions.push(
      this.route.paramMap.subscribe((params) => {
        const id = Number(params.get('id'));
        if (isNaN(id)) {
          this.error.set('Invalid problem ID');
          this.loading.set(false);
          return;
        }
        this.problemService.getProblemById(id).subscribe({
          next: (problem) => {
            this.problem.set(problem);
            this.loading.set(false);
          },
          error: () => {
            this.error.set('Problem not found');
            this.loading.set(false);
          },
        });
      }),
      this.executionService.run$.subscribe(() => this.onRun()),
      this.executionService.submit$.subscribe(() => this.onSubmit()),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
    this.codeUpdateSubject.complete();
    if (this.isLiveSession) {
      this.collaborationService.disconnect();
    }
  }

  onCodeChange(code: string): void {
    this.currentCode = code;
    if (this.isLiveSession) {
      this.codeUpdateSubject.next({ code, language: this.currentLanguage });
    }
  }

  onLanguageChange(language: string): void {
    this.currentLanguage = language;
    if (this.isLiveSession) {
      // Send language change immediately (rare event, no need to debounce)
      this.collaborationService.sendCodeUpdate(this.currentCode, language);
    }
  }

  onRun(): void {
    const problem = this.problem();
    if (!problem) return;
    this.executionService
      .runCode(problem.id, this.currentCode, this.currentLanguage)
      .subscribe({
        next: (result) => this.submissionResult.set(result),
        error: (err) =>
          this.error.set('Run failed: ' + (err?.error?.error || err.message)),
      });
  }

  onSubmit(): void {
    const problem = this.problem();
    if (!problem) return;
    this.executionService
      .submitCode(problem.id, this.currentCode, this.currentLanguage)
      .subscribe({
        next: (result) => this.submissionResult.set(result),
        error: (err) =>
          this.error.set(
            'Submission failed: ' + (err?.error?.error || err.message),
          ),
      });
  }
}
