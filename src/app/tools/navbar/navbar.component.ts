import { Component, inject } from '@angular/core';
import { BarOptionComponent } from '../bar-option/bar-option.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [BarOptionComponent]
})
export class NavbarComponent {
  router = inject(Router);

  
  get currentProject(){
    return this.router.url.split('/')[2];
  }
}
