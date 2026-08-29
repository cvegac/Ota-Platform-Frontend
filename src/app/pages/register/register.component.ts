import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  public registerForm: FormGroup = this.fb.group({
    name:     ['', [Validators.required]],
    email:    ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  public errorMessage: string | null = null;

  register() {
    if (this.registerForm.invalid) return;

    const { name, email, username, password } = this.registerForm.value;

    this.authService.register(name, email, username, password)
      .subscribe({
        next: () => this.router.navigateByUrl('/project'),
        error: (message) => {
          this.errorMessage = message;
          this.cdr.detectChanges();
        }
      });
  }
}
