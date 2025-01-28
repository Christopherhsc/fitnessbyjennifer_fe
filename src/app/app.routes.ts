import { Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { LandingPageComponent } from './landing-page/components/landing-page/landing-page.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '**', component: LandingPageComponent },
];
