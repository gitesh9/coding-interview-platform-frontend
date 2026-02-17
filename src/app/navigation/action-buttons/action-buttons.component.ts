import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-action-buttons',
  imports: [CommonModule],
  templateUrl: './action-buttons.component.html',
  styleUrl: './action-buttons.component.css'
})
export class ActionButtonsComponent {
  loading = false;
  execute(){
    this.loading = true
    setTimeout(()=>this.loading=false,5000)
  }
}
