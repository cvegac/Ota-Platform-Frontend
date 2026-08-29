import { Component, inject } from '@angular/core';
import { NavbarComponent } from "../../tools/navbar/navbar.component";
import { ContentComponent } from '../content/content.component';
import { RouterOutlet } from '@angular/router';
import { IotService } from '../../services/iot/iot.service';
import { Project } from '../../interfaces/iot.interface';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [NavbarComponent, ContentComponent, RouterOutlet]
})
export class HomeComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  projects: Project[] = [];
  platformService: IotService = inject(IotService);
  
  public currentUser = this.authService.currentUser;

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
