import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditorComponent } from 'ngx-monaco-editor-v2';

interface LanguageOption {
  id: string;
  label: string;
  monacoLanguage: string;
}

@Component({
  selector: 'app-code-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, EditorComponent],
  templateUrl: './code-editor.component.html',
  styleUrl: './code-editor.component.css'
})
export class CodeEditorComponent implements OnInit {
  @Input({ required: true }) starterCode!: Record<string, string>;
  @Output() codeChange = new EventEmitter<string>();
  @Output() languageChange = new EventEmitter<string>();
  @Output() run = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();

  languages: LanguageOption[] = [
    { id: 'python', label: 'Python', monacoLanguage: 'python' },
    { id: 'javascript', label: 'JavaScript', monacoLanguage: 'javascript' },
    { id: 'java', label: 'Java', monacoLanguage: 'java' },
    { id: 'cpp', label: 'C++', monacoLanguage: 'cpp' }
  ];

  selectedLanguage = signal<string>('python');
  isDarkTheme = signal(true);
  code = '';
  showLanguageDropdown = signal(false);

  editorOptions: Record<string, unknown> = {};

  ngOnInit(): void {
    this.code = this.starterCode[this.selectedLanguage()] || '';
    this.updateEditorOptions();
  }

  get currentLanguageLabel(): string {
    return this.languages.find(l => l.id === this.selectedLanguage())?.label || 'Python';
  }

  get currentMonacoLanguage(): string {
    return this.languages.find(l => l.id === this.selectedLanguage())?.monacoLanguage || 'python';
  }

  updateEditorOptions(): void {
    this.editorOptions = {
      theme: this.isDarkTheme() ? 'vs-dark' : 'vs',
      language: this.currentMonacoLanguage,
      minimap: { enabled: false },
      fontSize: 14,
      lineNumbers: 'on',
      automaticLayout: true,
      scrollBeyondLastLine: false,
      padding: { top: 10 },
      renderLineHighlight: 'line',
      cursorBlinking: 'smooth',
      smoothScrolling: true,
      tabSize: 4
    };
  }

  selectLanguage(langId: string): void {
    this.selectedLanguage.set(langId);
    this.code = this.starterCode[langId] || '';
    this.showLanguageDropdown.set(false);
    this.updateEditorOptions();
    this.languageChange.emit(langId);
    this.codeChange.emit(this.code);
  }

  toggleTheme(): void {
    this.isDarkTheme.set(!this.isDarkTheme());
    this.updateEditorOptions();
  }

  resetCode(): void {
    this.code = this.starterCode[this.selectedLanguage()] || '';
    this.codeChange.emit(this.code);
  }

  onCodeChange(value: string): void {
    this.codeChange.emit(value);
  }

  toggleDropdown(): void {
    this.showLanguageDropdown.set(!this.showLanguageDropdown());
  }

  closeDropdown(): void {
    this.showLanguageDropdown.set(false);
  }
}
