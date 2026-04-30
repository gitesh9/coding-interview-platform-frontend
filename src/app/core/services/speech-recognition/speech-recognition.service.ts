import { Injectable, signal, NgZone, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SpeechRecognitionService {
  private zone = inject(NgZone);
  private recognition: SpeechRecognition | null = null;

  isSupported = signal(false);
  isListening = signal(false);
  transcript = signal('');
  error = signal<string | null>(null);

  constructor() {
    const SpeechRecognitionClass =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognitionClass) {
      this.isSupported.set(true);
      this.recognition = new SpeechRecognitionClass();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event) => {
        this.zone.run(() => {
          let finalTranscript = '';
          let interimTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            if (result.isFinal) {
              finalTranscript += result[0].transcript;
            } else {
              interimTranscript += result[0].transcript;
            }
          }
          this.transcript.set(finalTranscript || interimTranscript);
        });
      };

      this.recognition.onerror = (event) => {
        this.zone.run(() => {
          if (event.error !== 'aborted') {
            this.error.set(event.error);
          }
          this.isListening.set(false);
        });
      };

      this.recognition.onend = () => {
        this.zone.run(() => {
          this.isListening.set(false);
        });
      };
    }
  }

  startListening(): void {
    if (!this.recognition || this.isListening()) return;
    this.transcript.set('');
    this.error.set(null);
    this.isListening.set(true);
    this.recognition.start();
  }

  stopListening(): void {
    if (!this.recognition || !this.isListening()) return;
    this.recognition.stop();
  }

  toggleListening(): void {
    this.isListening() ? this.stopListening() : this.startListening();
  }
}
