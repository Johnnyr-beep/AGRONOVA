import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BeneficioService, Beneficio } from '../services/beneficio.service';
import { SupabaseService } from '../services/supabase.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StatCardComponent } from '../shared/stat-card.component';
import { BasculaService, Bascula } from '../services/bascula.service';

@Component({
  selector: 'app-beneficio',
  standalone: true,
  imports: [
    CommonModule, TableModule, ButtonModule, TagModule, ProgressBarModule, 
    ToastModule, DialogModule, DropdownModule, InputTextModule, InputNumberModule,
    FormsModule, ReactiveFormsModule, StatCardComponent
  ],
  providers: [MessageService],
  templateUrl: './beneficio.component.html',
  styleUrl: './beneficio.component.css'
})
export class BeneficioComponent implements OnInit {
  beneficios: Beneficio[] = [];
  basculas: Bascula[] = [];
  canales: any[] = [];
  loading = true;
  displayProcessDialog = false;
  displayNewDialog = false;
  beneficioForm: FormGroup;
  displayApprovalDialog = false;
  selectedBeneficio: Beneficio | null = null;
  razonRechazo: string = '';

  // Estadísticas (Simuladas por ahora)
  stats = {
    enProgreso: 0,
    completadas: 0,
    aprobadas: 0,
    rechazadas: 0
  };

  tiposAnimal = [
    { label: 'Vacuno', value: 'Vacuno' },
    { label: 'Porcino', value: 'Porcino' },
    { label: 'Ovino', value: 'Ovino' },
    { label: 'Caprino', value: 'Caprino' }
  ];

  constructor(
    private beneficioService: BeneficioService,
    private basculaService: BasculaService,
    private supabaseService: SupabaseService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.beneficioForm = this.fb.group({
      BasculaId: [null],
      CanalId: [null, Validators.required],
      NumeroFaena: ['', Validators.required],
      NumeroCanal: ['', Validators.required],
      TipoAnimal: ['Vacuno', Validators.required],
      NumeroIdentificacion: ['', Validators.required],
      PesoEntrada: [0, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.beneficioService.getAll().subscribe({
      next: (data) => {
        this.beneficios = data;
        this.calculateStats();
        this.loading = false;
      },
      error: () => {
        this.messageService.add({severity:'error', summary: 'Error', detail: 'No se pudieron cargar los datos de beneficio'});
        this.loading = false;
      }
    });

    this.basculaService.getAll().subscribe(data => this.basculas = data);
    // Simular canales disponibles por ahora (esto debería venir de un servicio)
    this.canales = [
      { Id: '1', NumeroCanal: '001' },
      { Id: '2', NumeroCanal: '002' },
      { Id: '3', NumeroCanal: '003' }
    ];
  }

  calculateStats() {
    this.stats.enProgreso = this.beneficios.filter(b => (b.Estado || 0) > 0 && (b.Estado || 0) < 7).length;
    this.stats.completadas = this.beneficios.filter(b => (b.Estado || 0) === 7 || (b.Estado || 0) === 8).length;
    this.stats.aprobadas = this.beneficios.filter(b => (b.Estado || 0) === 8).length;
    this.stats.rechazadas = this.beneficios.filter(b => (b.Estado || 0) === 9).length;
  }

  getStatusName(estado: number): string {
    const states = ['Pendiente', 'En Proceso', 'Insensibilizado', 'Desangrado', 'Pelado', 'Eviscerado', 'Dividido', 'Finalizado', 'Aprobado', 'Rechazado'];
    return states[estado] || 'Desconocido';
  }

  getSeverity(estado: number) {
    if (estado >= 8) return 'success';
    if (estado === 9) return 'danger';
    if (estado > 0) return 'warning';
    return 'info';
  }

  getProgress(estado: number): number {
    return (estado / 7) * 100;
  }

  // Acciones de proceso
  nextStep(beneficio: Beneficio) {
    const id = beneficio.Id!;
    const currentStep = beneficio.Estado || 0;

    if (currentStep === 6) {
      this.selectedBeneficio = beneficio;
      this.displayApprovalDialog = true;
      return;
    }

    switch(currentStep) {
      case 0: // De Pendiente a Insensibilizar
      case 1:
        this.beneficioService.insensibilizar(id, 1).subscribe(() => this.onSuccess('Insensibilización registrada'));
        break;
      case 2: // De Insensibilizado a Desangrar
        this.beneficioService.desangrar(id, { metodo: 1 }).subscribe(() => this.onSuccess('Desangre registrado'));
        break;
      case 3:
        this.beneficioService.pelar(id).subscribe(() => this.onSuccess('Pelado registrado'));
        break;
      case 4:
        this.beneficioService.eviscerar(id).subscribe(() => this.onSuccess('Evisceración registrada'));
        break;
      case 5:
        this.beneficioService.dividir(id).subscribe(() => this.onSuccess('División registrada'));
        break;
    }
  }

  aprobarBeneficio() {
    if (this.selectedBeneficio) {
      this.beneficioService.aprobar(this.selectedBeneficio.Id!).subscribe(() => {
        this.onSuccess('Beneficio aprobado por veterinaria');
        this.displayApprovalDialog = false;
      });
    }
  }

  rechazarBeneficio() {
    if (this.selectedBeneficio && this.razonRechazo) {
      this.beneficioService.rechazar(this.selectedBeneficio.Id!, this.razonRechazo).subscribe(() => {
        this.onSuccess('Beneficio rechazado (Decomiso)');
        this.displayApprovalDialog = false;
        this.razonRechazo = '';
      });
    } else {
      this.messageService.add({severity:'warn', summary: 'Atención', detail: 'Debe ingresar una razón para el rechazo'});
    }
  }

  onSuccess(msg: string) {
    this.messageService.add({severity:'success', summary: 'Éxito', detail: msg});
    this.loadData();
    
    // Log en la nube
    this.supabaseService.logOperation('BENEFICIO', 'ACTUALIZACION_PROCESO', { mensaje: msg });
  }

  showNewDialog() {
    this.beneficioForm.reset({ TipoAnimal: 'Vacuno', PesoEntrada: 0 });
    this.displayNewDialog = true;
  }

  createBeneficio() {
    if (this.beneficioForm.valid) {
      this.beneficioService.create(this.beneficioForm.value).subscribe({
        next: () => {
          this.onSuccess('Nueva faena registrada correctamente');
          this.displayNewDialog = false;
        },
        error: () => {
          this.messageService.add({severity:'error', summary: 'Error', detail: 'No se pudo crear el registro'});
        }
      });
    }
  }

  onCanalChange(event: any) {
    const selectedCanal = this.canales.find(c => c.Id === event.value);
    if (selectedCanal) {
      this.beneficioForm.patchValue({ NumeroCanal: selectedCanal.NumeroCanal });
    }
  }
}
