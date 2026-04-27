import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { BasculaService, Bascula } from '../services/bascula.service';
import { SupabaseService } from '../services/supabase.service';
import { WebSerialService } from '../services/web-serial.service';

// PrimeNG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { TabViewModule } from 'primeng/tabview';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';

// ─── Validador Cruzado: PesoVacio debe ser menor que PesoLleno ─────────────
function pesosValidator(group: AbstractControl): ValidationErrors | null {
  const lleno = group.get('PesoLleno')?.value ?? 0;
  const vacio = group.get('PesoVacio')?.value ?? 0;
  if (lleno > 0 && vacio > 0 && vacio >= lleno) {
    return { pesoVacioMayor: true };
  }
  return null;
}

// ─── Validador de Formato de Placa (Colombia: ABC123 o ABC-123) ─────────────
function placaValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const val = (control.value as string).replace(/[-\s]/g, '').toUpperCase();
  const valid = /^[A-Z]{3}[0-9]{3}$/.test(val) || /^[A-Z]{3}[0-9]{2}[A-Z]$/.test(val);
  return valid ? null : { placaInvalida: true };
}

@Component({
  selector: 'app-bascula',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, TableModule, ButtonModule,
    InputTextModule, DialogModule, TagModule, InputNumberModule, ToastModule,
    TabViewModule, AutoCompleteModule, TooltipModule
  ],
  providers: [MessageService],
  templateUrl: './bascula.component.html',
  styleUrl: './bascula.component.css'
})
export class BasculaComponent implements OnInit {
  basculas: Bascula[] = [];
  displayDialog = false;
  basculaForm: FormGroup;
  loading = true;

  // Umbrales de alerta biológica (kg por animal)
  readonly PESO_PROMEDIO_MIN = 80;
  readonly PESO_PROMEDIO_MAX = 900;

  get openGuides(): Bascula[] {
    return this.basculas.filter(b => b.Estado !== 'Cerrado');
  }

  get pesoNeto(): number {
    const lleno = this.basculaForm.get('PesoLleno')?.value ?? 0;
    const vacio = this.basculaForm.get('PesoVacio')?.value ?? 0;
    return lleno > vacio ? lleno - vacio : 0;
  }

  get promedioKgAnimal(): number {
    const cant = this.basculaForm.get('CantidadAnimales')?.value ?? 0;
    return cant > 0 ? this.pesoNeto / cant : 0;
  }

  get alertaPromedio(): 'ok' | 'bajo' | 'alto' | 'none' {
    const prom = this.promedioKgAnimal;
    if (prom === 0) return 'none';
    if (prom < this.PESO_PROMEDIO_MIN) return 'bajo';
    if (prom > this.PESO_PROMEDIO_MAX) return 'alto';
    return 'ok';
  }

  // Sugerencias para Autocomplete
  suggestions: { [key: string]: string[] } = {
    Procedencia: [],
    ProveedorNombre: [],
    ClienteNombre: [],
    PatentaVehiculo: [],
    Conductor: []
  };

  constructor(
    private basculaService: BasculaService,
    private supabaseService: SupabaseService,
    private webSerialService: WebSerialService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.basculaForm = this.fb.group({
      Id: [null],
      NumeroTicket: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      NumeroBascula: [1, [Validators.required, Validators.min(1)]],
      GuiaMovilizacion: [''],
      Procedencia: ['', Validators.required],
      ProveedorNombre: ['', Validators.required],
      ClienteNombre: ['', Validators.required],
      PatentaVehiculo: ['', [Validators.required, placaValidator]],
      Conductor: ['', Validators.required],
      Transportista: [''],
      Referencia: [''],
      PesoLleno: [0, [Validators.required, Validators.min(1)]],
      PesoVacio: [0, [Validators.required, Validators.min(1)]],
      CantidadAnimales: [0, [Validators.required, Validators.min(1)]],
      Observaciones: ['']
    }, { validators: pesosValidator });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.basculaService.getAll().subscribe({
      next: (data) => {
        this.basculas = data;
        this.loading = false;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los datos' });
        this.loading = false;
      }
    });
  }

  searchSuggestions(event: any, field: string) {
    this.basculaService.getSuggestions(field, event.query).subscribe(data => {
      this.suggestions[field] = data;
    });
  }

  showDialog() {
    this.basculaForm.reset({ NumeroBascula: 1, PesoLleno: 0, PesoVacio: 0, CantidadAnimales: 0 });
    this.displayDialog = true;
  }

  // ─── BOTÓN 1: GUARDAR (mínimos operativos) ────────────────────────────────
  save() {
    const ticket = this.basculaForm.get('NumeroTicket')?.value?.trim();
    const placa = this.basculaForm.get('PatentaVehiculo')?.value?.trim();
    const pesoLleno = this.basculaForm.get('PesoLleno')?.value ?? 0;

    const errores: string[] = [];
    if (!ticket) errores.push('Nº Ticket');
    if (!placa) errores.push('Placa Vehículo');
    if (this.basculaForm.get('PatentaVehiculo')?.hasError('placaInvalida'))
      errores.push('Formato de placa inválido (ej: ABC123)');
    if (pesoLleno <= 0) errores.push('Peso de Entrada > 0');

    if (errores.length > 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos requeridos para guardar',
        detail: errores.join(' · '),
        life: 5000
      });
      this.markMinimalFieldsAsTouched();
      return;
    }

    this.executeSave('Registro guardado correctamente');
  }

  // ─── BOTÓN 2: BORRAR ──────────────────────────────────────────────────────
  clear() {
    this.basculaForm.reset({ NumeroBascula: 1, PesoLleno: 0, PesoVacio: 0, CantidadAnimales: 0 });
    this.basculaForm.markAsPristine();
    this.basculaForm.markAsUntouched();
    this.messageService.add({ severity: 'info', summary: 'Limpio', detail: 'Formulario reiniciado' });
  }

  // ─── BOTÓN 3: REGISTRAR (todos los campos + validaciones cruzadas) ─────────
  register() {
    this.basculaForm.markAllAsTouched();

    const errores = this.getValidationErrors();
    if (errores.length > 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Registro incompleto',
        detail: errores[0], // mostrar el primer error
        life: 6000
      });
      // Si hay múltiples errores, mostrar resumen adicional
      if (errores.length > 1) {
        setTimeout(() => {
          this.messageService.add({
            severity: 'warn',
            summary: `${errores.length} campos con error`,
            detail: errores.slice(1).join(' · '),
            life: 8000
          });
        }, 300);
      }
      return;
    }

    // Alerta de promedio biológico (no bloquea, solo avisa)
    if (this.alertaPromedio === 'bajo') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Alerta Biológica',
        detail: `Promedio de ${this.promedioKgAnimal.toFixed(1)} kg/animal es inusualmente BAJO (mínimo esperado: ${this.PESO_PROMEDIO_MIN} kg). Verifique los datos.`,
        life: 8000
      });
    } else if (this.alertaPromedio === 'alto') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Alerta Biológica',
        detail: `Promedio de ${this.promedioKgAnimal.toFixed(1)} kg/animal es inusualmente ALTO (máximo esperado: ${this.PESO_PROMEDIO_MAX} kg). Verifique los datos.`,
        life: 8000
      });
    }

    this.executeSave('Pesaje registrado oficialmente');
  }

  // ─── BOTÓN 4: CERRAR ORDEN ────────────────────────────────────────────────
  closeOrder() {
    const id = this.basculaForm.get('Id')?.value;
    if (!id) {
      this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'Debe cargar una orden existente para cerrarla' });
      return;
    }
    // Validar que tenga peso de salida antes de cerrar
    const pesoVacio = this.basculaForm.get('PesoVacio')?.value ?? 0;
    if (pesoVacio <= 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'No se puede cerrar',
        detail: 'Debe registrar el Peso de Salida antes de cerrar la orden'
      });
      return;
    }

    this.loading = true;
    this.basculaService.update(id, { Estado: 'Cerrado' }).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Orden Cerrada', detail: 'La orden ha sido finalizada y bloqueada' });
        this.loadData();
        this.loading = false;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cerrar la orden' });
        this.loading = false;
      }
    });
  }

  // ─── BOTÓN 5: IMPRIMIR ────────────────────────────────────────────────────
  printPDF() {
    window.print();
  }

  // ─── Captura de peso via WebSerial ────────────────────────────────────────
  async captureWeight(field: string) {
    this.messageService.add({ severity: 'info', summary: 'Conexión', detail: 'Estableciendo comunicación con la báscula...' });

    const connected = await this.webSerialService.requestPort();
    if (!connected) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo acceder al puerto de la báscula' });
      return;
    }

    this.messageService.add({ severity: 'info', summary: 'Báscula', detail: 'Leyendo peso estable...' });
    const weight = await this.webSerialService.readWeight();

    if (weight !== null) {
      if (weight <= 0) {
        this.messageService.add({ severity: 'warn', summary: 'Peso inválido', detail: 'La báscula reportó un peso de 0 o negativo. Verifique el equipo.' });
        return;
      }
      this.basculaForm.get(field)?.setValue(weight);
      this.basculaForm.get(field)?.markAsTouched();
      this.messageService.add({ severity: 'success', summary: 'Peso Capturado', detail: `${weight.toLocaleString('es-CO')} kg registrados` });
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Sin Datos', detail: 'No se recibió una trama de peso válida de la báscula' });
    }
  }

  // ─── Helper: ¿un campo tiene error visible? ───────────────────────────────
  fieldInvalid(name: string): boolean {
    const ctrl = this.basculaForm.get(name);
    return !!(ctrl && ctrl.invalid && ctrl.touched);
  }

  // ─── Helper: Marcar solo los campos mínimos para save() ──────────────────
  private markMinimalFieldsAsTouched() {
    ['NumeroTicket', 'PatentaVehiculo', 'PesoLleno'].forEach(f =>
      this.basculaForm.get(f)?.markAsTouched()
    );
  }

  // ─── Recopila todos los errores del formulario en mensajes legibles ────────
  private getValidationErrors(): string[] {
    const errores: string[] = [];
    const labels: { [key: string]: string } = {
      NumeroTicket: 'Nº Ticket',
      GuiaMovilizacion: 'Guía de Movilización',
      Procedencia: 'Procedencia',
      ProveedorNombre: 'Proveedor / Planta',
      ClienteNombre: 'Cliente Destino',
      PatentaVehiculo: 'Placa Vehículo',
      Conductor: 'Conductor',
      PesoLleno: 'Peso de Entrada',
      PesoVacio: 'Peso de Salida',
      CantidadAnimales: 'Cantidad de Animales'
    };

    for (const [field, label] of Object.entries(labels)) {
      const ctrl = this.basculaForm.get(field);
      if (!ctrl) continue;

      if (ctrl.hasError('required') || (ctrl.value === '' || ctrl.value === null || ctrl.value === undefined)) {
        errores.push(`${label} es obligatorio`);
        continue;
      }
      if (ctrl.hasError('min')) {
        errores.push(`${label} debe ser mayor a 0`);
        continue;
      }
      if (ctrl.hasError('placaInvalida')) {
        errores.push(`${label}: formato inválido. Use el formato ABC123`);
        continue;
      }
    }

    // Validación cruzada de pesos
    if (this.basculaForm.hasError('pesoVacioMayor')) {
      errores.push('El Peso de Salida debe ser MENOR al Peso de Entrada');
    }

    return errores;
  }

  // ─── Mantiene isFormComplete() para compatibilidad con el template ─────────
  isFormComplete(): boolean {
    return this.getValidationErrors().length === 0;
  }

  private executeSave(successMsg: string) {
    const pesoLleno = this.basculaForm.get('PesoLleno')?.value ?? 0;
    const pesoVacio = this.basculaForm.get('PesoVacio')?.value ?? 0;

    // Re-validar cruzado antes de enviar (defensa en profundidad)
    if (pesoVacio > 0 && pesoLleno > 0 && pesoVacio >= pesoLleno) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error de Pesaje',
        detail: 'El Peso de Salida debe ser MENOR al Peso de Entrada'
      });
      return;
    }

    this.loading = true;
    const payload = {
      ...this.basculaForm.value,
      PesoNeto: this.pesoNeto
    };

    this.basculaService.create(payload).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: successMsg });
        this.loadData();
        this.loading = false;

        this.supabaseService.logOperation('BASCULA', 'REGISTRO_PESAJE', {
          ticket: this.basculaForm.get('NumeroTicket')?.value,
          placa: this.basculaForm.get('PatentaVehiculo')?.value,
          peso_neto: this.pesoNeto
        });
      },
      error: (err) => {
        let detail = 'No se pudo procesar la solicitud. Intente de nuevo.';
        if (err.status === 422) {
          // Intentar parsear el error de la API para dar feedback específico
          const errors = err.error?.errors;
          if (errors?.NumeroTicket) detail = `El Ticket #${this.basculaForm.get('NumeroTicket')?.value} ya existe en el sistema.`;
          else if (errors?.GuiaMovilizacion) detail = `La Guía de Movilización ya fue registrada.`;
          else detail = 'Registro duplicado: El Ticket o la Guía ya existen.';
        } else if (err.status === 0) {
          detail = 'No se puede conectar con el servidor. Verifique que el API esté activa.';
        } else if (err.status === 500) {
          detail = 'Error interno del servidor. Contacte al administrador.';
        }
        this.messageService.add({ severity: 'error', summary: 'Error al guardar', detail, life: 8000 });
        this.loading = false;
      }
    });
  }
}
