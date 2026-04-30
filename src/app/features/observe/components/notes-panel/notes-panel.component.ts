import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Note {
  text: string;
  timestamp: Date;
}

@Component({
  selector: 'app-notes-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notes-panel.component.html',
  styleUrl: './notes-panel.component.css',
})
export class NotesPanelComponent implements OnInit {
  @Input() sessionId = '';

  notes = signal<Note[]>([]);
  newNote = '';

  private storageKey(): string {
    return `interview_notes_${this.sessionId}`;
  }

  ngOnInit(): void {
    this.loadNotes();
  }

  addNote(): void {
    const text = this.newNote.trim();
    if (!text) return;

    this.notes.update((prev) => [...prev, { text, timestamp: new Date() }]);
    this.newNote = '';
    this.saveNotes();
  }

  removeNote(index: number): void {
    this.notes.update((prev) => prev.filter((_, i) => i !== index));
    this.saveNotes();
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.addNote();
    }
  }

  private saveNotes(): void {
    localStorage.setItem(this.storageKey(), JSON.stringify(this.notes()));
  }

  private loadNotes(): void {
    const stored = localStorage.getItem(this.storageKey());
    if (stored) {
      try {
        this.notes.set(JSON.parse(stored));
      } catch {
        this.notes.set([]);
      }
    }
  }
}
