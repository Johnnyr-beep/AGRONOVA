import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainLayoutComponent } from './layout/main-layout.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: '', 
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'bascula', loadComponent: () => import('./bascula/bascula.component').then(m => m.BasculaComponent) },
      { path: 'peso-en-pie', loadComponent: () => import('./peso-en-pie/peso-en-pie.component').then(m => m.PesoEnPieComponent) },
      { path: 'beneficio', loadComponent: () => import('./beneficio/beneficio.component').then(m => m.BeneficioComponent) },
      { path: 'desposte', loadComponent: () => import('./desposte/desposte.component').then(m => m.DesposteComponent) },
      { path: 'despacho', loadComponent: () => import('./despacho/despacho.component').then(m => m.DespachoComponent) },
      { path: 'acondicionamiento', loadComponent: () => import('./acondicionamiento/acondicionamiento.component').then(m => m.AcondicionamientoComponent) },
      { path: 'config', loadComponent: () => import('./config/config.component').then(m => m.ConfigComponent) },
      { path: 'reportes', loadComponent: () => import('./reportes/reportes.component').then(m => m.ReportesComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
