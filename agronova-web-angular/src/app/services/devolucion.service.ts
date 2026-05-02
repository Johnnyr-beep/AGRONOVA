import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Devolucion {
  Id?: string;
  NumeroDevolucion: string;
  FechaDevolucion?: string;
  DespachoId?: string;
  ClienteId?: string;
  MotivoDevolucion?: string;
  PesoDevueltoKg?: number;
  MontoDevolucion?: number;
  Estado?: string;
  Observaciones?: string;
}

@Injectable({ providedIn: 'root' })
export class DevolucionService {
  private apiUrl = environment.apiUrl + '/devoluciones';
  constructor(private http: HttpClient) {}
  getAll(): Observable<Devolucion[]> { return this.http.get<Devolucion[]>(this.apiUrl); }
  getById(id: string): Observable<Devolucion> { return this.http.get<Devolucion>(`${this.apiUrl}/${id}`); }
  create(data: Partial<Devolucion>): Observable<Devolucion> { return this.http.post<Devolucion>(this.apiUrl, data); }
  update(id: string, data: Partial<Devolucion>): Observable<Devolucion> { return this.http.put<Devolucion>(`${this.apiUrl}/${id}`, data); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.apiUrl}/${id}`); }
  aprobar(id: string): Observable<any> { return this.http.post(`${this.apiUrl}/${id}/aprobar`, {}); }
}
