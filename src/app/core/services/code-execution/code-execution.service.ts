import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CodeExecutionService {
  private runSubject = new Subject<void>();
  private submitSubject = new Subject<void>();

  run$ = this.runSubject.asObservable();
  submit$ = this.submitSubject.asObservable();

  triggerRun(): void {
    this.runSubject.next();
  }

  triggerSubmit(): void {
    this.submitSubject.next();
  }
}
