import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page/landing-page.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
  },
  { path: '**', component: LandingPageComponent },
];
