import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesposteService, Desposte } from '../services/desposte.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-desposte',
  standalone: true,
  imports: [
    CommonModule, TableModule, ButtonModule, TagModule, ProgressBarModule, 
    CardModule, ToastModule, FormsModule
  ],
  providers: [MessageService],
  templateUrl: './desposte.component.html',
  styleUrl: './desposte.component.css'
})
export class DesposteComponent implements OnInit {
  despostes: Desposte[] = [];
  loading = true;
  reportStats: any = null;

  constructor(
    private desposteService: DesposteService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadData();
    this.loadStats();
  }

  loadData() {
    this.loading = true;
    this.desposteService.getAll().subscribe({
      next: (data) => {
        this.despostes = data;
        this.loading = false;
      },
      error: () => {
        this.messageService.add({severity:'error', summary: 'Error', detail: 'No se pudieron cargar los datos de desposte'});
        this.loading = false;
      }
    });
  }

  loadStats() {
    const today = new Date().toISOString().split('T')[0];
    this.desposteService.getReport(today, today).subscribe({
      next: (stats) => this.reportStats = stats,
      error: () => console.error('Error cargando estadísticas')
    });
  }

  getStatusName(estado: number): string {
    const states = ['Pendiente', 'En Proceso', 'Completado', 'Auditado'];
    return states[estado] || 'Desconocido';
  }

  getSeverity(estado: number) {
    switch(estado) {
      case 2: return 'success';
      case 1: return 'warning';
      case 0: return 'info';
      default: return 'secondary';
    }
  }

  startDesposte(desposte: Desposte) {
    this.desposteService.update(desposte.Id!, { Estado: 1 }).subscribe(() => {
      this.messageService.add({severity:'success', summary: 'Éxito', detail: 'Proceso de desposte iniciado'});
      this.loadData();
    });
  }

  completeDesposte(desposte: Desposte) {
    this.desposteService.update(desposte.Id!, { Estado: 2 }).subscribe(() => {
      this.messageService.add({severity:'success', summary: 'Éxito', detail: 'Proceso de desposte completado'});
      this.loadData();
    });
  }
}
