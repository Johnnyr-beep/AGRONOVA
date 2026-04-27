import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportesService } from '../services/reportes.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [
    CommonModule, TableModule, ButtonModule, CalendarModule, 
    CardModule, FormsModule, ToastModule, TagModule
  ],
  providers: [MessageService],
  templateUrl: './reportes.component.html',
})
export class ReportesComponent implements OnInit {
  activeTab: string = 'faena';
  faenaData: any[] = [];
  desposteData: any[] = [];
  dateRange: Date[] = [];
  loadingFaena = false;
  loadingDesposte = false;

  constructor(private reportesService: ReportesService) {}

  ngOnInit() {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 1);
    this.dateRange = [lastMonth, today];
    this.loadReports();
  }

  loadReports() {
    if (!this.dateRange || this.dateRange.length < 2) return;

    const params = {
      fecha_inicio: this.dateRange[0].toISOString().split('T')[0],
      fecha_fin: this.dateRange[1].toISOString().split('T')[0]
    };

    this.loadingFaena = true;
    this.reportesService.getFaenaReport(params).subscribe(data => {
      this.faenaData = data;
      this.loadingFaena = false;
    });

    this.loadingDesposte = true;
    this.reportesService.getDesposteReport(params).subscribe(data => {
      this.desposteData = data;
      this.loadingDesposte = false;
    });
  }

  exportExcel() {
    // Implementación de exportación lógica (Simulada por ahora como CSV)
    console.log('Exportando a Excel...');
  }
}
