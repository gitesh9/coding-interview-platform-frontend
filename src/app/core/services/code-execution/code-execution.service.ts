import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { SubmissionResult } from '@core/models/problem.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CodeExecutionService {
  private apiUrl = environment.apiGatewayUrl;
  private runSubject = new Subject<void>();
  private submitSubject = new Subject<void>();

  run$ = this.runSubject.asObservable();
  submit$ = this.submitSubject.asObservable();

  constructor(private http: HttpClient) {}

  triggerRun(): void {
    this.runSubject.next();
  }

  triggerSubmit(): void {
    this.submitSubject.next();
  }

  runCode(
    problemId: number,
    code: string,
    language: string,
  ): Observable<SubmissionResult> {
    return this.http.post<SubmissionResult>(
      `${this.apiUrl}/problems/${problemId}/run`,
      { code, language },
    );
  }

  submitCode(
    problemId: number,
    code: string,
    language: string,
  ): Observable<SubmissionResult> {
    return this.http.post<SubmissionResult>(
      `${this.apiUrl}/problems/${problemId}/submit`,
      { code, language },
    );
  }
}
