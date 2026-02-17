import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite'
import { NavbarComponent } from './navigation/navbar/navbar.component';
import { SidebarComponent } from './navigation/sidebar/sidebar.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    initFlowbite();
  }
  title = 'coding-interview-platform';
}
