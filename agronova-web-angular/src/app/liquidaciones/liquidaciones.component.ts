import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LiquidacionService, Liquidacion } from '../services/liquidacion.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-liquidaciones',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TableModule, ButtonModule, DialogModule,
    InputTextModule, InputNumberModule, TagModule, ToastModule, TooltipModule, ConfirmDialogModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './liquidaciones.component.html',
  styleUrl: './liquidaciones.component.css'
})
export class LiquidacionesComponent implements OnInit {
  items: Liquidacion[] = [];
  loading = true;
  displayDialog = false;
  editingId: string | null = null;
  form: FormGroup;

  constructor(private service: LiquidacionService, private messageService: MessageService,
    private confirmationService: ConfirmationService, private fb: FormBuilder) {
    this.form = this.fb.group({
      NumeroLiquidacion: ['', Validators.required],
      FechaLiquidacion:  [''],
      TotalAnimales:     [null],
      PesoTotalKg:       [null],
      PrecioKg:          [null],
      ValorBruto:        [null],
      Deducciones:       [0],
      ValorNeto:         [null],
      Observaciones:     [''],
    });
  }

  ngOnInit() { this.loadData(); }

  loadData() {
    this.loading = true;
    this.service.getAll().subscribe({
      next: (data: any) => { this.items = data.data ?? data; this.loading = false; },
      error: () => { this.messageService.add({severity:'error',summary:'Error',detail:'No se pudieron cargar las liquidaciones'}); this.loading = false; }
    });
  }

  openNew() { this.editingId = null; this.form.reset({Deducciones:0}); this.displayDialog = true; }
  openEdit(item: Liquidacion) { this.editingId = item.Id!; this.form.patchValue(item); this.displayDialog = true; }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const op = this.editingId ? this.service.update(this.editingId, this.form.value) : this.service.create(this.form.value);
    op.subscribe({
      next: () => { this.messageService.add({severity:'success',summary:'Guardado',detail:'Liquidación guardada'}); this.displayDialog = false; this.loadData(); },
      error: (err: any) => { const msg = err?.error?.errors ? Object.values(err.error.errors).flat().join(' ') : 'Error'; this.messageService.add({severity:'error',summary:'Error',detail:msg as string}); }
    });
  }

  aprobar(item: Liquidacion) {
    this.service.aprobar(item.Id!).subscribe({
      next: () => { this.messageService.add({severity:'success',summary:'Aprobada',detail:'Liquidación aprobada'}); this.loadData(); }
    });
  }

  marcarPagada(item: Liquidacion) {
    this.service.marcarPagada(item.Id!).subscribe({
      next: () => { this.messageService.add({severity:'success',summary:'Pagada',detail:'Liquidación marcada como pagada'}); this.loadData(); }
    });
  }

  confirmDelete(item: Liquidacion) {
    this.confirmationService.confirm({
      message: `¿Eliminar liquidación ${item.NumeroLiquidacion}?`, header: 'Confirmar', icon: 'pi pi-exclamation-triangle',
      accept: () => this.service.delete(item.Id!).subscribe({ next: () => { this.messageService.add({severity:'success',summary:'Eliminado',detail:'Eliminado'}); this.loadData(); } })
    });
  }

  getSeverity(estado?: string): 'success'|'info'|'warning' {
    if (estado === 'Pagada') return 'success';
    if (estado === 'Aprobada') return 'info';
    return 'warning';
  }

  fieldInvalid(f: string) { const c = this.form.get(f); return !!(c && c.invalid && c.touched); }
}
