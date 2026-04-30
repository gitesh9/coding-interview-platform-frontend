import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AiMessage } from '@core/models/ai.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiGatewayUrl;

  getInterviewQuestion(
    problemContext: string,
    conversationHistory: AiMessage[],
  ): Observable<string> {
    return this.http
      .post<{ response: string }>(`${this.baseUrl}/ai/interview/question`, {
        problemContext,
        conversationHistory: conversationHistory.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      })
      .pipe(map((res) => res.response));
  }

  respondToAnswer(
    userAnswer: string,
    problemContext: string,
    conversationHistory: AiMessage[],
  ): Observable<string> {
    return this.http
      .post<{ response: string }>(`${this.baseUrl}/ai/interview/respond`, {
        userAnswer,
        problemContext,
        conversationHistory: conversationHistory.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      })
      .pipe(map((res) => res.response));
  }

  getHint(
    code: string,
    problemDescription: string,
    language: string,
  ): Observable<string> {
    return this.http
      .post<{ response: string }>(`${this.baseUrl}/ai/hint`, {
        code,
        problemDescription,
        language,
      })
      .pipe(map((res) => res.response));
  }
}
