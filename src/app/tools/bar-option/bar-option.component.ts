import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { UUID } from '../../interfaces/commons.interface';

@Component({
  selector: 'bar-option',
  imports: [],
  templateUrl: './bar-option.component.html',
  styleUrl: './bar-option.component.scss'
})
export class BarOptionComponent {
  router = inject(Router);
  showOptions = false;
  redirect = input<string>('');
  options = input<{name: string,  id: UUID}[]>([])
  toggleOptions() {
    this.showOptions = !this.showOptions;
  }

  onRedirect(id: UUID ) {
    console.log('Redirecting to', id);
    const origin =computed(() => this.redirect())().replace(':id', id.toString());
    console.log('Redirecting to', origin);
    this.router.navigateByUrl(origin);
  }
}
