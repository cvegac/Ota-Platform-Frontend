import { UUID } from './commons.interface';

export interface Device {
  id?: UUID;
  name: String;
  groupName: string;
  description?: string | null;
  groupEntity: Group;
}

export interface Group {
  id?: UUID;
  name: string;
  description?: string | null;
  projectEntity: Project;
}

export interface Project {
  id?: UUID;
  name: string;
  description?: string | null;
}

export interface GroupRequest {
  name: string;
  description?: string | null;
  projectId: UUID;
}

export interface DeviceRequest {
  name: string;
  description?: string | null;
  groupId: UUID;
  projectId: UUID;
}

export interface FirmwareVersion {
  versions: {
    versionId: string;
    lastModified: Date;
    filesize: number;
    latest: boolean;
  }[];
  prefix: string;
  maxKeys: number;
}

export interface JobExecution {
  jobId: string;
  status: string;
  queuedAt: string;
  startedAt: string;
  lastUpdatedAt: string;
}

export interface JobHistoryResponse {
  executions: JobExecution[];
  nextToken: string;
}
