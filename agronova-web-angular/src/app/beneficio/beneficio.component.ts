import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BeneficioService, Beneficio, AnimalBeneficio } from '../services/beneficio.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-beneficio',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    TableModule, ButtonModule, TagModule, ToastModule,
    DialogModule, DropdownModule, InputTextModule, InputNumberModule,
    CalendarModule, InputTextareaModule,
  ],
  providers: [MessageService, DatePipe],
  templateUrl: './beneficio.component.html',
  styleUrl: './beneficio.component.css',
})
export class BeneficioComponent implements OnInit {
  ordenes: Beneficio[] = [];
  selectedOrden: Beneficio | null = null;
  loading = true;
  loadingAnimales = false;

  fechaFiltro: Date = new Date();

  showOrdenDialog = false;
  showAnimalDialog = false;

  ordenForm: FormGroup;
  animalForm: FormGroup;

  modoImpresionOpts = [
    { label: 'MANUAL', value: 'MANUAL' },
    { label: 'AUTO', value: 'AUTO' },
  ];

  tipoAnimalOpts = [
    { label: 'Bovino', value: 'Bovino' },
    { label: 'Porcino', value: 'Porcino' },
    { label: 'Ovino', value: 'Ovino' },
    { label: 'Caprino', value: 'Caprino' },
  ];

  constructor(
    private svc: BeneficioService,
    private fb: FormBuilder,
    private ms: MessageService,
    private datePipe: DatePipe,
  ) {
    this.ordenForm = this.fb.group({
      NumeroOrden:   ['', Validators.required],
      Fecha:         [new Date(), Validators.required],
      ClienteNit:    [''],
      ClienteNombre: ['', Validators.required],
      ModoImpresion: ['MANUAL'],
    });

    this.animalForm = this.fb.group({
      Turno:                  [null, [Validators.required, Validators.min(1)]],
      NumeroAnimal:           [null],
      TipoAnimal:             ['Bovino'],
      PesoKg:                 [0],
      ObservacionesCamionera: [''],
    });
  }

  ngOnInit() {
    this.loadOrdenes();
  }

  get fechaStr(): string {
    return this.datePipe.transform(this.fechaFiltro, 'yyyy-MM-dd') ?? '';
  }

  loadOrdenes() {
    this.loading = true;
    this.svc.getAll(this.fechaStr).subscribe({
      next: data => { this.ordenes = data; this.loading = false; },
      error: () => { this.toast('error', 'No se pudieron cargar las órdenes'); this.loading = false; },
    });
  }

  selectOrden(orden: Beneficio) {
    this.loadingAnimales = true;
    this.svc.getById(orden.Id!).subscribe({
      next: data => { this.selectedOrden = data; this.loadingAnimales = false; },
      error: () => { this.toast('error', 'Error al cargar animales'); this.loadingAnimales = false; },
    });
  }

  // --- stats del panel derecho ---
  get totalAnimales(): number { return this.selectedOrden?.animales?.filter(a => !a.Eliminado).length ?? 0; }
  get totalVivos(): number    { return this.selectedOrden?.animales?.filter(a => !a.Eliminado && a.Estado === 'Vivo').length ?? 0; }
  get totalTumbados(): number { return this.selectedOrden?.animales?.filter(a => !a.Eliminado && a.Estado === 'Tumbado').length ?? 0; }
  get animalesActivos(): AnimalBeneficio[] {
    return this.selectedOrden?.animales?.filter(a => !a.Eliminado) ?? [];
  }

  get promKg(): number {
    const vivos = this.selectedOrden?.animales?.filter(a => !a.Eliminado && (a.PesoKg ?? 0) > 0) ?? [];
    if (!vivos.length) return 0;
    return vivos.reduce((s, a) => s + (a.PesoKg ?? 0), 0) / vivos.length;
  }

  // --- Órdenes ---
  openOrdenDialog() {
    this.ordenForm.reset({ Fecha: new Date(), ModoImpresion: 'MANUAL' });
    this.showOrdenDialog = true;
  }

  saveOrden() {
    if (this.ordenForm.invalid) return;
    const val = this.ordenForm.value;
    val.Fecha = this.datePipe.transform(val.Fecha, 'yyyy-MM-dd');
    this.svc.create(val).subscribe({
      next: () => { this.toast('success', 'Orden creada'); this.showOrdenDialog = false; this.loadOrdenes(); },
      error: (e) => this.toast('error', e?.error?.message ?? 'Error al crear orden'),
    });
  }

  cerrarOrden(orden: Beneficio) {
    this.svc.aprobar(orden.Id!).subscribe({
      next: () => { this.toast('success', 'Orden cerrada'); this.loadOrdenes(); if (this.selectedOrden?.Id === orden.Id) this.selectedOrden!.Estado = 'Cerrado'; },
      error: () => this.toast('error', 'Error al cerrar orden'),
    });
  }

  toggleModo(orden: Beneficio) {
    const nuevo = orden.ModoImpresion === 'MANUAL' ? 'AUTO' : 'MANUAL';
    this.svc.update(orden.Id!, { ModoImpresion: nuevo }).subscribe({
      next: () => { orden.ModoImpresion = nuevo; if (this.selectedOrden?.Id === orden.Id) this.selectedOrden!.ModoImpresion = nuevo; },
      error: () => this.toast('error', 'Error al cambiar modo'),
    });
  }

  // --- Animales ---
  openAnimalDialog() {
    const turnoSiguiente = (this.selectedOrden?.animales?.filter(a => !a.Eliminado).length ?? 0) + 1;
    this.animalForm.reset({ Turno: turnoSiguiente, TipoAnimal: 'Bovino', PesoKg: 0 });
    this.showAnimalDialog = true;
  }

  saveAnimal() {
    if (this.animalForm.invalid || !this.selectedOrden) return;
    this.svc.addAnimal(this.selectedOrden.Id!, this.animalForm.value).subscribe({
      next: (animal) => {
        this.selectedOrden!.animales = [...(this.selectedOrden!.animales ?? []), animal];
        this.updateContadores();
        this.toast('success', `Animal turno ${animal.Turno} agregado`);
        this.showAnimalDialog = false;
      },
      error: (e) => this.toast('error', e?.error?.message ?? 'Error al agregar animal'),
    });
  }

  toggleEstadoAnimal(animal: AnimalBeneficio) {
    const nuevo = animal.Estado === 'Vivo' ? 'Tumbado' : 'Vivo';
    this.svc.updateAnimal(this.selectedOrden!.Id!, animal.Id!, { Estado: nuevo }).subscribe({
      next: () => { animal.Estado = nuevo; this.updateContadores(); },
      error: () => this.toast('error', 'Error al actualizar estado'),
    });
  }

  removeAnimal(animal: AnimalBeneficio) {
    this.svc.removeAnimal(this.selectedOrden!.Id!, animal.Id!).subscribe({
      next: () => {
        this.selectedOrden!.animales = this.selectedOrden!.animales?.filter(a => a.Id !== animal.Id);
        this.updateContadores();
        this.toast('success', 'Animal eliminado');
      },
      error: () => this.toast('error', 'Error al eliminar animal'),
    });
  }

  private updateContadores() {
    if (!this.selectedOrden) return;
    this.selectedOrden.TotalAnimales = this.totalAnimales;
    this.selectedOrden.TotalVivos    = this.totalVivos;
    this.selectedOrden.TotalTumbados = this.totalTumbados;
  }

  getOrdenSeverity(estado?: string): 'success' | 'danger' | 'info' {
    if (estado === 'Cerrado') return 'success';
    if (estado === 'Rechazado') return 'danger';
    return 'info';
  }

  private toast(severity: 'success' | 'error' | 'warn', detail: string) {
    this.ms.add({ severity, summary: severity === 'success' ? 'Éxito' : 'Error', detail });
  }
}
