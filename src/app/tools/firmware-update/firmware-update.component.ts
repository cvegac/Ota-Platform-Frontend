import { Component, effect, inject, signal } from '@angular/core';
import { SelectComponent } from '../select/select.component';
import { GenericHash, UUID } from '../../interfaces/commons.interface';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Group } from '../../interfaces/iot.interface';
import { IotService } from '../../services/iot/iot.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ServicesStatus } from '../../enums/services-status.enum';

@Component({
  selector: 'app-firmware-update',
  imports: [SelectComponent, ReactiveFormsModule],
  templateUrl: './firmware-update.component.html',
  styleUrl: './firmware-update.component.scss',
})
export class FirmwareUpdateComponent {
  platformService: IotService = inject(IotService);

  projects = signal<GenericHash[]>([]);
  groups = signal<GenericHash[]>([]);
  device = signal<GenericHash[]>([]);

  allGroups: Group[] = [];
  fileToUpload: File | null = null;
  private readonly allDevicesKey = 'Todos los dispositivos';
  firmwareForm = new FormGroup({
    project: new FormControl<GenericHash | undefined>(undefined, [
      Validators.required,
    ]),
    group: new FormControl<GenericHash | undefined>(undefined, [
      Validators.required,
    ]),
    firmware: new FormControl<File | undefined>(undefined),
    device: new FormControl<GenericHash | undefined>(undefined, [
      Validators.required,
    ]),
  });
  activeModal = inject(NgbActiveModal);
  sevicesStatus = ServicesStatus;
  submitStatus: ServicesStatus = ServicesStatus.IDLE;
  statusMessage: string | null = null;

  constructor() {
    this.platformService.getAllGroups().subscribe({
      next: (groups) => {
        this.allGroups = groups;
        const uniqueProjects = new Map<string, string>();
        groups.forEach((group) => {
          uniqueProjects.set(
            group.projectEntity.id as string,
            group.projectEntity.name
          );
        });
        this.projects.set(
          Array.from(uniqueProjects, ([key, value]) => ({ key, value }))
        );
      },
    });

    this.firmwareForm.get('project')?.valueChanges.subscribe((project) => {
      console.log(project?.key);
      if (project?.key) {
        this.groups.set(
          this.allGroups
            .filter((group) => group.projectEntity.id == project?.key)
            .map((group) => ({ key: group.id as string, value: group.name }))
        );
      }
    });
    this.firmwareForm.get('group')?.valueChanges.subscribe((group) => {
      console.log(group?.key);
      if (group?.key) {
        this.platformService
          .getDevices(
            this.firmwareForm.get('project')?.value?.value! as UUID,
            group.key as UUID
          )
          .subscribe((devices) => {
            const deviceList = [
              {
                key: this.allDevicesKey,
                value: this.allDevicesKey,
              } as GenericHash,
            ];
            const deviceRequest = devices.map(
              (device) =>
                ({
                  key: device.id as string,
                  value: device.name,
                } as GenericHash)
            );

            deviceList.push(...deviceRequest);
            this.device.set(deviceList);
          });
      } else {
        this.device.set([]);
      }
    });
  }

  uploadFirmware() {
    const projectKey = this.firmwareForm.get('project')?.value?.key as UUID;
    const groupKey = this.firmwareForm.get('group')?.value?.key as UUID;
    const deviceKey = this.firmwareForm.get('device')?.value?.key;
    const firmwareFile = this.fileToUpload;

    if (!projectKey || !groupKey || !firmwareFile) return;

    this.submitStatus = ServicesStatus.PROCESS;

    const isSingleDevice = deviceKey !== this.allDevicesKey;

    const firmwareObservable = isSingleDevice
      ? this.platformService.pushFirmwareByDevice(projectKey, groupKey, deviceKey as UUID, firmwareFile)
      : this.platformService.pushFirmware(projectKey, groupKey, firmwareFile);

    firmwareObservable.subscribe({
      next: (response) => {
        this.statusMessage = 'Firmware actualizado correctamente';
        this.submitStatus = ServicesStatus.SUCCESS;
        setTimeout(() => {
          this.activeModal.close(response);
        }, 1500);
      },
      error: (error) => {
        this.statusMessage = 'Error al actualizar el firmware';
        this.submitStatus = ServicesStatus.ERROR;
      }
    });
  }
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.fileToUpload = file;
      this.firmwareForm.patchValue({ firmware: file });
    }
  }
}
