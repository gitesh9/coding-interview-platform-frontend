import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private sidebarOpen = new BehaviorSubject<boolean>(false);
  sidebarOpen$ = this.sidebarOpen.asObservable();

  constructor() { }

  setSidebarOpen(value: boolean) {
    this.sidebarOpen.next(value);
  }

  toggleSidebar() {
    this.sidebarOpen.next(!this.sidebarOpen.value);
  }
}
