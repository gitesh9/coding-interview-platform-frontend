import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { NavigationService } from '@core/services/navigation-service/navigation.service';
import { RouterModule } from '@angular/router';
import { Drawer } from 'flowbite';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  isOpen = false;
  @ViewChild("allProblemsLink", { static: false }) allProblemsLink!: ElementRef;
  @ViewChild("drawer", { static: false }) drawer!: ElementRef;

  constructor(private stateService: NavigationService) { }

  ngOnInit() {
    this.stateService.sidebarOpen$.subscribe(open => {
      this.isOpen = open;
      if (open) {
        console.log(open)
        // Optional: Add focus logic here
        setTimeout(() => {
          console.log("opened.", this.allProblemsLink.nativeElement)
          this.allProblemsLink.nativeElement?.focus();
        }, 100);
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const button = document.querySelector('#sidebar-button');
    const clickedButton = button?.contains(event.target as Node)
    if (this.isOpen && this.drawer && !this.drawer.nativeElement.contains(event.target) && !clickedButton) {
      this.closeSidebar();
    }
  }
  closeSidebar() {
    this.stateService.setSidebarOpen(false);
  }
}
