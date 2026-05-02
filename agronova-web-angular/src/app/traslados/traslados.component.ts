import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TrasladoService, Traslado } from '../services/traslado.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-traslados',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TableModule, ButtonModule, DialogModule,
    InputTextModule, TagModule, ToastModule, TooltipModule, ConfirmDialogModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './traslados.component.html',
  styleUrl: './traslados.component.css'
})
export class TrasladosComponent implements OnInit {
  items: Traslado[] = [];
  loading = true;
  displayDialog = false;
  editingId: string | null = null;
  form: FormGroup;

  constructor(private service: TrasladoService, private messageService: MessageService,
    private confirmationService: ConfirmationService, private fb: FormBuilder) {
    this.form = this.fb.group({
      NumeroTraslado: ['', Validators.required],
      FechaTraslado:  [''],
      CanalId:        [''],
      Origen:         [''],
      Destino:        [''],
      Observaciones:  [''],
    });
  }

  ngOnInit() { this.loadData(); }

  loadData() {
    this.loading = true;
    this.service.getAll().subscribe({
      next: (data: any) => { this.items = data.data ?? data; this.loading = false; },
      error: () => { this.messageService.add({severity:'error',summary:'Error',detail:'No se pudieron cargar los traslados'}); this.loading = false; }
    });
  }

  openNew() { this.editingId = null; this.form.reset(); this.displayDialog = true; }
  openEdit(item: Traslado) { this.editingId = item.Id!; this.form.patchValue(item); this.displayDialog = true; }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const op = this.editingId ? this.service.update(this.editingId, this.form.value) : this.service.create(this.form.value);
    op.subscribe({
      next: () => { this.messageService.add({severity:'success',summary:'Guardado',detail:'Traslado guardado'}); this.displayDialog = false; this.loadData(); },
      error: (err: any) => { const msg = err?.error?.errors ? Object.values(err.error.errors).flat().join(' ') : 'Error'; this.messageService.add({severity:'error',summary:'Error',detail:msg as string}); }
    });
  }

  ejecutar(item: Traslado) {
    this.service.ejecutar(item.Id!).subscribe({
      next: () => { this.messageService.add({severity:'success',summary:'Ejecutado',detail:'Traslado ejecutado'}); this.loadData(); },
      error: () => this.messageService.add({severity:'error',summary:'Error',detail:'No se pudo ejecutar'})
    });
  }

  confirmDelete(item: Traslado) {
    this.confirmationService.confirm({
      message: `¿Eliminar traslado ${item.NumeroTraslado}?`, header: 'Confirmar', icon: 'pi pi-exclamation-triangle',
      accept: () => this.service.delete(item.Id!).subscribe({ next: () => { this.messageService.add({severity:'success',summary:'Eliminado',detail:'Eliminado'}); this.loadData(); } })
    });
  }

  fieldInvalid(f: string) { const c = this.form.get(f); return !!(c && c.invalid && c.touched); }
}
