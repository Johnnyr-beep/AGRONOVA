import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PesoEnPieService, PesoEnPie, PesoEnPieStats } from '../services/peso-en-pie.service';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TooltipModule } from 'primeng/tooltip';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CalendarModule } from 'primeng/calendar';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-peso-en-pie',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    TableModule, ButtonModule, InputTextModule, TagModule,
    InputNumberModule, ToastModule, AutoCompleteModule,
    TooltipModule, SelectButtonModule, CalendarModule
  ],
  providers: [MessageService],
  templateUrl: './peso-en-pie.component.html',
  styleUrl: './peso-en-pie.component.css'
})
export class PesoEnPieComponent implements OnInit {
  registros: PesoEnPie[] = [];
  loading = true;
  form: FormGroup;
  stats: PesoEnPieStats = { totalAnimales: 0, pesoTotal: 0, guiasAbiertas: 0 };

  tiposAnimal = [
    { label: 'MACHO', value: 'MACHO' },
    { label: 'HEMBRA', value: 'HEMBRA' },
    { label: 'BÚFALO', value: 'BUFALO' },
    { label: 'BÚFALA', value: 'BUFALA' },
  ];

  suggestions: { [key: string]: string[] } = {
    GuiaMovilizacion: [],
    ProveedorNombre: [],
    ClienteNombre: [],
  };

  get registrosAbiertos(): PesoEnPie[] {
    return this.registros.filter(r => r.Estado !== 'Cerrado');
  }

  constructor(
    private service: PesoEnPieService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      id: [null],
      Fecha: [new Date(), Validators.required],
      GuiaMovilizacion: ['', Validators.required],
      ProveedorNombre: ['', Validators.required],
      ClienteNombre: ['', Validators.required],
      TipoAnimal: ['MACHO', Validators.required],
      UbicacionCorral: ['', Validators.required],
      PesoKg: [null, [Validators.required, Validators.min(1)]],
      Observaciones: [''],
    });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.service.getAll().subscribe({
      next: (data) => {
        this.registros = data;
        this.loading = false;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los registros' });
        this.loading = false;
      }
    });
    this.service.getStats().subscribe({
      next: (s) => this.stats = s,
      error: () => {}
    });
  }

  searchSuggestions(event: any, field: string) {
    this.service.getSuggestions(field, event.query).subscribe(data => {
      this.suggestions[field] = data;
    });
  }

  clear() {
    this.form.reset({ Fecha: new Date(), TipoAnimal: 'MACHO' });
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.messageService.add({ severity: 'warn', summary: 'Campos incompletos', detail: 'Revise los campos obligatorios', life: 5000 });
      return;
    }

    const payload = { ...this.form.value };
    if (payload.Fecha instanceof Date) {
      payload.Fecha = payload.Fecha.toISOString().split('T')[0];
    }
    delete payload.id;

    this.loading = true;
    this.service.create(payload).subscribe({
      next: (res) => {
        this.messageService.add({ severity: 'success', summary: 'Registrado', detail: `Consecutivo: ${res.Consecutivo}` });
        this.clear();
        this.loadData();
      },
      error: (err) => {
        let detail = 'No se pudo guardar el registro.';
        if (err.status === 422) detail = 'La guía de movilización ya fue registrada.';
        else if (err.status === 0) detail = 'No se puede conectar con el servidor.';
        this.messageService.add({ severity: 'error', summary: 'Error', detail, life: 8000 });
        this.loading = false;
      }
    });
  }

  cerrar(item: PesoEnPie) {
    if (!item.id) return;
    this.service.update(item.id, { Estado: 'Cerrado' }).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Cerrado', detail: `${item.Consecutivo} marcado como cerrado` });
        this.loadData();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cerrar el registro' });
      }
    });
  }

  fieldInvalid(name: string): boolean {
    const ctrl = this.form.get(name);
    return !!(ctrl && ctrl.invalid && ctrl.touched);
  }

  tipoAnimalColor(tipo: string): string {
    const map: { [k: string]: string } = {
      MACHO: '#6C5CE7',
      HEMBRA: '#FD79A8',
      BUFALO: '#00CEC9',
      BUFALA: '#FDCB6E',
    };
    return map[tipo] ?? '#7C8190';
  }
}
