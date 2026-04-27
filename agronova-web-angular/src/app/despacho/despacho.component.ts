import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DespachoService, Despacho } from '../services/despacho.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-despacho',
  standalone: true,
  imports: [
    CommonModule, TableModule, ButtonModule, TagModule, ToastModule, 
    DialogModule, FormsModule
  ],
  providers: [MessageService],
  templateUrl: './despacho.component.html',
  styleUrl: './despacho.component.css'
})
export class DespachoComponent implements OnInit {
  despachos: Despacho[] = [];
  loading = true;
  displayNewDialog = false;
  newDespacho: Partial<Despacho> = {
    NumeroDespacho: '',
    ClienteId: '',
    PatentaVehiculo: '',
    TransportistaNombre: '',
    TemperaturaVehiculo: 0
  };

  constructor(
    private despachoService: DespachoService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.despachoService.getAll().subscribe({
      next: (data) => {
        this.despachos = data;
        this.loading = false;
      },
      error: () => {
        this.messageService.add({severity:'error', summary: 'Error', detail: 'No se pudieron cargar los datos de despacho'});
        this.loading = false;
      }
    });
  }

  getStatusName(estado: number): string {
    const states = ['Pendiente', 'En Carga', 'Despachado', 'En Tránsito', 'Entregado', 'Rechazado'];
    return states[estado] || 'Desconocido';
  }

  getSeverity(estado: number) {
    switch(estado) {
      case 4: return 'success';
      case 2:
      case 3: return 'info';
      case 5: return 'danger';
      default: return 'warning';
    }
  }

  confirmarEntrega(despacho: Despacho) {
    this.despachoService.confirmar(despacho.Id!).subscribe(() => {
      this.messageService.add({severity:'success', summary: 'Éxito', detail: 'Entrega confirmada correctamente'});
      this.loadData();
    });
  }
}
