import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface TipoProducto {
  Id?: string;
  Nombre: string;
  Codigo?: string;
  Clasificacion?: string;
  Descripcion?: string;
  PrecioBaseKg?: number;
  PesoMinimo?: number;
  PesoMaximo?: number;
  TemperaturaOptima?: number;
  DiasVidaUtil?: number;
  RequiereControlCalidad?: boolean;
  Activo?: boolean;
}

@Injectable({ providedIn: 'root' })
export class TipoProductoService {
  private apiUrl = environment.apiUrl + '/tipos-producto';

  constructor(private http: HttpClient) {}

  getAll(): Observable<TipoProducto[]> {
    return this.http.get<TipoProducto[]>(this.apiUrl);
  }

  getById(id: string): Observable<TipoProducto> {
    return this.http.get<TipoProducto>(`${this.apiUrl}/${id}`);
  }

  create(data: Partial<TipoProducto>): Observable<TipoProducto> {
    return this.http.post<TipoProducto>(this.apiUrl, data);
  }

  update(id: string, data: Partial<TipoProducto>): Observable<TipoProducto> {
    return this.http.put<TipoProducto>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
