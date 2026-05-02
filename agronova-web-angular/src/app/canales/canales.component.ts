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
  selector: 'app-canales',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    TableModule, ButtonModule, TagModule, ToastModule,
    DialogModule, ConfirmDialogModule, InputTextModule,
    InputNumberModule, DropdownModule, CheckboxModule, TooltipModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './canales.component.html',
  styleUrl: './canales.component.css',
})
export class CanalesComponent implements OnInit {
  items: any[] = [];
  loading = false;
  totalRecords = 0;

  // Dialogs
  displayDialog = false;
  displayPEC = false;
  displayPEF = false;
  displayDetalle = false;

  editingId: string | null = null;
  selected: any = null;

  form!: FormGroup;
  pecForm!: FormGroup;
  pefForm!: FormGroup;

  tiposAnimal = ['BOVINO', 'PORCINO', 'OVINO', 'OTROS'];
  estados = ['Sacrificado', 'En Refrigeración', 'Listo para Desposte', 'En Desposte', 'Despachado'];

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private msg: MessageService,
    private confirm: ConfirmationService,
  ) {}

  ngOnInit() {
    this.buildForms();
    this.load();
  }

  buildForms() {
    this.form = this.fb.group({
      NumeroCanal:        ['', Validators.required],
      NumeroOreja:        [''],
      TipoAnimal:         ['BOVINO', Validators.required],
      PesoVivo:           [null],
      PesoCanalCaliente:  [null],
      PesoCanalFria:      [null],
      FechaFaena:         [''],
      FechaRefrigeracion: [''],
      AptilizadoFaena:    [false],
      ObservacionesFaena: [''],
      Estado:             ['Sacrificado'],
    });
    this.pecForm = this.fb.group({
      PesoCanalCaliente: [null, [Validators.required, Validators.min(0)]],
      FechaFaena:        [''],
    });
    this.pefForm = this.fb.group({
      PesoCanalFria:      [null, [Validators.required, Validators.min(0)]],
      FechaRefrigeracion: [''],
      AptilizadoFaena:    [false],
    });
  }

  load() {
    this.loading = true;
    this.http.get<any>(`${environment.apiUrl}/canales`).subscribe({
      next: (res) => {
        this.items = res.data ?? res;
        this.totalRecords = res.total ?? this.items.length;
        this.loading = false;
      },
      error: () => {
        this.msg.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los canales' });
        this.loading = false;
      },
    });
  }

  openNew() {
    this.form.reset({ TipoAnimal: 'BOVINO', AptilizadoFaena: false, Estado: 'Sacrificado' });
    this.editingId = null;
    this.displayDialog = true;
  }

  openEdit(item: any) {
    this.form.patchValue({
      ...item,
      FechaFaena:         item.FechaFaena ? item.FechaFaena.substring(0, 10) : '',
      FechaRefrigeracion: item.FechaRefrigeracion ? item.FechaRefrigeracion.substring(0, 10) : '',
    });
    this.editingId = item.Id;
    this.displayDialog = true;
  }

  openPEC(item: any) {
    this.selected = item;
    this.pecForm.reset({
      PesoCanalCaliente: item.PesoCanalCaliente,
      FechaFaena: item.FechaFaena ? item.FechaFaena.substring(0, 10) : '',
    });
    this.displayPEC = true;
  }

  openPEF(item: any) {
    this.selected = item;
    this.pefForm.reset({
      PesoCanalFria:      item.PesoCanalFria,
      FechaRefrigeracion: item.FechaRefrigeracion ? item.FechaRefrigeracion.substring(0, 10) : '',
      AptilizadoFaena:    item.AptilizadoFaena,
    });
    this.displayPEF = true;
  }

  verDetalle(item: any) {
    this.selected = item;
    this.displayDetalle = true;
  }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const req$ = this.editingId
      ? this.http.put(`${environment.apiUrl}/canales/${this.editingId}`, this.form.value)
      : this.http.post(`${environment.apiUrl}/canales`, this.form.value);
    req$.subscribe({
      next: () => {
        this.msg.add({ severity: 'success', summary: 'Guardado', detail: 'Canal guardado correctamente' });
        this.displayDialog = false;
        this.load();
      },
      error: (e) => this.msg.add({ severity: 'error', summary: 'Error', detail: e?.error?.message || 'No se pudo guardar' }),
    });
  }

  savePEC() {
    if (this.pecForm.invalid) { this.pecForm.markAllAsTouched(); return; }
    const payload = { ...this.pecForm.value, Estado: 'En Refrigeración' };
    this.http.put(`${environment.apiUrl}/canales/${this.selected.Id}`, payload).subscribe({
      next: () => {
        this.msg.add({ severity: 'success', summary: 'PEC Actualizado', detail: `Canal ${this.selected.NumeroCanal} — Peso en Caliente guardado` });
        this.displayPEC = false;
        this.load();
      },
      error: (e) => this.msg.add({ severity: 'error', summary: 'Error', detail: e?.error?.message || 'No se pudo actualizar' }),
    });
  }

  savePEF() {
    if (this.pefForm.invalid) { this.pefForm.markAllAsTouched(); return; }
    const aptilizado = this.pefForm.value.AptilizadoFaena;
    const payload = { ...this.pefForm.value, Estado: aptilizado ? 'Listo para Desposte' : 'En Refrigeración' };
    this.http.put(`${environment.apiUrl}/canales/${this.selected.Id}`, payload).subscribe({
      next: () => {
        this.msg.add({ severity: 'success', summary: 'PEF Actualizado', detail: `Canal ${this.selected.NumeroCanal} — Peso en Frío guardado` });
        this.displayPEF = false;
        this.load();
      },
      error: (e) => this.msg.add({ severity: 'error', summary: 'Error', detail: e?.error?.message || 'No se pudo actualizar' }),
    });
  }

  confirmDelete(item: any) {
    this.confirm.confirm({
      message: `¿Eliminar canal ${item.NumeroCanal}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.http.delete(`${environment.apiUrl}/canales/${item.Id}`).subscribe({
          next: () => { this.msg.add({ severity: 'success', summary: 'Eliminado', detail: 'Canal eliminado' }); this.load(); },
          error: () => this.msg.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar' }),
        });
      },
    });
  }

  getSeverity(estado: string): string {
    const map: Record<string, string> = {
      'Sacrificado': 'warning',
      'En Refrigeración': 'info',
      'Listo para Desposte': 'success',
      'En Desposte': 'warning',
      'Despachado': 'success',
    };
    return map[estado] ?? 'secondary';
  }

  fi(form: FormGroup, field: string): boolean {
    const c = form.get(field);
    return !!(c?.invalid && c?.touched);
  }

  merma(item: any): string {
    if (!item.PesoVivo || !item.PesoCanalCaliente) return '—';
    const pct = ((item.PesoVivo - item.PesoCanalCaliente) / item.PesoVivo * 100).toFixed(1);
    return `${pct}%`;
  }

  rendimiento(item: any): string {
    if (!item.PesoVivo || !item.PesoCanalFria) return '—';
    const pct = (item.PesoCanalFria / item.PesoVivo * 100).toFixed(1);
    return `${pct}%`;
  }
}
