import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MovimientoService, Movimiento } from '../services/movimiento.service';
import { InsumoService, Insumo } from '../services/insumo.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-movimientos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TableModule, ButtonModule, DialogModule,
    InputTextModule, InputNumberModule, DropdownModule, TagModule, ToastModule, TooltipModule],
  providers: [MessageService],
  templateUrl: './movimientos.component.html',
  styleUrl: './movimientos.component.css'
})
export class MovimientosComponent implements OnInit {
  items: Movimiento[] = [];
  insumos: Insumo[] = [];
  loading = true;
  displayDialog = false;
  form: FormGroup;

  tipoOptions = [
    { label: 'Entrada', value: 'Entrada' },
    { label: 'Salida', value: 'Salida' },
    { label: 'Ajuste', value: 'Ajuste' },
  ];

  constructor(private service: MovimientoService, private insumoService: InsumoService,
    private messageService: MessageService, private fb: FormBuilder) {
    this.form = this.fb.group({
      Tipo:      ['Entrada', Validators.required],
      InsumoId:  ['', Validators.required],
      Cantidad:  [null, [Validators.required, Validators.min(0.001)]],
      Referencia:[''],
      Motivo:    [''],
    });
  }

  ngOnInit() {
    this.loadData();
    this.insumoService.getAll().subscribe(data => this.insumos = data);
  }

  loadData() {
    this.loading = true;
    this.service.getAll().subscribe({
      next: (data: any) => { this.items = data.data ?? data; this.loading = false; },
      error: () => { this.messageService.add({severity:'error',summary:'Error',detail:'No se pudieron cargar los movimientos'}); this.loading = false; }
    });
  }

  openNew() { this.form.reset({Tipo:'Entrada'}); this.displayDialog = true; }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.service.create(this.form.value).subscribe({
      next: () => { this.messageService.add({severity:'success',summary:'Registrado',detail:'Movimiento registrado y stock actualizado'}); this.displayDialog = false; this.loadData(); },
      error: (err: any) => { const msg = err?.error?.message ?? 'Error al registrar'; this.messageService.add({severity:'error',summary:'Error',detail:msg}); }
    });
  }

  getSeverity(tipo?: string): 'success'|'danger'|'warning' {
    if (tipo === 'Entrada') return 'success';
    if (tipo === 'Salida') return 'danger';
    return 'warning';
  }

  getInsumoNombre(id?: string): string {
    return this.insumos.find(i => i.Id === id)?.Nombre ?? id ?? '—';
  }
}
