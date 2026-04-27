import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  get openGuides(): Bascula[] {
    return this.basculas.filter(b => b.Estado !== 'Cerrado');
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
      NumeroTicket: ['', Validators.required],
      NumeroBascula: [1, Validators.required],
      GuiaMovilizacion: [''],
      Procedencia: [''],
      ProveedorNombre: [''],
      ClienteNombre: [''],
      PatentaVehiculo: ['', Validators.required],
      Conductor: [''],
      Transportista: [''],
      Referencia: [''],
      PesoLleno: [0, Validators.required],
      PesoVacio: [0, Validators.required],
      CantidadAnimales: [0, Validators.required],
      Observaciones: ['']
    });
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
        this.messageService.add({severity:'error', summary: 'Error', detail: 'No se pudieron cargar los datos'});
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

  // BOTÓN 1: GUARDAR (Validación básica)
  save() {
    if (this.basculaForm.get('NumeroTicket')?.value && this.basculaForm.get('PatentaVehiculo')?.value) {
      this.executeSave('Registro guardado localmente');
    } else {
      this.messageService.add({severity:'warn', summary: 'Atención', detail: 'Complete al menos Nº Ticket y Placa para guardar'});
    }
  }

  // BOTÓN 2: BORRAR (Reset)
  clear() {
    this.basculaForm.reset({ NumeroBascula: 1, PesoLleno: 0, PesoVacio: 0, CantidadAnimales: 0 });
    this.messageService.add({severity:'info', summary: 'Limpio', detail: 'Formulario reiniciado'});
  }

  // BOTÓN 3: REGISTRAR (Todos los campos obligatorios)
  register() {
    if (this.isFormComplete()) {
      this.executeSave('Información capturada y registrada oficialmente');
      // Se eliminó la impresión automática por solicitud del usuario
      // setTimeout(() => this.printPDF(), 1500); 
    } else {
      this.messageService.add({severity:'error', summary: 'Incompleto', detail: 'Debe llenar TODOS los campos para realizar el registro oficial'});
    }
  }

  // BOTÓN 4: CERRAR ORDEN
  closeOrder() {
    const id = this.basculaForm.get('Id')?.value;
    if (id) {
      this.loading = true;
      this.basculaService.update(id, { Estado: 'Cerrado' }).subscribe({
        next: () => {
          this.messageService.add({severity:'success', summary: 'Orden Cerrada', detail: 'La orden de pesaje ha sido finalizada y bloqueada'});
          this.loadData();
          this.loading = false;
        },
        error: () => {
          this.messageService.add({severity:'error', summary: 'Error', detail: 'No se pudo cerrar la orden'});
          this.loading = false;
        }
      });
    } else {
      this.messageService.add({severity:'warn', summary: 'Atención', detail: 'Debe cargar una orden existente para poder cerrarla'});
    }
  }

  // BOTÓN 5: IMPRIMIR PDF
  printPDF() {
    window.print();
  }

  // Lógica de Captura de Báscula (Real vía WebSerial)
  async captureWeight(field: string) {
    this.messageService.add({severity:'info', summary: 'Conexión', detail: 'Estableciendo comunicación con la báscula...'});
    
    const connected = await this.webSerialService.requestPort();
    if (!connected) {
      this.messageService.add({severity:'error', summary: 'Error', detail: 'No se pudo acceder al puerto de la báscula'});
      return;
    }

    this.messageService.add({severity:'info', summary: 'Báscula', detail: 'Leyendo peso estable...'});
    const weight = await this.webSerialService.readWeight();

    if (weight !== null) {
      this.basculaForm.get(field)?.setValue(weight);
      this.messageService.add({severity:'success', summary: 'Peso Capturado', detail: `Se ha registrado un peso de ${weight} kg`});
    } else {
      this.messageService.add({severity:'warn', summary: 'Sin Datos', detail: 'No se recibió una trama de peso válida'});
    }
  }

  // Helper para verificar si todos los campos están llenos
  isFormComplete(): boolean {
    const fields = [
      'NumeroTicket', 'GuiaMovilizacion', 'Procedencia', 'ProveedorNombre', 
      'ClienteNombre', 'PatentaVehiculo', 'Conductor', 'Referencia', 
      'PesoLleno', 'PesoVacio', 'CantidadAnimales'
    ];
    return fields.every(field => {
      const val = this.basculaForm.get(field)?.value;
      return val !== null && val !== undefined && val !== '';
    });
  }

  private executeSave(successMsg: string) {
    const pesoLleno = this.basculaForm.get('PesoLleno')?.value;
    const pesoVacio = this.basculaForm.get('PesoVacio')?.value;

    if (pesoVacio >= pesoLleno && pesoLleno > 0) {
      this.messageService.add({
        severity: 'error', 
        summary: 'Error de Pesaje', 
        detail: 'El peso de salida (vacio) debe ser menor al peso de entrada (lleno)'
      });
      return;
    }

    this.loading = true;
    this.basculaService.create(this.basculaForm.value).subscribe({
      next: () => {
        this.messageService.add({severity:'success', summary: 'Éxito', detail: successMsg});
        this.loadData();
        this.loading = false;
        
        // Registrar en la nube para auditoría
        this.supabaseService.logOperation('BASCULA', 'REGISTRO_PESAJE', {
          ticket: this.basculaForm.get('NumeroTicket')?.value,
          placa: this.basculaForm.get('PatentaVehiculo')?.value,
          peso_neto: (pesoLleno - pesoVacio)
        });
      },
      error: (err) => {
        let detail = 'No se pudo procesar la solicitud';
        if (err.status === 422) {
           detail = 'La Guía de Movilización o el Ticket ya existen.';
        }
        this.messageService.add({severity:'error', summary: 'Error', detail: detail});
        this.loading = false;
      }
    });
  }
}
