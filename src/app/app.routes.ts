import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component'; // Importar HomeComponent
import { authGuard } from './guards/auth.guard';
import { ContentComponent } from './pages/content/content.component';
import { DeviceComponent } from './pages/device/device.component';
import { GroupComponent } from './pages/group/group.component';
import { ProjectGuard } from './guards/platform.guard';
import { HiComponent } from './pages/hi/hi.component';
import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [
  { path: '', redirectTo: 'project', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {path: 'home', component: HomeComponent,
    canMatch: [authGuard],
    children: [
      { path: 'hi', component: HiComponent },
    ]
  },
  { path: 'project',
    component: HomeComponent,
    canMatch: [ProjectGuard, authGuard],
    children: [

      { path: '', component: ContentComponent},
      { path: 'group/:groupId', component: GroupComponent },
      { path: 'device/:deviceId', component: DeviceComponent }
  ]},
  {path: '**', redirectTo: 'project', pathMatch: 'full' },

];
