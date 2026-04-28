import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';

// PrimeNG Modules for v17
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    RouterLink, 
    RouterLinkActive, 
    ButtonModule, 
    AvatarModule, 
    TooltipModule,
    InputTextModule,
    BadgeModule
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {
  private authService = inject(AuthService);
  user$ = this.authService.currentUser$;
  isSidebarCollapsed = false;
  today = new Date();

  menuItems = [
    { label: 'Dashboard', icon: 'pi pi-home', route: '/dashboard' },
    { label: 'Báscula', icon: 'pi pi-server', route: '/bascula' },
    { label: 'Beneficio', icon: 'pi pi-bolt', route: '/beneficio' },
    { label: 'Desposte', icon: 'pi pi-objects-column', route: '/desposte' },
    { label: 'Acondicionamiento', icon: 'pi pi-box', route: '/acondicionamiento' },
    { label: 'Despacho', icon: 'pi pi-truck', route: '/despacho' },
    { label: 'Reportes', icon: 'pi pi-chart-bar', route: '/reportes' },
    { label: 'Configuración', icon: 'pi pi-cog', route: '/config' },
  ];

  constructor() {}

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  logout() {
    this.authService.logout();
  }
}
