import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NavigationService } from '@core/services/navigation-service/navigation.service';
import { ProblemService } from '@core/services/problem-service/problem.service';
import { Problem } from '@core/models/problem.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  isOpen = false;
  problems: Problem[] = [];
  @ViewChild('allProblemsLink', { static: false }) allProblemsLink!: ElementRef;
  @ViewChild('drawer', { static: false }) drawer!: ElementRef;

  constructor(
    private stateService: NavigationService,
    private problemService: ProblemService,
  ) {}

  ngOnInit() {
    // Load problems
    this.problemService.getProblems().subscribe((problems) => {
      this.problems = problems;
    });

    this.stateService.sidebarOpen$.subscribe((open) => {
      this.isOpen = open;
      if (open) {
        console.log(open);
        // Optional: Add focus logic here
        setTimeout(() => {
          console.log('opened.', this.allProblemsLink.nativeElement);
          this.allProblemsLink.nativeElement?.focus();
        }, 100);
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const button = document.querySelector('#sidebar-button');
    const clickedButton = button?.contains(event.target as Node);
    if (
      this.isOpen &&
      this.drawer &&
      !this.drawer.nativeElement.contains(event.target) &&
      !clickedButton
    ) {
      this.closeSidebar();
    }
  }
  closeSidebar() {
    this.stateService.setSidebarOpen(false);
  }

  getDifficultyClass(difficulty: string): string {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-600 dark:text-green-400';
      case 'Medium':
        return 'text-orange-600 dark:text-orange-400';
      case 'Hard':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  }

  getSolvedCount(): number {
    return this.problems.filter((problem) => problem.isSolved).length;
  }
}
