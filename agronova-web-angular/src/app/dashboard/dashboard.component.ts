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
    <div class="space-y-8 animate-fade-in">
      <!-- Header Industrial -->
      <div class="glass-card p-10 flex justify-between items-center relative overflow-hidden">
        <div class="flex items-center space-x-8 relative z-10">
          <div class="w-24 h-24 flex items-center justify-center p-2">
            <img src="/logo santacruz.png.png" alt="Logo" class="w-full h-auto drop-shadow-[0_0_20px_rgba(164,198,57,0.2)]" />
          </div>
          <div>
            <h1 class="text-4xl font-black text-white tracking-tighter uppercase">AGRONOVA <span class="text-[#a4c639]">Dashboard</span></h1>
            <p class="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-2">Monitoreo Industrial en Tiempo Real</p>
          </div>
        </div>
        <div class="hidden md:block text-right relative z-10">
            <span class="text-[9px] text-slate-700 font-black uppercase tracking-[0.4em] block mb-1">Estado de Planta</span>
            <span class="text-xs font-black text-[#a4c639] uppercase">Sincronizado & Operativo</span>
        </div>
      </div>

      <!-- High-Performance Scale Metrics (Refactored) -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <app-stat-card title="Total Faenado" [value]="stats?.cantidadAnimales || '0'" unit="Reses" severity="slate"></app-stat-card>
        <app-stat-card title="Peso Entrada" [value]="stats?.pesoEntradaTotal || '0.0'" unit="KG" severity="info"></app-stat-card>
        <app-stat-card title="Peso Salida" [value]="stats?.pesoSalidaTotal || '0.0'" unit="KG" severity="warning"></app-stat-card>
        <app-stat-card title="Rendimiento Neto" [value]="stats?.pesoNetoTotal || '0.0'" unit="KG" severity="success"></app-stat-card>
      </div>

      <!-- Industrial Operations -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 glass-card p-10">
          <div class="flex justify-between items-center mb-10 border-b border-white/5 pb-6">
            <div>
                <h3 class="text-2xl font-black text-white uppercase tracking-tight">Rendimiento de Línea</h3>
                <p class="text-[9px] text-slate-600 font-bold uppercase tracking-widest mt-1">Productividad de Beneficio 24h</p>
            </div>
            <div class="flex bg-black/40 p-2 rounded-xl border border-white/5">
              <button class="px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest bg-[#3d5a1a] text-white border border-[#a4c639]/30 shadow-[0_0_15px_rgba(164,198,57,0.1)]">Hoy</button>
              <button class="px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-600 hover:text-white transition-all">Semana</button>
            </div>
          </div>
          
          <!-- Industrial Bar Chart -->
          <div class="h-64 w-full flex items-end space-x-3 px-2">
             <div *ngFor="let i of [45,60,55,80,75,90,100,85,70,95,80,60]" 
                  class="flex-1 bg-gradient-to-t from-[#3d5a1a]/20 to-[#a4c639]/40 rounded-t-xl hover:to-[#a4c639] transition-all relative group cursor-pointer border-t border-[#a4c639]/20">
                <div class="absolute -top-8 left-1/2 -translate-x-1/2 text-[9px] font-black text-[#a4c639] opacity-0 group-hover:opacity-100 transition-opacity">
                  {{i}}%
                </div>
             </div>
          </div>
          <div class="flex justify-between mt-6 text-[9px] font-bold text-slate-700 uppercase tracking-[0.3em] px-2">
            <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:59</span>
          </div>
        </div>

        <!-- Quick Access Industrial -->
        <div class="glass-card p-10 flex flex-col">
          <h3 class="text-2xl font-black text-white uppercase tracking-tight mb-8">Accesos Rápidos</h3>
          <div class="space-y-4 flex-1">
             <button class="w-full bg-black/30 border border-white/5 p-6 rounded-2xl flex items-center hover:bg-[#3d5a1a]/20 hover:border-[#a4c639]/30 transition-all group">
                <div class="w-12 h-12 bg-[#3d5a1a]/20 rounded-xl flex items-center justify-center text-[#a4c639] group-hover:bg-[#a4c639] group-hover:text-black transition-all">
                  <i class="pi pi-box text-xl"></i>
                </div>
                <div class="ml-5 text-left">
                  <p class="text-sm font-black text-white uppercase tracking-tight">Nueva Faena</p>
                  <p class="text-[9px] text-slate-600 font-bold uppercase tracking-widest mt-0.5">Ingresar canal a línea</p>
                </div>
             </button>

             <button class="w-full bg-black/30 border border-white/5 p-6 rounded-2xl flex items-center hover:bg-[#3d5a1a]/20 hover:border-[#a4c639]/30 transition-all group">
                <div class="w-12 h-12 bg-slate-800/20 rounded-xl flex items-center justify-center text-slate-500 group-hover:bg-slate-700 group-hover:text-white transition-all">
                  <i class="pi pi-print text-xl"></i>
                </div>
                <div class="ml-5 text-left">
                  <p class="text-sm font-black text-white uppercase tracking-tight">Imprimir Guías</p>
                  <p class="text-[9px] text-slate-600 font-bold uppercase tracking-widest mt-0.5">Documentación legal</p>
                </div>
             </button>

             <button class="w-full bg-black/30 border border-white/5 p-6 rounded-2xl flex items-center hover:bg-[#3d5a1a]/20 hover:border-[#a4c639]/30 transition-all group">
                <div class="w-12 h-12 bg-[#3d5a1a]/10 rounded-xl flex items-center justify-center text-[#a4c639] group-hover:bg-[#a4c639] group-hover:text-black transition-all">
                  <i class="pi pi-chart-bar text-xl"></i>
                </div>
                <div class="ml-5 text-left">
                  <p class="text-sm font-black text-white uppercase tracking-tight">Reporte Diario</p>
                  <p class="text-[9px] text-slate-600 font-bold uppercase tracking-widest mt-0.5">Cierre de operaciones</p>
                </div>
             </button>
          </div>
          
          <div class="mt-10 p-6 rounded-2xl bg-[#3d5a1a]/10 border border-[#a4c639]/20">
             <div class="flex items-center justify-between mb-4">
                <span class="text-[10px] font-black text-white uppercase tracking-widest">Sincronización</span>
                <span class="text-[10px] font-black text-[#a4c639]">100% OK</span>
             </div>
             <div class="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-[#3d5a1a] to-[#a4c639]" style="width: 100%"></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep .p-card { background: transparent; border: none; }
  `]
})
export class DashboardComponent {
  stats: any = null;

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
