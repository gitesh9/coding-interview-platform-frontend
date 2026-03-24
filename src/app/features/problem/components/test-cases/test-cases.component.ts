import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestCase, SubmissionResult } from '@core/models/problem.model';

@Component({
  selector: 'app-test-cases',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './test-cases.component.html',
  styleUrl: './test-cases.component.css'
})
export class TestCasesComponent {
  @Input({ required: true }) testCases!: TestCase[];
  @Input() submissionResult: SubmissionResult | null = null;

  activeTab = signal<'testcase' | 'result'>('testcase');
  selectedCaseIndex = signal(0);

  get activeTestCase(): TestCase | undefined {
    return this.testCases[this.selectedCaseIndex()];
  }

  get statusClass(): string {
    if (!this.submissionResult) return '';
    return this.submissionResult.status === 'Accepted'
      ? 'text-green-400'
      : 'text-red-400';
  }

  setTab(tab: 'testcase' | 'result'): void {
    this.activeTab.set(tab);
  }

  selectCase(index: number): void {
    this.selectedCaseIndex.set(index);
  }

  caseResultPassed(caseId: number): boolean | null {
    if (!this.submissionResult?.testCaseResults) return null;
    const result = this.submissionResult.testCaseResults.find(r => r.id === caseId);
    return result ? result.passed : null;
  }
}
