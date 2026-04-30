import { Injectable, OnDestroy, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TimerService implements OnDestroy {
  remainingSeconds = signal(0);
  totalSeconds = signal(0);
  isRunning = signal(false);
  isFinished = signal(false);

  private intervalId: ReturnType<typeof setInterval> | null = null;

  setDuration(seconds: number): void {
    this.pause();
    this.totalSeconds.set(seconds);
    this.remainingSeconds.set(seconds);
    this.isFinished.set(false);
  }

  start(): void {
    if (this.isRunning() || this.remainingSeconds() <= 0) return;
    this.isFinished.set(false);
    this.isRunning.set(true);
    this.intervalId = setInterval(() => {
      this.remainingSeconds.update((s) => {
        if (s <= 1) {
          this.pause();
          this.isFinished.set(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }

  pause(): void {
    this.isRunning.set(false);
    this.clearInterval();
  }

  reset(): void {
    this.pause();
    this.remainingSeconds.set(this.totalSeconds());
    this.isFinished.set(false);
  }

  toggle(): void {
    this.isRunning() ? this.pause() : this.start();
  }

  get formattedTime(): string {
    const total = this.remainingSeconds();
    const hrs = Math.floor(total / 3600);
    const mins = Math.floor((total % 3600) / 60);
    const secs = total % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return hrs > 0
      ? `${pad(hrs)}:${pad(mins)}:${pad(secs)}`
      : `${pad(mins)}:${pad(secs)}`;
  }

  private clearInterval(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  ngOnDestroy(): void {
    this.clearInterval();
  }
}
