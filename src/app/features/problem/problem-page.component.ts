import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AngularSplitModule } from 'angular-split';
import { ProblemService } from '@core/services/problem-service/problem.service';
import { CodeExecutionService } from '@core/services/code-execution/code-execution.service';
import { Problem, SubmissionResult } from '@core/models/problem.model';
import { ProblemDescriptionComponent } from './components/problem-description/problem-description.component';
import { CodeEditorComponent } from './components/code-editor/code-editor.component';
import { TestCasesComponent } from './components/test-cases/test-cases.component';

@Component({
  selector: 'app-problem-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AngularSplitModule,
    ProblemDescriptionComponent,
    CodeEditorComponent,
    TestCasesComponent
  ],
  templateUrl: './problem-page.component.html',
  styleUrl: './problem-page.component.css'
})
export class ProblemPageComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private problemService = inject(ProblemService);
  private executionService = inject(CodeExecutionService);
  private subscriptions: Subscription[] = [];

  problem = signal<Problem | null>(null);
  error = signal<string | null>(null);
  loading = signal(true);
  submissionResult = signal<SubmissionResult | null>(null);
  currentCode = '';
  currentLanguage = 'python';

  ngOnInit(): void {
    this.subscriptions.push(
      this.route.paramMap.subscribe(params => {
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
          }
        });
      }),
      this.executionService.run$.subscribe(() => this.onRun()),
      this.executionService.submit$.subscribe(() => this.onSubmit())
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onCodeChange(code: string): void {
    this.currentCode = code;
  }

  onLanguageChange(language: string): void {
    this.currentLanguage = language;
  }

  onRun(): void {
    const problem = this.problem();
    if (!problem) return;
    this.submissionResult.set(this.problemService.getMockSubmissionResult(problem));
  }

  onSubmit(): void {
    const problem = this.problem();
    if (!problem) return;
    this.submissionResult.set(this.problemService.getMockSubmissionResult(problem));
  }
}
