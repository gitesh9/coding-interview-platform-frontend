import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent {
  capabilities = [
    {
      title: 'Monaco Code Editor',
      description:
        'Write and edit code in a professional-grade editor — the same engine that powers VS Code. Syntax highlighting, auto-complete, bracket matching, and multi-cursor editing across Python, Java, C++, JavaScript, and Go.',
      icon: 'editor',
    },
    {
      title: 'AI Mock Interviewer',
      description:
        'Toggle interview mode to practice with an AI interviewer that asks behavioral and technical follow-up questions in real time. Respond via voice using your microphone or type your answers — just like a real phone screen.',
      icon: 'mic',
    },
    {
      title: 'Context-Aware Hints',
      description:
        'When you are stuck, request a hint. The AI analyzes your current code and nudges you toward the right approach without giving away the answer, helping you develop genuine problem-solving intuition.',
      icon: 'bulb',
    },
    {
      title: 'Countdown Timer',
      description:
        'Set a configurable countdown timer to simulate the time pressure of a real interview. Click the timer to enter a custom duration in MM:SS format and train yourself to solve problems within tight deadlines.',
      icon: 'timer',
    },
    {
      title: 'Test Case Runner',
      description:
        'Execute your code against predefined test cases with a single click. See pass/fail results, compare expected vs. actual output, and iterate quickly until every edge case is handled.',
      icon: 'test',
    },
    {
      title: 'Problem Library',
      description:
        'Browse a curated and growing collection of coding challenges organized by difficulty (Easy, Medium, Hard) and topic — from arrays and hash maps to dynamic programming, trees, and graphs.',
      icon: 'library',
    },
    {
      title: 'Interviewer Dashboard',
      description:
        'Interviewers can create interview sessions, select problems, set time limits, and generate shareable join codes. Track session status from a centralized dashboard — see which sessions are waiting, active, or completed.',
      icon: 'dashboard',
    },
    {
      title: 'Live Code Observation',
      description:
        'Watch candidates code in real time through a read-only editor view. See their language choice, cursor position, and code changes as they happen — powered by WebSocket for low-latency sync.',
      icon: 'observe',
    },
    {
      title: 'Private Interviewer Notes',
      description:
        'Jot down observations during a live session in a private notes panel. Notes are timestamped, auto-saved locally, and visible only to you — never shown to the candidate.',
      icon: 'notes',
    },
    {
      title: 'Role-Based Access',
      description:
        'Sign up as a candidate or an interviewer. Each role gets a tailored experience — candidates see practice tools and session join links, while interviewers get dashboards, observation views, and evaluation tools.',
      icon: 'roles',
    },
  ];
}
