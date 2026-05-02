import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProveedorService, Proveedor } from '../services/proveedor.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    TableModule, ButtonModule, DialogModule, InputTextModule,
    TagModule, ToastModule, TooltipModule, ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './proveedores.component.html',
  styleUrl: './proveedores.component.css'
})
export class ProveedoresComponent implements OnInit {
  proveedores: Proveedor[] = [];
  loading = true;
  displayDialog = false;
  editingId: string | null = null;
  form: FormGroup;

  constructor(
    private proveedorService: ProveedorService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      Nombre:       ['', Validators.required],
      RazonSocial:  [''],
      NIT:          [''],
      Telefono:     [''],
      Email:        ['', Validators.email],
      Direccion:    [''],
      Ciudad:       [''],
      Contacto:     [''],
      Observaciones:[''],
    });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.proveedorService.getAll().subscribe({
      next: (data) => { this.proveedores = data; this.loading = false; },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los proveedores' });
        this.loading = false;
      }
    });
  }

  openNew() {
    this.editingId = null;
    this.form.reset();
    this.displayDialog = true;
  }

  openEdit(proveedor: Proveedor) {
    this.editingId = proveedor.Id!;
    this.form.patchValue(proveedor);
    this.displayDialog = true;
  }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const data = this.form.value;
    const op = this.editingId
      ? this.proveedorService.update(this.editingId, data)
      : this.proveedorService.create(data);

    op.subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: 'Proveedor guardado correctamente' });
        this.displayDialog = false;
        this.loadData();
      },
      error: (err) => {
        const msg = err?.error?.errors ? Object.values(err.error.errors).flat().join(' ') : 'Error al guardar';
        this.messageService.add({ severity: 'error', summary: 'Error', detail: msg as string });
      }
    });
  }

  confirmDelete(proveedor: Proveedor) {
    this.confirmationService.confirm({
      message: `¿Eliminar a ${proveedor.Nombre}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.proveedorService.delete(proveedor.Id!).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Proveedor eliminado' });
            this.loadData();
          },
          error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar' })
        });
      }
    });
  }

  fieldInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl && ctrl.invalid && ctrl.touched);
  }
}
