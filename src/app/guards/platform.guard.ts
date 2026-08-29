import { CanMatchFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { IotService } from '../services/iot/iot.service';


export const ProjectGuard: CanMatchFn = (route, segments) => {
  const iotService = inject(IotService);
  const router = inject(Router);

  return iotService.getProjects().pipe(
    map(projects => {

      if (projects && projects.length > 0) {
        return true;
      } else {
        router.navigate(['home/hi']);
        return false;
      }
    }
  )
);
};
