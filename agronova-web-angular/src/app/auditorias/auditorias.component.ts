import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditoriaService, Auditoria } from '../services/auditoria.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-auditorias',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, DialogModule, TagModule, ToastModule],
  providers: [MessageService],
  templateUrl: './auditorias.component.html',
  styleUrl: './auditorias.component.css'
})
export class AuditoriasComponent implements OnInit {
  items: Auditoria[] = [];
  loading = true;
  displayDetail = false;
  selected: Auditoria | null = null;

  constructor(private service: AuditoriaService, private messageService: MessageService) {}

  ngOnInit() { this.loadData(); }

  loadData() {
    this.loading = true;
    this.service.getAll().subscribe({
      next: (data: any) => { this.items = data.data ?? data; this.loading = false; },
      error: () => { this.messageService.add({severity:'error',summary:'Error',detail:'No se pudieron cargar las auditorías'}); this.loading = false; }
    });
  }

  verDetalle(item: Auditoria) { this.selected = item; this.displayDetail = true; }

  jsonPretty(obj: any): string {
    if (!obj) return '—';
    try { return JSON.stringify(obj, null, 2); } catch { return String(obj); }
  }

  getSeverity(accion?: string): 'success'|'info'|'danger'|'secondary'|'warning' {
    if (accion === 'CREATE') return 'success';
    if (accion === 'UPDATE') return 'info';
    if (accion === 'DELETE') return 'danger';
    if (accion === 'LOGIN') return 'secondary';
    return 'warning';
  }
}
