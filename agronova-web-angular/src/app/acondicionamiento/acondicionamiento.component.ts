import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcondicionamientoService, Acondicionamiento } from '../services/acondicionamiento.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-acondicionamiento',
  standalone: true,
  imports: [
    CommonModule, TableModule, ButtonModule, TagModule, CardModule, ToastModule,
    FormsModule, ReactiveFormsModule, DialogModule, ConfirmDialogModule,
    InputNumberModule, InputTextModule, DropdownModule, CheckboxModule, TooltipModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './acondicionamiento.component.html',
  styleUrl: './acondicionamiento.component.css',
})
export class AcondicionamientoComponent implements OnInit {
  acondicionamientos: Acondicionamiento[] = [];
  loading = true;

  // Crear
  displayNewDialog = false;
  acondicionamientoForm: FormGroup;

  // Editar
  editingId: string | null = null;
  displayEditDialog = false;
  editForm: FormGroup;

  estadosAcond = [
    { label: 'En Proceso', value: 0 },
    { label: 'Completado', value: 1 },
    { label: 'Pendiente Auditoría', value: 2 },
    { label: 'Aprobado', value: 3 },
    { label: 'Rechazado', value: 4 },
  ];

  constructor(
    private acondicionamientoService: AcondicionamientoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
  ) {
    this.acondicionamientoForm = this.fb.group({
      NumeroAcondicionamiento: ['', Validators.required],
      DesposteId:              [''],
      TemperaturaProductos:    [2, [Validators.min(-20), Validators.max(10)]],
      PesoTotalAcondicionado:  [null],
      EtiquetadoCompleto:      [false],
    });
    this.editForm = this.fb.group({
      NumeroAcondicionamiento: ['', Validators.required],
      TemperaturaProductos:    [null],
      PesoTotalAcondicionado:  [null],
      EtiquetadoCompleto:      [false],
      Estado:                  [0],
    });
  }

  ngOnInit() { this.loadData(); }

  loadData() {
    this.loading = true;
    this.acondicionamientoService.getAll().subscribe({
      next: (data) => { this.acondicionamientos = data; this.loading = false; },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los datos de acondicionamiento' });
        this.loading = false;
      },
    });
  }

  getStatusName(estado: number): string {
    return this.estadosAcond.find(e => e.value === estado)?.label ?? 'Desconocido';
  }

  getSeverity(estado: number): 'success' | 'danger' | 'info' | 'warning' | 'secondary' {
    const map: Record<number, 'success' | 'danger' | 'info' | 'warning' | 'secondary'> = {
      3: 'success', 4: 'danger', 1: 'info', 2: 'warning',
    };
    return map[estado] ?? 'warning';
  }

  getTempColor(temp: number): string {
    if (temp <= 4) return 'text-blue-500';
    if (temp <= 7) return 'text-orange-500';
    return 'text-red-500';
  }

  // ---- CREAR ----
  showNewDialog() {
    this.acondicionamientoForm.reset({ TemperaturaProductos: 2, PesoTotalAcondicionado: null, EtiquetadoCompleto: false });
    this.displayNewDialog = true;
  }

  saveNew() {
    if (this.acondicionamientoForm.invalid) { this.acondicionamientoForm.markAllAsTouched(); return; }
    this.loading = true;
    this.acondicionamientoService.create(this.acondicionamientoForm.value).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Creado', detail: 'Registro de acondicionamiento creado' });
        this.displayNewDialog = false;
        this.loadData();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el registro' });
        this.loading = false;
      },
    });
  }

  // ---- EDITAR ----
  openEdit(item: Acondicionamiento) {
    this.editForm.patchValue({
      NumeroAcondicionamiento: item.NumeroAcondicionamiento,
      TemperaturaProductos:    item.TemperaturaProductos ?? null,
      PesoTotalAcondicionado:  item.PesoTotalAcondicionado ?? null,
      EtiquetadoCompleto:      item.EtiquetadoCompleto ?? false,
      Estado:                  item.Estado ?? 0,
    });
    this.editingId = item.Id!;
    this.displayEditDialog = true;
  }

  saveEdit() {
    if (this.editForm.invalid) { this.editForm.markAllAsTouched(); return; }
    this.acondicionamientoService.update(this.editingId!, this.editForm.value).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: 'Acondicionamiento actualizado' });
        this.displayEditDialog = false;
        this.loadData();
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar' }),
    });
  }

  // ---- ACCIONES RÁPIDAS ----
  completar(item: Acondicionamiento) {
    this.acondicionamientoService.update(item.Id!, { Estado: 1 } as any).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Completado', detail: 'Acondicionamiento completado' });
        this.loadData();
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo completar' }),
    });
  }

  aprobar(item: Acondicionamiento) {
    this.acondicionamientoService.aprobar(item.Id!).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Aprobado', detail: 'Acondicionamiento aprobado para despacho' });
        this.loadData();
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo aprobar' }),
    });
  }

  confirmDelete(item: Acondicionamiento) {
    this.confirmationService.confirm({
      message: `¿Eliminar acondicionamiento ${item.NumeroAcondicionamiento}?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.acondicionamientoService.delete(item.Id!).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Registro eliminado' });
            this.loadData();
          },
          error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar' }),
        });
      },
    });
  }
}
