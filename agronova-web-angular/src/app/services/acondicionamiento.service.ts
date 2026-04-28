import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Acondicionamiento {
  Id?: string;
  NumeroAcondicionamiento: string;
  FechaAcondicionamiento?: string;
  DesposteId: string;
  Estado?: number;
  OperarioId: string;
  AprobadoPorId?: string;
  HoraInicio?: string;
  HoraFin?: string;
  CantidadProductosAcondicionados?: number;
  PesoTotalAcondicionado?: number;
  TemperaturaProductos?: number;
  EtiquetadoCompleto?: boolean;
  AprobadoControlCalidad?: boolean;
  desposte?: any;
  operario?: any;
  aprobadoPor?: any;
}

@Injectable({
  providedIn: 'root'
})
export class AcondicionamientoService {
  private apiUrl = environment.apiUrl + '/acondicionamiento';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Acondicionamiento[]> {
    return this.http.get<Acondicionamiento[]>(this.apiUrl);
  }

  getById(id: string): Observable<Acondicionamiento> {
    return this.http.get<Acondicionamiento>(`${this.apiUrl}/${id}`);
  }

  create(data: Partial<Acondicionamiento>): Observable<Acondicionamiento> {
    return this.http.post<Acondicionamiento>(this.apiUrl, data);
  }

  update(id: string, data: Partial<Acondicionamiento>): Observable<Acondicionamiento> {
    return this.http.put<Acondicionamiento>(`${this.apiUrl}/${id}`, data);
  }

  aprobar(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/aprobar`, {});
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
