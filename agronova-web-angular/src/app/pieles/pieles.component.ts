import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { PielService, Piel } from '../services/piel.service';
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
  selector: 'app-pieles',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TableModule, ButtonModule, DialogModule,
    InputTextModule, InputNumberModule, TagModule, ToastModule, TooltipModule, ConfirmDialogModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './pieles.component.html',
  styleUrl: './pieles.component.css'
})
export class PielesComponent implements OnInit {
  items: Piel[] = [];
  loading = true;
  displayDialog = false;
  editingId: string | null = null;
  form: FormGroup;

  constructor(private service: PielService, private messageService: MessageService,
    private confirmationService: ConfirmationService, private fb: FormBuilder) {
    this.form = this.fb.group({
      CanalId:      [''],
      FechaRegistro:[''],
      PesoKg:       [null],
      Estado:       ['Disponible'],
      Destino:      [''],
      PrecioKg:     [null],
      Observaciones:[''],
    });
  }

  ngOnInit() { this.loadData(); }

  loadData() {
    this.loading = true;
    this.service.getAll().subscribe({
      next: (data: any) => { this.items = data.data ?? data; this.loading = false; },
      error: () => { this.messageService.add({severity:'error',summary:'Error',detail:'No se pudieron cargar las pieles'}); this.loading = false; }
    });
  }

  openNew() { this.editingId = null; this.form.reset({Estado:'Disponible'}); this.displayDialog = true; }
  openEdit(item: Piel) { this.editingId = item.Id!; this.form.patchValue(item); this.displayDialog = true; }

  save() {
    const op = this.editingId ? this.service.update(this.editingId, this.form.value) : this.service.create(this.form.value);
    op.subscribe({
      next: () => { this.messageService.add({severity:'success',summary:'Guardado',detail:'Registro guardado'}); this.displayDialog = false; this.loadData(); },
      error: () => this.messageService.add({severity:'error',summary:'Error',detail:'Error al guardar'})
    });
  }

  confirmDelete(item: Piel) {
    this.confirmationService.confirm({
      message: '¿Eliminar este registro?', header: 'Confirmar', icon: 'pi pi-exclamation-triangle',
      accept: () => this.service.delete(item.Id!).subscribe({ next: () => { this.messageService.add({severity:'success',summary:'Eliminado',detail:'Eliminado'}); this.loadData(); } })
    });
  }

  getSeverity(estado?: string): 'success'|'info'|'secondary' {
    if (estado === 'Vendida') return 'success';
    if (estado === 'Descartada') return 'secondary';
    return 'info';
  }
}
