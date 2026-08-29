import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'check-item',
  imports: [FormsModule],
  templateUrl: './check-item.component.html',
  styleUrl: './check-item.component.scss'
})
export class CheckItemComponent {
  isChecked = false;

  onCheckboxChange() {
    console.log('Checkbox cambiado:', this.isChecked);
  }
}
