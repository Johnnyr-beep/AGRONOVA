import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcondicionamientoService, Acondicionamiento } from '../services/acondicionamiento.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-acondicionamiento',
  standalone: true,
  imports: [
    CommonModule, TableModule, ButtonModule, TagModule, CardModule, ToastModule, 
    FormsModule, ReactiveFormsModule, DialogModule, InputNumberModule, InputTextModule, CheckboxModule
  ],
  providers: [MessageService],
  templateUrl: './acondicionamiento.component.html',
  styleUrl: './acondicionamiento.component.css'
})
export class AcondicionamientoComponent implements OnInit {
  acondicionamientos: Acondicionamiento[] = [];
  loading = true;
  displayNewDialog = false;
  acondicionamientoForm: FormGroup;

  constructor(
    private acondicionamientoService: AcondicionamientoService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {
    this.acondicionamientoForm = this.fb.group({
      NumeroAcondicionamiento: ['', Validators.required],
      DesposteId: ['', Validators.required],
      TemperaturaProductos: [0, [Validators.required, Validators.min(-20), Validators.max(10)]],
      PesoTotalAcondicionado: [0, [Validators.required, Validators.min(1)]],
      EtiquetadoCompleto: [false]
    });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.acondicionamientoService.getAll().subscribe({
      next: (data) => {
        this.acondicionamientos = data;
        this.loading = false;
      },
      error: () => {
        this.messageService.add({severity:'error', summary: 'Error', detail: 'No se pudieron cargar los datos de acondicionamiento'});
        this.loading = false;
      }
    });
  }

  getStatusName(estado: number): string {
    const states = ['En Proceso', 'Completado', 'Pendiente Auditoría', 'Aprobado', 'Rechazado'];
    return states[estado] || 'Desconocido';
  }

  getSeverity(estado: number) {
    switch(estado) {
      case 3: return 'success';
      case 4: return 'danger';
      case 1: return 'info';
      default: return 'warning';
    }
  }

  getTempColor(temp: number): string {
    if (temp <= 4) return 'text-blue-500';
    if (temp <= 7) return 'text-orange-500';
    return 'text-red-500';
  }

  aprobar(item: Acondicionamiento) {
    this.acondicionamientoService.aprobar(item.Id!).subscribe(() => {
      this.messageService.add({severity:'success', summary: 'Éxito', detail: 'Acondicionamiento aprobado correctamente'});
      this.loadData();
    });
  }

  showNewDialog() {
    this.acondicionamientoForm.reset({ TemperaturaProductos: 2, PesoTotalAcondicionado: 0, EtiquetadoCompleto: false });
    this.displayNewDialog = true;
  }

  saveNew() {
    if (this.acondicionamientoForm.valid) {
      this.loading = true;
      this.acondicionamientoService.create(this.acondicionamientoForm.value).subscribe({
        next: () => {
          this.messageService.add({severity:'success', summary: 'Éxito', detail: 'Registro de acondicionamiento creado'});
          this.displayNewDialog = false;
          this.loadData();
        },
        error: () => {
          this.messageService.add({severity:'error', summary: 'Error', detail: 'No se pudo crear el registro'});
          this.loading = false;
        }
      });
    }
  }
}
