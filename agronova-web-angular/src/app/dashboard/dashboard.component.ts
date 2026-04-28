import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ReportesService } from '../services/reportes.service';
import { StatCardComponent } from '../shared/stat-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, StatCardComponent],
  template: `
    <div class="space-y-5 animate-fade-in">
      <!-- Hero Welcome -->
      <div class="glass-card p-7 relative overflow-hidden"
           style="background:linear-gradient(135deg,rgba(108,92,231,.1) 0%,rgba(0,206,201,.05) 50%,rgba(16,18,24,.75) 100%);border-color:rgba(108,92,231,.15)">
        <div class="absolute pointer-events-none" style="top:-50%;right:-20%;width:300px;height:300px;background:radial-gradient(circle,rgba(108,92,231,.15),transparent 70%)"></div>
        <div class="relative z-10 flex justify-between items-center">
          <div>
            <h1 class="text-xl font-extrabold text-white tracking-tight">
              Planta de Beneficio <span class="gradient-text">AGRONOVA</span>
            </h1>
            <p class="text-xs mt-1" style="color:#7C8190">Procesamiento bovino y porcino — {{ today | date:'dd MMMM yyyy' }}</p>
          </div>
          <div class="hidden md:flex items-center gap-2">
            <button class="flex items-center gap-2 px-5 py-2.5 rounded-xl border-none cursor-pointer font-bold text-xs text-white transition-all"
                    style="background:linear-gradient(135deg,#6C5CE7,#00CEC9);box-shadow:0 4px 20px rgba(108,92,231,.3)">
              <i class="pi pi-plus text-xs"></i> Nuevo Lote
            </button>
            <button class="flex items-center gap-2 px-5 py-2.5 rounded-xl cursor-pointer font-semibold text-xs transition-all"
                    style="background:transparent;border:1px solid rgba(255,255,255,.06);color:#7C8190">
              <i class="pi pi-download text-xs"></i> Exportar
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <app-stat-card title="Cabezas Procesadas" [value]="stats?.cantidadAnimales || '0'" unit="Hoy" severity="slate"></app-stat-card>
        <app-stat-card title="Rendimiento Canal" [value]="stats?.pesoEntradaTotal ? '52.4%' : '0%'" severity="info"></app-stat-card>
        <app-stat-card title="Peso en Báscula" [value]="stats?.pesoSalidaTotal || '0'" unit="KG" severity="warning"></app-stat-card>
        <app-stat-card title="Despachos del Día" [value]="stats?.pesoNetoTotal ? '8' : '0'" severity="success"></app-stat-card>
      </div>

      <!-- Chart + Activity -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <!-- Chart -->
        <div class="lg:col-span-2 glass-card p-7">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-sm font-bold text-white">Producción por Especie</h3>
            <div class="flex p-1 rounded-xl" style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06)">
              <button class="px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider"
                      style="background:rgba(108,92,231,.12);color:#6C5CE7">Semanal</button>
              <button class="px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider"
                      style="color:#3D4050">Mensual</button>
            </div>
          </div>
          <div class="flex gap-4 mb-4">
            <span class="flex items-center gap-2 text-[10px] font-medium" style="color:#7C8190">
              <span class="inline-block w-2 h-[3px] rounded" style="background:#6C5CE7"></span> Bovino
            </span>
            <span class="flex items-center gap-2 text-[10px] font-medium" style="color:#7C8190">
              <span class="inline-block w-2 h-[3px] rounded" style="background:#FD79A8"></span> Porcino
            </span>
          </div>
          <div class="h-40 w-full flex items-end space-x-1.5">
            <div *ngFor="let v of [45,60,55,80,75,90,100,85,70,95,80,60]"
                 class="flex-1 rounded-t-lg transition-all duration-500 cursor-pointer group relative"
                 [style.height.%]="v"
                 style="background:linear-gradient(180deg,rgba(108,92,231,.35) 0%,rgba(108,92,231,.08) 100%);border-top:2px solid rgba(108,92,231,.4)">
              <div class="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                   style="color:#6C5CE7">{{v}}%</div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="glass-card p-7 flex flex-col">
          <h3 class="text-sm font-bold text-white mb-5">Accesos Rápidos</h3>
          <div class="space-y-2 flex-1">
            <button class="quick-action-btn group">
              <div class="quick-action-icon" style="background:rgba(108,92,231,.1);color:#6C5CE7">
                <i class="pi pi-box text-base"></i>
              </div>
              <div class="ml-3 text-left">
                <p class="text-xs font-bold text-white">Nueva Faena</p>
                <p class="text-[9px]" style="color:#3D4050">Ingresar canal a línea</p>
              </div>
              <i class="pi pi-chevron-right ml-auto text-xs opacity-0 group-hover:opacity-100 transition-all" style="color:#6C5CE7"></i>
            </button>
            <button class="quick-action-btn group">
              <div class="quick-action-icon" style="background:rgba(0,206,201,.1);color:#00CEC9">
                <i class="pi pi-print text-base"></i>
              </div>
              <div class="ml-3 text-left">
                <p class="text-xs font-bold text-white">Imprimir Guías</p>
                <p class="text-[9px]" style="color:#3D4050">Documentación legal</p>
              </div>
              <i class="pi pi-chevron-right ml-auto text-xs opacity-0 group-hover:opacity-100 transition-all" style="color:#00CEC9"></i>
            </button>
            <button class="quick-action-btn group">
              <div class="quick-action-icon" style="background:rgba(253,203,110,.1);color:#FDCB6E">
                <i class="pi pi-chart-bar text-base"></i>
              </div>
              <div class="ml-3 text-left">
                <p class="text-xs font-bold text-white">Reporte Diario</p>
                <p class="text-[9px]" style="color:#3D4050">Cierre de operaciones</p>
              </div>
              <i class="pi pi-chevron-right ml-auto text-xs opacity-0 group-hover:opacity-100 transition-all" style="color:#FDCB6E"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .quick-action-btn {
      width: 100%; display: flex; align-items: center; padding: 12px;
      border-radius: 12px; border: 1px solid rgba(255,255,255,.06);
      background: rgba(255,255,255,.02); cursor: pointer; transition: all 0.3s;
    }
    .quick-action-btn:hover {
      background: rgba(108,92,231,.04); border-color: rgba(108,92,231,.15);
      transform: translateX(4px);
    }
    .quick-action-icon {
      width: 40px; height: 40px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    :host ::ng-deep .p-card { background: transparent; border: none; }
  `]
})
export class DashboardComponent {
  stats: any = null;
  today = new Date();

  constructor(private reportesService: ReportesService) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.reportesService.getDashboardStats().subscribe({
      next: (data) => this.stats = data,
      error: (err) => console.error('Error fetching dashboard stats', err)
    });
  }
}
