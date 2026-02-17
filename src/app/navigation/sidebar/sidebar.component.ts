import { CommonModule } from '@angular/common';
import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  isHidden = false;

  toggle() {
    console.log("here:")
    this.isHidden = !this.isHidden;
  }

  hide() {
    this.isHidden = false;
  }

  show() {
    this.isHidden = true;
  }
}
