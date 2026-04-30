import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { InterviewSession } from '@core/models/auth.model';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiGatewayUrl;

  activeSession = signal<InterviewSession | null>(null);
  sessions = signal<InterviewSession[]>([]);

  getMySessions(): Observable<InterviewSession[]> {
    return this.http
      .get<InterviewSession[]>(`${this.apiUrl}/interviews/sessions`)
      .pipe(tap((sessions) => this.sessions.set(sessions)));
  }

  getSession(id: string): Observable<InterviewSession> {
    return this.http.get<InterviewSession>(
      `${this.apiUrl}/interviews/sessions/${id}`,
    );
  }

  createSession(data: {
    problemIds: number[];
    timeLimit: number;
  }): Observable<InterviewSession> {
    return this.http
      .post<InterviewSession>(`${this.apiUrl}/interviews/sessions`, data)
      .pipe(
        tap((session) => {
          this.sessions.update((prev) => [session, ...prev]);
        }),
      );
  }

  joinSession(joinCode: string): Observable<InterviewSession> {
    return this.http
      .post<InterviewSession>(`${this.apiUrl}/interviews/sessions/join`, {
        joinCode,
      })
      .pipe(tap((session) => this.activeSession.set(session)));
  }

  endSession(id: string): Observable<InterviewSession> {
    return this.http
      .patch<InterviewSession>(
        `${this.apiUrl}/interviews/sessions/${id}/end`,
        {},
      )
      .pipe(
        tap((session) => {
          this.activeSession.set(null);
          this.sessions.update((prev) =>
            prev.map((s) => (s.id === id ? session : s)),
          );
        }),
      );
  }
}
