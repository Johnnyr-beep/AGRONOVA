import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DevolucionService, Devolucion } from '../services/devolucion.service';
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
  selector: 'app-devoluciones',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TableModule, ButtonModule, DialogModule,
    InputTextModule, InputNumberModule, TagModule, ToastModule, TooltipModule, ConfirmDialogModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './devoluciones.component.html',
  styleUrl: './devoluciones.component.css'
})
export class DevolucionesComponent implements OnInit {
  items: Devolucion[] = [];
  loading = true;
  displayDialog = false;
  editingId: string | null = null;
  form: FormGroup;

  constructor(private service: DevolucionService, private messageService: MessageService,
    private confirmationService: ConfirmationService, private fb: FormBuilder) {
    this.form = this.fb.group({
      NumeroDevolucion: ['', Validators.required],
      FechaDevolucion:  [''],
      MotivoDevolucion: [''],
      PesoDevueltoKg:   [null],
      MontoDevolucion:  [null],
      Observaciones:    [''],
    });
  }

  ngOnInit() { this.loadData(); }

  loadData() {
    this.loading = true;
    this.service.getAll().subscribe({
      next: (data: any) => { this.items = data.data ?? data; this.loading = false; },
      error: () => { this.messageService.add({severity:'error',summary:'Error',detail:'No se pudieron cargar las devoluciones'}); this.loading = false; }
    });
  }

  openNew() { this.editingId = null; this.form.reset(); this.displayDialog = true; }
  openEdit(item: Devolucion) { this.editingId = item.Id!; this.form.patchValue(item); this.displayDialog = true; }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const op = this.editingId ? this.service.update(this.editingId, this.form.value) : this.service.create(this.form.value);
    op.subscribe({
      next: () => { this.messageService.add({severity:'success',summary:'Guardado',detail:'Devolución guardada'}); this.displayDialog = false; this.loadData(); },
      error: (err: any) => { const msg = err?.error?.errors ? Object.values(err.error.errors).flat().join(' ') : 'Error al guardar'; this.messageService.add({severity:'error',summary:'Error',detail:msg as string}); }
    });
  }

  aprobar(item: Devolucion) {
    this.service.aprobar(item.Id!).subscribe({
      next: () => { this.messageService.add({severity:'success',summary:'Aprobada',detail:'Devolución aprobada'}); this.loadData(); },
      error: () => this.messageService.add({severity:'error',summary:'Error',detail:'No se pudo aprobar'})
    });
  }

  confirmDelete(item: Devolucion) {
    this.confirmationService.confirm({
      message: `¿Eliminar devolución ${item.NumeroDevolucion}?`, header: 'Confirmar', icon: 'pi pi-exclamation-triangle',
      accept: () => this.service.delete(item.Id!).subscribe({ next: () => { this.messageService.add({severity:'success',summary:'Eliminado',detail:'Devolución eliminada'}); this.loadData(); } })
    });
  }

  getSeverity(estado?: string): 'success'|'warning'|'danger'|'info' {
    if (estado === 'Aprobada') return 'success';
    if (estado === 'Rechazada') return 'danger';
    return 'warning';
  }

  fieldInvalid(f: string) { const c = this.form.get(f); return !!(c && c.invalid && c.touched); }
}
