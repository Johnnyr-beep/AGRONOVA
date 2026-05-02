import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CavaService, Cava } from '../services/cava.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-cavas',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    TableModule, ButtonModule, DialogModule, InputTextModule,
    InputNumberModule, TagModule, ToastModule, TooltipModule,
    DropdownModule, ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './cavas.component.html',
  styleUrl: './cavas.component.css'
})
export class CavasComponent implements OnInit {
  items: Cava[] = [];
  loading = true;
  displayDialog = false;
  editingId: string | null = null;
  form: FormGroup;

  estadoOptions = [
    { label: 'Disponible', value: 'Disponible' },
    { label: 'Llena', value: 'Llena' },
    { label: 'Mantenimiento', value: 'Mantenimiento' }
  ];

  constructor(
    private service: CavaService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      Nombre: ['', Validators.required],
      Numero: [null],
      CapacidadCanales: [null],
      TemperaturaObjetivo: [null],
      Estado: ['Disponible'],
      Descripcion: ['']
    });
  }

  ngOnInit() { this.loadData(); }

  loadData() {
    this.loading = true;
    this.service.getAll().subscribe({
      next: (data) => { this.items = data; this.loading = false; },
      error: () => { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los datos' }); this.loading = false; }
    });
  }

  openNew() { this.editingId = null; this.form.reset({ Estado: 'Disponible' }); this.displayDialog = true; }

  openEdit(item: Cava) { this.editingId = item.Id!; this.form.patchValue(item); this.displayDialog = true; }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const op = this.editingId
      ? this.service.update(this.editingId, this.form.value)
      : this.service.create(this.form.value);
    op.subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: 'Cava guardada correctamente' });
        this.displayDialog = false;
        this.loadData();
      },
      error: (err) => {
        const msg = err?.error?.errors ? Object.values(err.error.errors).flat().join(' ') : 'Error al guardar';
        this.messageService.add({ severity: 'error', summary: 'Error', detail: msg as string });
      }
    });
  }

  confirmDelete(item: Cava) {
    this.confirmationService.confirm({
      message: '¿Eliminar esta cava?',
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.service.delete(item.Id!).subscribe({
          next: () => { this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Cava eliminada' }); this.loadData(); },
          error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar' })
        });
      }
    });
  }

  getEstadoSeverity(estado?: string): 'success' | 'warning' | 'danger' | 'info' | 'secondary' {
    if (estado === 'Disponible') return 'success';
    if (estado === 'Llena') return 'warning';
    if (estado === 'Mantenimiento') return 'danger';
    return 'info';
  }

  fieldInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c && c.invalid && c.touched);
  }
}
