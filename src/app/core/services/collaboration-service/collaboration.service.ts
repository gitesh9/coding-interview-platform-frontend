import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface CodeUpdate {
  code: string;
  language: string;
}

@Injectable({ providedIn: 'root' })
export class CollaborationService {
  private apiUrl = environment.apiGatewayUrl;
  private ws: WebSocket | null = null;

  private codeUpdateSubject = new Subject<CodeUpdate>();
  onCodeUpdate$ = this.codeUpdateSubject.asObservable();

  private chatMessageSubject = new Subject<{ sender: string; text: string }>();
  onChatMessage$ = this.chatMessageSubject.asObservable();

  constructor(private http: HttpClient) {}

  createSession(): Observable<any> {
    return this.http.post(`${this.apiUrl}/collab/`, {});
  }

  connect(sessionId: string, userId: string): void {
    const wsUrl = this.apiUrl.replace(/^http/, 'ws');
    this.ws = new WebSocket(`${wsUrl}/collab/${sessionId}?userId=${userId}`);

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        switch (data.type) {
          case 'code_update':
            this.codeUpdateSubject.next({
              code: data.code,
              language: data.language,
            });
            break;
          case 'chat_message':
            this.chatMessageSubject.next({
              sender: data.sender,
              text: data.text,
            });
            break;
        }
      } catch {
        // ignore malformed messages
      }
    };
  }

  sendCodeUpdate(code: string, language: string): void {
    this.send({ type: 'code_update', code, language });
  }

  sendChatMessage(text: string, sender: string): void {
    this.send({ type: 'chat_message', text, sender });
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  private send(data: object): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }
}
