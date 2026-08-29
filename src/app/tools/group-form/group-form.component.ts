import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { IotService } from '../../services/iot/iot.service';
import { UUID } from '../../interfaces/commons.interface';
import { Project } from '../../interfaces/iot.interface';
import { SelectComponent } from '../select/select.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ServicesStatus } from '../../enums/services-status.enum';

@Component({
  selector: 'app-group-form',
  imports: [ReactiveFormsModule, SelectComponent],
  templateUrl: './group-form.component.html',
  styleUrl: './group-form.component.scss'
})
export class GroupFormComponent {
  platformService: IotService = inject(IotService);
  projects: Project[] = [];
  activeModal = inject(NgbActiveModal);
  sevicesStatus = ServicesStatus;
  submitStatus: ServicesStatus = ServicesStatus.IDLE;
  statusMessage: string | null = null;

  constructor() {
    this.platformService.getProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
      },
      error: (err) => console.error(err),
    });
  }
  get projectOptions() {
    return this.projects.map(p => ({key: p.id as string, value: p.name}))
  }
  groupForm = new FormGroup({
    project: new FormControl<{key: string, value: string} | undefined>(undefined, [Validators.required]),
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
  });
  onSubmit() {
    if (this.groupForm.valid) {
      const groupRequest = {
        name: this.groupForm.value.name!,
        description: this.groupForm.value.description ?? '',
        projectId: this.groupForm.value.project?.key! as UUID
      };
      this.submitStatus = ServicesStatus.PROCESS;
      this.platformService.createGroup(groupRequest).subscribe({
        next: (response) => {
          this.statusMessage = `${groupRequest.name} creado correctamente`;
          this.submitStatus = ServicesStatus.SUCCESS;
          setTimeout(() => {
            this.activeModal.close(response);
          }, 1500);
        },
        error: (error) => {
          this.statusMessage = `${groupRequest.name} fallo en la creacion`;
          this.submitStatus = ServicesStatus.ERROR;
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }
}
