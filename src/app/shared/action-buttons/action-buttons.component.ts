import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CodeExecutionService } from '@core/services/code-execution/code-execution.service';

@Component({
  selector: 'app-action-buttons',
  imports: [CommonModule],
  templateUrl: './action-buttons.component.html',
  styleUrl: './action-buttons.component.css'
})
export class ActionButtonsComponent {
  private executionService = inject(CodeExecutionService);
  loading = false;

  onRun(): void {
    this.loading = true;
    this.executionService.triggerRun();
    setTimeout(() => this.loading = false, 1500);
  }

  onSubmit(): void {
    this.loading = true;
    this.executionService.triggerSubmit();
    setTimeout(() => this.loading = false, 2000);
  }
}
