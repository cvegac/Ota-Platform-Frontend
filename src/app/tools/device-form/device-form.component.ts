import { Component, effect, inject, input, model, OnInit, Signal, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { IotService } from '../../services/iot/iot.service';
import { GenericHash, UUID } from '../../interfaces/commons.interface';
import { Group } from '../../interfaces/iot.interface';
import { SelectComponent } from '../select/select.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ServicesStatus } from '../../enums/services-status.enum';

@Component({
  selector: 'app-device-form',
  imports: [ReactiveFormsModule, SelectComponent],
  templateUrl: './device-form.component.html',
  styleUrl: './device-form.component.scss'
})
export class DeviceFormComponent {

  deviceForm = new FormGroup({
    project: new FormControl<GenericHash | undefined>(undefined, [Validators.required]),
    group: new FormControl<GenericHash | undefined>(undefined, [Validators.required]),
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
  });

  platformService: IotService = inject(IotService);

  inputProject = model<UUID | undefined>();
  inputGroup = model<UUID | undefined>();

  allGroups: Group[] = [];
  projects = signal<GenericHash[]>([]);
  groups = signal<GenericHash[]>([]);

  constructor() {

    this.platformService.getAllGroups().subscribe({
      next: (groups) => {
        this.allGroups = groups;
        const uniqueProjects = new Map<string, string>();
        groups.forEach((group) => {
          uniqueProjects.set(group.projectEntity.id as string, group.projectEntity.name);
        });
        this.projects.set(Array.from(uniqueProjects, ([key, value]) => ({ key, value })));

      }});

    effect(() => {
      if (!this.groups().length || !this.inputGroup()) {
        return;
      }
      this.deviceForm.get('group')?.setValue(this.groups().find((group) => group.key == this.inputGroup()));
    })

    effect(() => {
      if (!this.projects().length || !this.inputProject()) {
        return;
      }
      this.deviceForm.get('project')?.setValue(this.projects().find((project) => project.key == this.inputProject()));
    });

    this.deviceForm.get('project')?.valueChanges.subscribe((project) => {
      if (project?.key) {
        this.groups.set(this.allGroups
          .filter((group) => group.projectEntity.id == project?.key)
          .map((group) => ({ key: group.id as string, value: group.name })));
      }
    });

  }
  activeModal = inject(NgbActiveModal);
  sevicesStatus = ServicesStatus;
  submitStatus: ServicesStatus = ServicesStatus.IDLE;
  statusMessage: string | null = null;

  onSubmit() {
    if (this.deviceForm.valid) {

      const deviceRequest = {
        name: this.deviceForm.value.name!,
        description: this.deviceForm.value.description,
        groupId: this.deviceForm.value.group?.key! as UUID,
        projectId: this.deviceForm.value.project?.key! as UUID,
      };
      this.submitStatus = ServicesStatus.PROCESS;
      this.platformService.createDevice(deviceRequest).subscribe({
        next: (response) => {
          this.statusMessage = `${deviceRequest.name} creado correctamente`;
          this.submitStatus = ServicesStatus.SUCCESS;
          setTimeout(() => {
            this.activeModal.close(response);
          }, 1500);
        },
        error: (error) => {
          this.statusMessage = `${deviceRequest.name} fallo en la creacion`;
          this.submitStatus = ServicesStatus.ERROR;
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }
}
