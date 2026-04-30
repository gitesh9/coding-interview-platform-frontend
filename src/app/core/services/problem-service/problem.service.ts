import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Problem, ProblemListItem } from '@core/models/problem.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProblemService {
  private apiUrl = environment.apiGatewayUrl;

  constructor(private http: HttpClient) {}

  getProblems(): Observable<ProblemListItem[]> {
    return this.http.get<ProblemListItem[]>(`${this.apiUrl}/get/problems-set/`);
  }

  searchProblems(query: string): Observable<ProblemListItem[]> {
    return this.http.get<ProblemListItem[]>(`${this.apiUrl}/get/problems`, {
      params: { value: query },
    });
  }

  getProblemById(id: number): Observable<Problem> {
    return this.http.get<Problem>(`${this.apiUrl}/get/problems/${id}`);
  }
}
