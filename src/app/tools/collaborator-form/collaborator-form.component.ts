import { Component, EventEmitter, inject, Input, Output, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ServicesStatus } from '../../enums/services-status.enum';
import { UUID } from '../../interfaces/commons.interface';

@Component({
  selector: 'collaborator-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './collaborator-form.component.html',
  styleUrl: './collaborator-form.component.scss'
})
export class CollaboratorFormComponent {
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  activeModal = inject(NgbActiveModal, { optional: true });

  @Input() projectId!: UUID;
  @Output() collaboratorCreated = new EventEmitter<any>();

  collaboratorForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  servicesStatus = ServicesStatus;
  submitStatus: ServicesStatus = ServicesStatus.IDLE;
  statusMessage: string | null = null;

  onSubmit() {
    if (this.collaboratorForm.valid && this.projectId) {
      const { name, email, username, password } = this.collaboratorForm.value;
      this.submitStatus = ServicesStatus.PROCESS;
      
      this.authService.createCollaborator(
        name!, email!, username!, password!, this.projectId as string
      ).subscribe({
        next: (response) => {
          this.statusMessage = `Colaborador ${name} registrado correctamente`;
          this.submitStatus = ServicesStatus.SUCCESS;
          this.cdr.detectChanges();
          this.collaboratorCreated.emit(response);
          setTimeout(() => {
            if (this.activeModal) {
              this.activeModal.close(response);
            }
          }, 1500);
        },
        error: (error) => {
          this.statusMessage = error || 'Error al registrar colaborador';
          this.submitStatus = ServicesStatus.ERROR;
          this.cdr.detectChanges();
        }
      });
    }
  }
}
