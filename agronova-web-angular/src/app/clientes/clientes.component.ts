import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteService, Cliente } from '../services/cliente.service';
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
  selector: 'app-clientes',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    TableModule, ButtonModule, DialogModule, InputTextModule,
    TagModule, ToastModule, TooltipModule, ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  loading = true;
  displayDialog = false;
  editingId: string | null = null;
  form: FormGroup;

  constructor(
    private clienteService: ClienteService,
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
    this.clienteService.getAll().subscribe({
      next: (data) => { this.clientes = data; this.loading = false; },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los clientes' });
        this.loading = false;
      }
    });
  }

  openNew() {
    this.editingId = null;
    this.form.reset();
    this.displayDialog = true;
  }

  openEdit(cliente: Cliente) {
    this.editingId = cliente.Id!;
    this.form.patchValue(cliente);
    this.displayDialog = true;
  }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const data = this.form.value;
    const op = this.editingId
      ? this.clienteService.update(this.editingId, data)
      : this.clienteService.create(data);

    op.subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: 'Cliente guardado correctamente' });
        this.displayDialog = false;
        this.loadData();
      },
      error: (err) => {
        const msg = err?.error?.errors ? Object.values(err.error.errors).flat().join(' ') : 'Error al guardar';
        this.messageService.add({ severity: 'error', summary: 'Error', detail: msg as string });
      }
    });
  }

  confirmDelete(cliente: Cliente) {
    this.confirmationService.confirm({
      message: `¿Eliminar a ${cliente.Nombre}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.clienteService.delete(cliente.Id!).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Cliente eliminado' });
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
