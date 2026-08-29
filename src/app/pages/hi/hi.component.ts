import { Component, inject } from '@angular/core';
import { ProjectFormComponent } from '../../tools/project-form/project-form.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hi',
  imports: [ProjectFormComponent],
  templateUrl: './hi.component.html',
  styleUrl: './hi.component.scss'
})
export class HiComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  currentUser = this.authService.currentUser;

  onProjectCreated(project: any) {
    console.log('Project created, redirecting in 2 seconds...');
    setTimeout(() => {
      this.router.navigate(['/project']);
    }, 2000);
  }
}
