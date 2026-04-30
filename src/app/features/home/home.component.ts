import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  features = [
    {
      icon: 'code',
      title: 'Real Coding Environment',
      description:
        'Write, run, and debug code in a full-featured editor with support for Python, JavaScript, Java, and C++.',
    },
    {
      icon: 'mic',
      title: 'AI Interview Mode',
      description:
        'Practice with an AI interviewer that asks follow-up questions in real time — just like the real thing.',
    },
    {
      icon: 'lightbulb',
      title: 'Smart Hints',
      description:
        'Stuck on a problem? Get intelligent hints based on your code without spoiling the solution.',
    },
    {
      icon: 'dashboard',
      title: 'Interviewer Dashboard',
      description:
        'Create sessions, pick problems, set time limits, and generate join codes — all from a centralized dashboard.',
    },
    {
      icon: 'observe',
      title: 'Live Code Observation',
      description:
        'Watch candidates code in real time through a read-only editor view powered by WebSocket sync.',
    },
    {
      icon: 'notes',
      title: 'Private Notes',
      description:
        'Jot down timestamped observations during live sessions — auto-saved locally, invisible to candidates.',
    },
    {
      icon: 'timer',
      title: 'Countdown Timer',
      description:
        'Set a custom time limit and practice under pressure to build speed and confidence.',
    },
    {
      icon: 'chart',
      title: 'Instant Feedback',
      description:
        'Run your code against test cases and get immediate results with runtime and memory stats.',
    },
    {
      icon: 'layers',
      title: 'Curated Problems',
      description:
        'Tackle a growing library of problems organized by difficulty — from Easy warm-ups to Hard challenges.',
    },
  ];
}
