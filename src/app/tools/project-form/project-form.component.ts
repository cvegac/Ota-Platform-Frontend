import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IotService } from '../../services/iot/iot.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ServicesStatus } from '../../enums/services-status.enum';

@Component({
  selector: 'project-form',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.scss'
})
export class ProjectFormComponent {
  platformService: IotService = inject(IotService);
  projectForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
  });
  activeModal = inject(NgbActiveModal, { optional: true });
  @Output() projectCreated = new EventEmitter<any>();
  sevicesStatus = ServicesStatus;
  submitStatus: ServicesStatus = ServicesStatus.IDLE;
  statusMessage: string | null = null;
  onSubmit() {
    if (this.projectForm.valid) {
      const projectRequest = {
        name: this.projectForm.value.name!,
        description: this.projectForm.value.description ?? '',
      };
      this.submitStatus = ServicesStatus.PROCESS;
      this.platformService.createProject(projectRequest).subscribe(
        {
          next: (response) => {
            console.log('Project created successfully:', response);
            this.statusMessage = `${projectRequest.name} creado correctamente`;
            this.submitStatus = ServicesStatus.SUCCESS;
            this.projectCreated.emit(response);
            setTimeout(() => {
              if (this.activeModal) {
                this.activeModal.close(response);
              }
            }, 1500);

          },
          error: (error) => {
            console.error('Error creating project:', error);
            this.statusMessage = `${projectRequest.name} fallo en la creacion`;
            this.submitStatus = ServicesStatus.ERROR;
          }
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
}
