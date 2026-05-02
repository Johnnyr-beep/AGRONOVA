import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TipoProductoService, TipoProducto } from '../services/tipo-producto.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-tipos-producto',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    TableModule, ButtonModule, DialogModule, InputTextModule,
    InputNumberModule, CheckboxModule, TagModule, ToastModule,
    TooltipModule, ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './tipos-producto.component.html',
  styleUrl: './tipos-producto.component.css'
})
export class TiposProductoComponent implements OnInit {
  tipos: TipoProducto[] = [];
  loading = true;
  displayDialog = false;
  editingId: string | null = null;
  form: FormGroup;

  constructor(
    private tipoService: TipoProductoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      Nombre:                  ['', Validators.required],
      Codigo:                  [''],
      Clasificacion:           [''],
      Descripcion:             [''],
      PrecioBaseKg:            [null],
      PesoMinimo:              [null],
      PesoMaximo:              [null],
      TemperaturaOptima:       [null],
      DiasVidaUtil:            [null],
      RequiereControlCalidad:  [false],
    });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.tipoService.getAll().subscribe({
      next: (data) => { this.tipos = data; this.loading = false; },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los tipos de producto' });
        this.loading = false;
      }
    });
  }

  openNew() {
    this.editingId = null;
    this.form.reset({ RequiereControlCalidad: false });
    this.displayDialog = true;
  }

  openEdit(tipo: TipoProducto) {
    this.editingId = tipo.Id!;
    this.form.patchValue(tipo);
    this.displayDialog = true;
  }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const data = this.form.value;
    const op = this.editingId
      ? this.tipoService.update(this.editingId, data)
      : this.tipoService.create(data);

    op.subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: 'Tipo de producto guardado' });
        this.displayDialog = false;
        this.loadData();
      },
      error: (err) => {
        const msg = err?.error?.errors ? Object.values(err.error.errors).flat().join(' ') : 'Error al guardar';
        this.messageService.add({ severity: 'error', summary: 'Error', detail: msg as string });
      }
    });
  }

  confirmDelete(tipo: TipoProducto) {
    this.confirmationService.confirm({
      message: `¿Desactivar "${tipo.Nombre}"?`,
      header: 'Confirmar desactivación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.tipoService.delete(tipo.Id!).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Desactivado', detail: 'Tipo desactivado' });
            this.loadData();
          },
          error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo desactivar' })
        });
      }
    });
  }

  fieldInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl && ctrl.invalid && ctrl.touched);
  }
}
