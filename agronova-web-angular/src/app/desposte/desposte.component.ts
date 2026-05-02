import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-desposte',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    TableModule, ButtonModule, TagModule, ToastModule,
    DialogModule, ConfirmDialogModule, InputTextModule,
    InputNumberModule, DropdownModule, CheckboxModule, TooltipModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './desposte.component.html',
  styleUrl: './desposte.component.css',
})
export class DesposteComponent implements OnInit {
  items: any[] = [];
  loading = false;

  // Desposte dialog
  displayDialog = false;
  editingId: string | null = null;
  form!: FormGroup;

  // Productos dialog
  displayProductos = false;
  selectedDesposte: any = null;
  productos: any[] = [];
  productosLoading = false;

  // Producto create/edit dialog
  displayProductoDialog = false;
  editingProductoId: string | null = null;
  productoForm!: FormGroup;

  tiposProducto: any[] = [];

  estadosDesposte = ['Pendiente', 'En Proceso', 'Completado', 'Auditado'];
  estadosProducto = ['Disponible', 'Reservado', 'Despachado', 'Devuelto'];

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private msg: MessageService,
    private confirm: ConfirmationService,
  ) {}

  ngOnInit() {
    this.buildForms();
    this.load();
    this.loadTiposProducto();
  }

  buildForms() {
    this.form = this.fb.group({
      NumeroDesposte:    ['', Validators.required],
      CanalId:           [''],
      PesoCanalOriginal: [null, [Validators.required, Validators.min(0)]],
      ObservacionesCalidad: [''],
    });
    this.productoForm = this.fb.group({
      TipoProductoId:            [''],
      NumeroProducto:            [''],
      CodigoLote:                [''],
      PesoKg:                    [null, [Validators.required, Validators.min(0)]],
      Lote:                      [''],
      Destino:                   [''],
      Estado:                    ['Disponible'],
      FechaGeneracion:           [''],
      TemperaturaAlmacenamiento: [null],
      FechaLimiteProcesamiento:  [''],
      Observaciones:             [''],
    });
  }

  load() {
    this.loading = true;
    this.http.get<any[]>(`${environment.apiUrl}/desposte`).subscribe({
      next: d => { this.items = d; this.loading = false; },
      error: () => { this.msg.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los despostes' }); this.loading = false; },
    });
  }

  loadTiposProducto() {
    this.http.get<any[]>(`${environment.apiUrl}/tipos-producto`).subscribe({
      next: d => this.tiposProducto = d.map(t => ({ label: t.Nombre, value: t.Id })),
      error: () => {},
    });
  }

  // ---- DESPOSTE CRUD ----
  openNew() {
    this.form.reset();
    this.editingId = null;
    this.displayDialog = true;
  }

  openEdit(item: any) {
    this.form.patchValue({
      NumeroDesposte:    item.NumeroDesposte,
      CanalId:           item.CanalId,
      PesoCanalOriginal: item.PesoCanalOriginal,
      ObservacionesCalidad: item.ObservacionesCalidad,
    });
    this.editingId = item.Id;
    this.displayDialog = true;
  }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const req$ = this.editingId
      ? this.http.put(`${environment.apiUrl}/desposte/${this.editingId}`, this.form.value)
      : this.http.post(`${environment.apiUrl}/desposte`, this.form.value);
    req$.subscribe({
      next: () => {
        this.msg.add({ severity: 'success', summary: 'Guardado', detail: 'Desposte guardado' });
        this.displayDialog = false;
        this.load();
      },
      error: (e) => this.msg.add({ severity: 'error', summary: 'Error', detail: e?.error?.message || 'No se pudo guardar' }),
    });
  }

  cambiarEstado(item: any, nuevoEstado: number) {
    this.http.put(`${environment.apiUrl}/desposte/${item.Id}`, { Estado: nuevoEstado }).subscribe({
      next: () => { this.msg.add({ severity: 'success', summary: 'Actualizado', detail: `Estado: ${this.estadoLabel(nuevoEstado)}` }); this.load(); },
      error: () => this.msg.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar' }),
    });
  }

  confirmDelete(item: any) {
    this.confirm.confirm({
      message: `¿Eliminar desposte ${item.NumeroDesposte}?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.http.delete(`${environment.apiUrl}/desposte/${item.Id}`).subscribe({
          next: () => { this.msg.add({ severity: 'success', summary: 'Eliminado', detail: 'Desposte eliminado' }); this.load(); },
          error: () => this.msg.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar' }),
        });
      },
    });
  }

  // ---- PRODUCTOS ----
  abrirProductos(item: any) {
    this.selectedDesposte = item;
    this.displayProductos = true;
    this.loadProductos(item.Id);
  }

  loadProductos(desposteId: string) {
    this.productosLoading = true;
    this.http.get<any[]>(`${environment.apiUrl}/desposte/${desposteId}/productos`).subscribe({
      next: d => { this.productos = d; this.productosLoading = false; },
      error: () => { this.productosLoading = false; },
    });
  }

  openNuevoProducto() {
    this.productoForm.reset({ Estado: 'Disponible' });
    this.editingProductoId = null;
    this.displayProductoDialog = true;
  }

  openEditProducto(p: any) {
    this.productoForm.patchValue({
      ...p,
      FechaGeneracion:          p.FechaGeneracion ? p.FechaGeneracion.substring(0, 10) : '',
      FechaLimiteProcesamiento: p.FechaLimiteProcesamiento ? p.FechaLimiteProcesamiento.substring(0, 10) : '',
    });
    this.editingProductoId = p.Id;
    this.displayProductoDialog = true;
  }

  saveProducto() {
    if (this.productoForm.invalid) { this.productoForm.markAllAsTouched(); return; }
    const payload = { ...this.productoForm.value, DesposteId: this.selectedDesposte.Id };
    const req$ = this.editingProductoId
      ? this.http.put(`${environment.apiUrl}/productos-desposte/${this.editingProductoId}`, payload)
      : this.http.post(`${environment.apiUrl}/productos-desposte`, payload);
    req$.subscribe({
      next: () => {
        this.msg.add({ severity: 'success', summary: 'Guardado', detail: 'Producto guardado' });
        this.displayProductoDialog = false;
        this.loadProductos(this.selectedDesposte.Id);
      },
      error: (e) => this.msg.add({ severity: 'error', summary: 'Error', detail: e?.error?.message || 'No se pudo guardar' }),
    });
  }

  confirmDeleteProducto(p: any) {
    this.confirm.confirm({
      message: '¿Eliminar este producto?',
      header: 'Confirmar',
      accept: () => {
        this.http.delete(`${environment.apiUrl}/productos-desposte/${p.Id}`).subscribe({
          next: () => { this.msg.add({ severity: 'success', summary: 'Eliminado', detail: 'Producto eliminado' }); this.loadProductos(this.selectedDesposte.Id); },
          error: () => this.msg.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar' }),
        });
      },
    });
  }

  pesoTotalProductos(): number {
    return this.productos.reduce((s, p) => s + (parseFloat(p.PesoKg) || 0), 0);
  }

  rendimiento(): string {
    if (!this.selectedDesposte?.PesoCanalOriginal || this.pesoTotalProductos() === 0) return '—';
    return (this.pesoTotalProductos() / this.selectedDesposte.PesoCanalOriginal * 100).toFixed(1) + '%';
  }

  // ---- Helpers ----
  estadoLabel(e: number): string {
    return ['Pendiente', 'En Proceso', 'Completado', 'Auditado'][e] ?? 'Desconocido';
  }

  getSeverity(e: number): 'success' | 'warning' | 'info' | 'secondary' {
    return e === 2 ? 'success' : e === 1 ? 'warning' : 'info';
  }

  getSeverityProducto(estado: string): 'success' | 'warning' | 'info' | 'danger' | 'secondary' {
    const map: Record<string, 'success' | 'warning' | 'info' | 'danger' | 'secondary'> = {
      'Disponible': 'success', 'Reservado': 'warning', 'Despachado': 'info', 'Devuelto': 'danger',
    };
    return map[estado] ?? 'secondary';
  }

  fi(form: FormGroup, field: string): boolean {
    const c = form.get(field);
    return !!(c?.invalid && c?.touched);
  }

  getTipoNombre(id: string): string {
    return this.tiposProducto.find(t => t.value === id)?.label ?? '—';
  }
}
