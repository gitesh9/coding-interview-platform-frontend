import {
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { NavigationService } from '@core/services/navigation-service/navigation.service';
import { UserComponent } from '../../user/user.component';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '@shared/navigation/sidebar/sidebar.component';
import { ActionButtonsComponent } from '../../action-buttons/action-buttons.component';
import { TimerComponent } from '../../timer/timer.component';
import { InterviewService } from '@core/services/interview-service/interview.service';
import { AuthService } from '@core/services/auth-service/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [
    UserComponent,
    CommonModule,
    SidebarComponent,
    ActionButtonsComponent,
    TimerComponent,
    RouterModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  private router = inject(Router);
  interviewService = inject(InterviewService);
  authService = inject(AuthService);
  currentUrl = signal(this.router.url);
  isProblemPage = computed(() => this.currentUrl().startsWith('/problem/'));

  @ViewChild('problemsButton', { static: false }) problemsButton!: ElementRef;

  constructor(public stateService: NavigationService) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentUrl.set(event.urlAfterRedirects);
      });
  }

  ngOnInit(): void {
    this.stateService.sidebarOpen$.subscribe((open) => {
      console.log('state: ', open);
      if (!open) {
        console.log(open);
        // Optional: Add focus logic here
        setTimeout(() => {
          this.problemsButton?.nativeElement?.focus();
        }, 100);
      }
    });
  }
  openSidebar() {
    this.stateService.setSidebarOpen(true);
  }

  toggleInterview(): void {
    if (this.interviewService.isInterviewMode()) {
      this.interviewService.endInterview();
    } else {
      this.interviewService.startInterview('');
    }
  }
}
