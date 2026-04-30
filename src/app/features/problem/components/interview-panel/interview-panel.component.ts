import {
  Component,
  ElementRef,
  Input,
  ViewChild,
  AfterViewChecked,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InterviewService } from '@core/services/interview-service/interview.service';
import { SpeechRecognitionService } from '@core/services/speech-recognition/speech-recognition.service';

@Component({
  selector: 'app-interview-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './interview-panel.component.html',
  styleUrl: './interview-panel.component.css',
})
export class InterviewPanelComponent implements AfterViewChecked {
  interviewService = inject(InterviewService);
  speechService = inject(SpeechRecognitionService);

  @Input() problemContext = '';
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  userInput = '';
  isMinimized = false;

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  toggleMic(): void {
    if (this.speechService.isListening()) {
      this.speechService.stopListening();
      // Grab final transcript into input
      const transcript = this.speechService.transcript();
      if (transcript) {
        this.userInput = transcript;
      }
    } else {
      this.speechService.startListening();
    }
  }

  sendMessage(): void {
    const text = this.userInput.trim();
    if (!text) return;
    this.interviewService.addUserMessage(text, this.problemContext);
    this.userInput = '';
    this.speechService.transcript.set('');
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  endInterview(): void {
    this.interviewService.endInterview();
  }

  toggleMinimize(): void {
    this.isMinimized = !this.isMinimized;
  }

  private scrollToBottom(): void {
    try {
      const el = this.messagesContainer?.nativeElement;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    } catch {
      // ignore
    }
  }
}
