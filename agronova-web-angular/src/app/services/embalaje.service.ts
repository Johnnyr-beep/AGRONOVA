import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Embalaje {
  Id?: string;
  NumeroEmbalaje: string;
  FechaEmbalaje?: string;
  TipoProductoId?: string;
  PesoNeto?: number;
  PesoBruto?: number;
  PesoTara?: number;
  CantidadUnidades?: number;
  TemperaturaProducto?: number;
  Lote?: string;
  FechaVencimiento?: string;
  CodigoBarras?: string;
  Estado?: string;
  Observaciones?: string;
}

@Injectable({ providedIn: 'root' })
export class EmbalajeService {
  private apiUrl = environment.apiUrl + '/embalajes';
  constructor(private http: HttpClient) {}
  getAll(): Observable<Embalaje[]> { return this.http.get<Embalaje[]>(this.apiUrl); }
  getById(id: string): Observable<Embalaje> { return this.http.get<Embalaje>(`${this.apiUrl}/${id}`); }
  create(data: Partial<Embalaje>): Observable<Embalaje> { return this.http.post<Embalaje>(this.apiUrl, data); }
  update(id: string, data: Partial<Embalaje>): Observable<Embalaje> { return this.http.put<Embalaje>(`${this.apiUrl}/${id}`, data); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.apiUrl}/${id}`); }
}
