import { Component, inject, model, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IotService } from '../../services/iot/iot.service';
import { JobExecution, JobHistoryResponse } from '../../interfaces/iot.interface';
import { UUID } from '../../interfaces/commons.interface';

@Component({
  selector: 'app-device-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './device-history.component.html',
  styleUrl: './device-history.component.scss'
})
export class DeviceHistoryComponent implements OnInit {
  activeModal = inject(NgbActiveModal);
  private iotService = inject(IotService);

  projectId = model<UUID>();
  groupId = model<UUID>();
  deviceId = model<UUID>();
  deviceName = model<string>();

  executions = signal<JobExecution[]>([]);
  nextToken = signal<string | null>(null);
  loading = signal<boolean>(false);
  currentPage = signal<number>(1);
  tokenHistory: string[] = [];

  get itemRange() {
    const start = (this.currentPage() - 1) * 10 + 1;
    const end = start + this.executions().length - 1;
    return this.executions().length > 0 ? `${start} - ${end}` : '0';
  }

  ngOnInit() {
    this.loadHistory();
  }

  loadHistory(token?: string) {
    if (!this.projectId() || !this.groupId() || !this.deviceId()) {
      return;
    }
    this.loading.set(true);
    this.iotService.getJobHistory(this.projectId()!, this.groupId()!, this.deviceId()!, 10, token).subscribe({
      next: (response: JobHistoryResponse) => {
        this.executions.set(response.executions);
        this.nextToken.set(response.nextToken);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading job history:', err);
        this.loading.set(false);
      }
    });
  }

  nextPage() {
    if (this.nextToken()) {
      this.tokenHistory.push(this.nextToken()!);
      this.loadHistory(this.nextToken()!);
      this.currentPage.update(p => p + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
      this.tokenHistory.pop();
      const prevToken = this.tokenHistory.length > 0 ? this.tokenHistory[this.tokenHistory.length - 1] : undefined;
      this.loadHistory(prevToken);
    }
  }

  getStatusClass(status: string) {
    switch (status.toUpperCase()) {
      case 'SUCCEEDED': return 'badge bg-success';
      case 'FAILED': return 'badge bg-danger';
      case 'IN_PROGRESS': return 'badge bg-primary';
      case 'QUEUED': return 'badge bg-secondary';
      case 'CANCELED': return 'badge bg-warning text-dark';
      default: return 'badge bg-info text-dark';
    }
  }
}
