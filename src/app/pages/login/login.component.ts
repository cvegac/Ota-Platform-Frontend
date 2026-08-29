import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  errorMessage: string | null = null;
  isLoading = false;

  public auth = () => {
    this.errorMessage = null;
    this.isLoading = true;
    this.authService.login(
      this.loginForm.get('username')?.value || '',
      this.loginForm.get('password')?.value || ''
    ).subscribe({
      next: () => this.router.navigate(['/project']),
      error: (err) => {
        this.errorMessage = err || 'Credenciales inválidas. Intenta de nuevo.';
        this.isLoading = false;
      },
    });
  }
}
