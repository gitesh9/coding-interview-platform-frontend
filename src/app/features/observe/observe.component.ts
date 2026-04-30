import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EditorComponent } from 'ngx-monaco-editor-v2';
import { SessionService } from '@core/services/session-service/session.service';
import { CollaborationService } from '@core/services/collaboration-service/collaboration.service';
import { AuthService } from '@core/services/auth-service/auth.service';
import { InterviewSession } from '@core/models/auth.model';
import { NotesPanelComponent } from './components/notes-panel/notes-panel.component';

@Component({
  selector: 'app-observe',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    EditorComponent,
    NotesPanelComponent,
  ],
  templateUrl: './observe.component.html',
  styleUrl: './observe.component.css',
})
export class ObserveComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private sessionService = inject(SessionService);
  private collaborationService = inject(CollaborationService);
  private authService = inject(AuthService);

  session = signal<InterviewSession | null>(null);
  candidateCode = signal('// Waiting for candidate to start coding...');
  candidateLanguage = signal('python');
  loading = signal(true);
  connected = signal(false);
  showNotes = signal(true);

  editorOptions = {
    theme: 'vs-dark',
    language: 'python',
    readOnly: true,
    minimap: { enabled: false },
    fontSize: 14,
    automaticLayout: true,
    renderLineHighlight: 'line' as const,
    scrollBeyondLastLine: false,
  };

  ngOnInit(): void {
    const sessionId = this.route.snapshot.paramMap.get('sessionId');
    if (!sessionId) return;

    this.sessionService.getSession(sessionId).subscribe({
      next: (session) => {
        this.session.set(session);
        this.loading.set(false);
        this.connectToSession(sessionId);
      },
      error: () => this.loading.set(false),
    });
  }

  private connectToSession(sessionId: string): void {
    const userId = this.authService.currentUser()?.id;
    if (!userId) return;

    this.collaborationService.connect(sessionId, userId);
    this.connected.set(true);

    this.collaborationService.onCodeUpdate$.subscribe((update) => {
      this.candidateCode.set(update.code);
      if (update.language !== this.candidateLanguage()) {
        this.candidateLanguage.set(update.language);
        this.editorOptions = {
          ...this.editorOptions,
          language: update.language,
        };
      }
    });
  }

  toggleNotes(): void {
    this.showNotes.update((v) => !v);
  }

  ngOnDestroy(): void {
    this.collaborationService.disconnect();
  }
}
