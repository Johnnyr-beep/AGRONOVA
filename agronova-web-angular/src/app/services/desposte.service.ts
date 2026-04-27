import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Desposte {
  Id?: string;
  CanalId: string;
  FechaDesposte?: string;
  NumeroDesposte: string;
  Estado?: number;
  OperarioId: string;
  PesoCanalOriginal: number;
  HoraInicio?: string;
  HoraFin?: string;
  PesoTotalProductos?: number;
  PerdidaProcesoKg?: number;
  ObservacionesCalidad?: string;
  AptilizadoControlCalidad?: boolean;
  canal?: any;
  operario?: any;
}

@Injectable({
  providedIn: 'root'
})
export class DesposteService {
  private apiUrl = 'http://localhost:8000/api/desposte';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Desposte[]> {
    return this.http.get<Desposte[]>(this.apiUrl);
  }

  getById(id: string): Observable<Desposte> {
    return this.http.get<Desposte>(`${this.apiUrl}/${id}`);
  }

  create(data: Partial<Desposte>): Observable<Desposte> {
    return this.http.post<Desposte>(this.apiUrl, data);
  }

  update(id: string, data: Partial<Desposte>): Observable<Desposte> {
    return this.http.put<Desposte>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getReport(fechaInicio: string, fechaFin: string): Observable<any> {
    return this.http.get(`${this.apiUrl}-reporte`, { params: { fechaInicio, fechaFin } });
  }
}
