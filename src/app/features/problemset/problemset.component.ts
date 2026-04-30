import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  computed,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ProblemService } from '@core/services/problem-service/problem.service';
import { ProblemListItem } from '@core/models/problem.model';

@Component({
  selector: 'app-problemset',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './problemset.component.html',
  styleUrl: './problemset.component.css',
})
export class ProblemsetComponent implements OnInit, OnDestroy {
  private problemService = inject(ProblemService);
  private subscriptions: Subscription[] = [];
  private searchSubject = new Subject<string>();

  allProblems = signal<ProblemListItem[]>([]);
  filteredProblems = signal<ProblemListItem[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  searchQuery = signal('');
  isSearching = signal(false);

  // Pagination
  currentPage = signal(1);
  pageSize = signal(20);
  selectedDifficulty = signal<string>('All');

  totalFilteredProblems = computed(() => this.filteredProblems().length);

  totalPages = computed(() =>
    Math.max(1, Math.ceil(this.totalFilteredProblems() / this.pageSize())),
  );

  paginatedProblems = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return this.filteredProblems().slice(start, end);
  });

  pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: (number | '...')[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 3) pages.push('...');
      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (current < total - 2) pages.push('...');
      pages.push(total);
    }

    return pages;
  });

  difficulties: string[] = ['All', 'Easy', 'Medium', 'Hard'];

  ngOnInit(): void {
    this.loadProblems();

    this.subscriptions.push(
      this.searchSubject
        .pipe(
          debounceTime(400),
          distinctUntilChanged(),
          switchMap((query) => {
            if (!query.trim()) {
              this.isSearching.set(false);
              this.applyFilters(this.allProblems());
              return [];
            }
            this.isSearching.set(true);
            return this.problemService.searchProblems(query);
          }),
        )
        .subscribe({
          next: (results) => {
            if (results.length !== undefined) {
              this.applyFilters(results);
            }
            this.isSearching.set(false);
          },
          error: () => {
            this.isSearching.set(false);
            this.error.set('Search failed. Please try again.');
          },
        }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
    this.searchSubject.complete();
  }

  loadProblems(): void {
    this.loading.set(true);
    this.error.set(null);
    this.subscriptions.push(
      this.problemService.getProblems().subscribe({
        next: (problems) => {
          this.allProblems.set(problems);
          this.applyFilters(problems);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Failed to load problems. Please try again later.');
          this.loading.set(false);
        },
      }),
    );
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
    this.searchSubject.next(value);
  }

  onDifficultyChange(difficulty: string): void {
    this.selectedDifficulty.set(difficulty);
    this.currentPage.set(1);
    const source = this.searchQuery().trim()
      ? this.filteredProblems()
      : this.allProblems();
    this.applyFilters(source, difficulty);
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.searchSubject.next('');
    this.applyFilters(this.allProblems());
  }

  goToPage(page: number | '...'): void {
    if (page === '...') return;
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
    }
  }

  getDifficultyClass(difficulty: string): string {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'text-green-60';
      case 'medium':
        return 'text-yellow-500';
      case 'hard':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  }

  trackByProblemId(_index: number, problem: ProblemListItem): number {
    return problem.id;
  }

  private applyFilters(problems: ProblemListItem[], difficulty?: string): void {
    const diff = difficulty ?? this.selectedDifficulty();
    let filtered = problems;

    if (diff !== 'All') {
      filtered = problems.filter(
        (p) => p.difficulty?.toLowerCase() === diff.toLowerCase(),
      );
    }

    this.filteredProblems.set(filtered);
    if (this.currentPage() > this.totalPages()) {
      this.currentPage.set(1);
    }
  }
}
