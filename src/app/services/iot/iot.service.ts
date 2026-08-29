import { inject, Injectable } from "@angular/core";
import { Device, DeviceRequest, FirmwareVersion, Group, GroupRequest, JobHistoryResponse, Project} from "../../interfaces/iot.interface";
import { RestClientService } from "../rest-client.service";
import { RestCacheConfig, UUID } from "../../interfaces/commons.interface";
import { switchMap, tap } from "rxjs";
import { dowloadResponse } from "../../utils/validators/request.util";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class IotService {
  private http = inject(RestClientService);
  private privateHttp = inject(HttpClient);
  private cacheConfig: RestCacheConfig = {
    expiredTime: 1000 * 60 * 60, // 1 hour
  };
  constructor() { }
  getProjects() {
    return this.http.get<Project[]>(`/platform/projects`, {}, this.cacheConfig);
  }

  createProject(project: Project) {
    return this.http.post<Project>(`/platform/project`, project).pipe(
      tap(() => {
        this.http.updateGetter(`/platform/projects`);
      })
    );
  }

  getAllGroups() {
    return this.http.get<Group[]>(`/platform/projects/groups`, {}, this.cacheConfig);
  }

  getGroups(projectId: UUID) {
    return this.http.get<Group[]>(`/platform/project/${projectId}/groups`, {}, this.cacheConfig);
  }

  createGroup(group: GroupRequest) {
    return this.http.post<Group>(`/platform/project/${group.projectId}/group`, group).pipe(
      tap(() => {
        this.http.updateGetter(`/platform/projects/groups`);
        this.http.updateGetter(`/platform/project/${group.projectId}/groups`);
      })
    );
  }

  getDevices(projectId:UUID, groupId: UUID) {
    return this.http.get<Device[]>(`/platform/project/${projectId}/group/${groupId}/devices`, {}, this.cacheConfig);
  }

  createDevice(device: DeviceRequest) {
    return this.http.post<Blob>(`/platform/project/${device.projectId}/group/${device.groupId}/device`, device, {
      responseType: 'blob' as 'json'
    }).pipe(
      tap(response => {
        dowloadResponse(response, `${device.projectId}-${device.groupId}-${device.name}-cert.zip`);
        this.http.updateGetter(`/platform/project/${device.projectId}/group/${device.groupId}/devices`);
      })
    );
  }

  pushFirmware(projectId: UUID, groupId: UUID, firmwareFile: File) {
    return this.http.post<{presignedUrl: string}>(`/platform/project/${projectId}/group/${groupId}/firmware/presigned-url`, {}).pipe(
      switchMap(response=> this.privateHttp.put(response.presignedUrl, firmwareFile, {headers:{'Content-Type':'application/octet-stream'}}))
    );
  }
  pushFirmwareByDevice(projectId: UUID, groupId: UUID, deviceId:UUID, firmwareFile: File) {
    return this.http.post<{presignedUrl: string}>(`/platform/project/${projectId}/group/${groupId}/device/${deviceId}/firmware/presigned-url`, {}).pipe(
      switchMap(response=> this.privateHttp.put(response.presignedUrl, firmwareFile, {headers:{'Content-Type':'application/octet-stream'}}))
    );
  }

  executeUpdateFirmwareJob(projectId: UUID, groupId: UUID, version: string){
    return this.http.post(`/platform/project/${projectId}/group/${groupId}/firmware/job/update`, {versionId: version})
  }

  getFirmwareVersions(projectId: UUID, groupId: UUID){
    return this.http.get<FirmwareVersion>(`/platform/project/${projectId}/group/${groupId}/firmware/versions`);
  }

  getFirmwareDeviceVersions(projectId: UUID, groupId: UUID, deviceId: UUID){
    return this.http.get<FirmwareVersion>(`/platform/project/${projectId}/group/${groupId}/device/${deviceId}/firmware/versions`);
  }

  getJobHistory(projectId: UUID, groupId: UUID, deviceId: UUID, maxResults?: number, nextToken?: string) {
    let params: any = {};
    if (maxResults) params.maxResults = maxResults;
    if (nextToken) params.nextToken = nextToken;
    return this.http.get<JobHistoryResponse>(`/platform/project/${projectId}/group/${groupId}/device/${deviceId}/jobs`, { params });
  }

}
