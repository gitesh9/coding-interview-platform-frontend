import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Problem } from '@core/models/problem.model';

@Component({
  selector: 'app-problem-description',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './problem-description.component.html',
  styleUrl: './problem-description.component.css'
})
export class ProblemDescriptionComponent {
  @Input({ required: true }) problem!: Problem;

  activeTab = signal<'description' | 'editorial' | 'solutions'>('description');

  get difficultyClass(): string {
    switch (this.problem.difficulty) {
      case 'Easy': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'Hard': return 'text-red-400';
    }
  }

  setTab(tab: 'description' | 'editorial' | 'solutions'): void {
    this.activeTab.set(tab);
  }
}
