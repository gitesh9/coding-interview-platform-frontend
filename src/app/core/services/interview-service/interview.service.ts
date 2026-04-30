import { Injectable, inject, signal } from '@angular/core';
import { AiMessage } from '@core/models/ai.model';
import { AiService } from '@core/services/ai-service/ai.service';
import { TimerService } from '@core/services/timer-service/timer.service';

@Injectable({ providedIn: 'root' })
export class InterviewService {
  private aiService = inject(AiService);
  private timerService = inject(TimerService);

  isInterviewMode = signal(false);
  conversationHistory = signal<AiMessage[]>([]);
  isAiThinking = signal(false);

  startInterview(problemContext: string): void {
    this.isInterviewMode.set(true);
    this.conversationHistory.set([]);
    this.isAiThinking.set(true);
    // Set a 45-minute default interview duration if no timer is already set
    if (this.timerService.totalSeconds() === 0) {
      this.timerService.setDuration(45 * 60);
    } else {
      this.timerService.reset();
    }
    this.timerService.start();

    this.aiService
      .getInterviewQuestion(problemContext, [])
      .subscribe((question) => {
        this.conversationHistory.update((history) => [
          ...history,
          {
            role: 'interviewer' as const,
            content: question,
            timestamp: new Date(),
          },
        ]);
        this.isAiThinking.set(false);
      });
  }

  endInterview(): void {
    this.isInterviewMode.set(false);
    this.conversationHistory.set([]);
    this.isAiThinking.set(false);
    this.timerService.pause();
  }

  addUserMessage(text: string, problemContext: string): void {
    if (!text.trim()) return;

    const userMessage: AiMessage = {
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    this.conversationHistory.update((history) => [...history, userMessage]);
    this.isAiThinking.set(true);

    this.aiService
      .respondToAnswer(text, problemContext, this.conversationHistory())
      .subscribe((response) => {
        this.conversationHistory.update((history) => [
          ...history,
          {
            role: 'interviewer' as const,
            content: response,
            timestamp: new Date(),
          },
        ]);
        this.isAiThinking.set(false);
      });
  }
}
