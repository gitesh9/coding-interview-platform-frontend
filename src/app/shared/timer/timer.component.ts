import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimerService } from '@core/services/timer-service/timer.service';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.css',
})
export class TimerComponent {
  timerService = inject(TimerService);
  isEditing = signal(false);
  editValue = '';

  startEditing(): void {
    if (this.timerService.isRunning()) return;
    this.isEditing.set(true);
    // Pre-fill with current remaining time formatted as MM:SS or HH:MM:SS
    this.editValue = this.timerService.formattedTime;
  }

  confirmEdit(): void {
    const seconds = this.parseTime(this.editValue);
    if (seconds > 0) {
      this.timerService.setDuration(seconds);
    }
    this.isEditing.set(false);
  }

  cancelEdit(): void {
    this.isEditing.set(false);
  }

  onEditKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.confirmEdit();
    } else if (event.key === 'Escape') {
      this.cancelEdit();
    }
  }

  private parseTime(value: string): number {
    const trimmed = value.trim();
    // Try MM:SS or HH:MM:SS
    const parts = trimmed.split(':').map((p) => parseInt(p, 10));
    if (parts.some(isNaN)) return 0;

    if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    } else if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    // Try plain number as minutes
    const num = parseInt(trimmed, 10);
    return isNaN(num) ? 0 : num * 60;
  }
}
