import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmbalajeService, Embalaje } from '../services/embalaje.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-embalajes',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    TableModule, ButtonModule, DialogModule, InputTextModule,
    InputNumberModule, DropdownModule, TagModule, ToastModule,
    TooltipModule, ConfirmDialogModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './embalajes.component.html',
  styleUrl: './embalajes.component.css',
})
export class EmbalajesComponent implements OnInit {
  items: Embalaje[] = [];
  loading = true;
  displayDialog = false;
  editingId: string | null = null;
  form: FormGroup;

  filterMode: 'todos' | 'pendientes' | 'por-vencer' = 'todos';
  estadosEmbalaje = ['Pendiente', 'Embalado', 'Despachado'];

  constructor(
    private service: EmbalajeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      NumeroEmbalaje:     ['', Validators.required],
      FechaEmbalaje:      [''],
      PesoNeto:           [null],
      PesoBruto:          [null],
      PesoTara:           [null],
      CantidadUnidades:   [null],
      TemperaturaProducto:[null],
      Lote:               [''],
      FechaVencimiento:   [''],
      CodigoBarras:       [''],
      Estado:             ['Pendiente'],
      Observaciones:      [''],
    });
  }

  ngOnInit() { this.loadData(); }

  loadData() {
    this.loading = true;
    this.service.getAll().subscribe({
      next: (data: any) => { this.items = data.data ?? data; this.loading = false; },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los embalajes' });
        this.loading = false;
      },
    });
  }

  get filteredItems(): Embalaje[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    if (this.filterMode === 'pendientes') {
      return this.items.filter(e => !e.Estado || e.Estado === 'Pendiente');
    }
    if (this.filterMode === 'por-vencer') {
      return this.items.filter(e => {
        if (!e.FechaVencimiento || e.Estado === 'Despachado') return false;
        const fecha = new Date(e.FechaVencimiento);
        return fecha >= today && fecha <= nextWeek;
      });
    }
    return this.items;
  }

  get pendientesCount(): number { return this.items.filter(e => !e.Estado || e.Estado === 'Pendiente').length; }
  get porVencerCount(): number {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return this.items.filter(e => {
      if (!e.FechaVencimiento || e.Estado === 'Despachado') return false;
      const f = new Date(e.FechaVencimiento);
      return f >= today && f <= nextWeek;
    }).length;
  }

  openNew() {
    this.editingId = null;
    this.form.reset({ Estado: 'Pendiente' });
    this.displayDialog = true;
  }

  openEdit(item: Embalaje) {
    this.editingId = item.Id!;
    this.form.patchValue({
      ...item,
      FechaEmbalaje:    item.FechaEmbalaje    ? item.FechaEmbalaje.substring(0, 10)    : '',
      FechaVencimiento: item.FechaVencimiento ? item.FechaVencimiento.substring(0, 10) : '',
    });
    this.displayDialog = true;
  }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const op = this.editingId
      ? this.service.update(this.editingId, this.form.value)
      : this.service.create(this.form.value);
    op.subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: 'Embalaje guardado' });
        this.displayDialog = false;
        this.loadData();
      },
      error: (err: any) => {
        const msg = err?.error?.errors ? Object.values(err.error.errors).flat().join(' ') : 'Error al guardar';
        this.messageService.add({ severity: 'error', summary: 'Error', detail: msg as string });
      },
    });
  }

  cambiarEstado(item: Embalaje, estado: string) {
    this.service.update(item.Id!, { Estado: estado } as any).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: `Estado: ${estado}` });
        this.loadData();
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar' }),
    });
  }

  confirmDelete(item: Embalaje) {
    this.confirmationService.confirm({
      message: `¿Eliminar embalaje ${item.NumeroEmbalaje}?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.service.delete(item.Id!).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Embalaje eliminado' });
          this.loadData();
        },
      }),
    });
  }

  getSeverity(estado?: string): 'success' | 'warning' | 'info' | 'secondary' {
    if (estado === 'Embalado') return 'info';
    if (estado === 'Despachado') return 'success';
    return 'warning';
  }

  fieldInvalid(f: string) { const c = this.form.get(f); return !!(c && c.invalid && c.touched); }
}
