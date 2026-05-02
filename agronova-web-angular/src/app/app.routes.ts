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
      { path: 'clientes', loadComponent: () => import('./clientes/clientes.component').then(m => m.ClientesComponent) },
      { path: 'proveedores', loadComponent: () => import('./proveedores/proveedores.component').then(m => m.ProveedoresComponent) },
      { path: 'tipos-producto', loadComponent: () => import('./tipos-producto/tipos-producto.component').then(m => m.TiposProductoComponent) },
      { path: 'cavas', loadComponent: () => import('./cavas/cavas.component').then(m => m.CavasComponent) },
      { path: 'embalajes', loadComponent: () => import('./embalajes/embalajes.component').then(m => m.EmbalajesComponent) },
      { path: 'devoluciones', loadComponent: () => import('./devoluciones/devoluciones.component').then(m => m.DevolucionesComponent) },
      { path: 'pieles', loadComponent: () => import('./pieles/pieles.component').then(m => m.PielesComponent) },
      { path: 'insumos', loadComponent: () => import('./insumos/insumos.component').then(m => m.InsumosComponent) },
      { path: 'movimientos', loadComponent: () => import('./movimientos/movimientos.component').then(m => m.MovimientosComponent) },
      { path: 'traslados', loadComponent: () => import('./traslados/traslados.component').then(m => m.TrasladosComponent) },
      { path: 'liquidaciones', loadComponent: () => import('./liquidaciones/liquidaciones.component').then(m => m.LiquidacionesComponent) },
      { path: 'auditorias', loadComponent: () => import('./auditorias/auditorias.component').then(m => m.AuditoriasComponent) },
      { path: 'config', loadComponent: () => import('./config/config.component').then(m => m.ConfigComponent) },
      { path: 'reportes', loadComponent: () => import('./reportes/reportes.component').then(m => m.ReportesComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
