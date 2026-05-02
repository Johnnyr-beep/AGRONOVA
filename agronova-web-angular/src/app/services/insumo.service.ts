import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Insumo {
  Id?: string;
  Nombre: string;
  Codigo?: string;
  Descripcion?: string;
  UnidadMedida?: string;
  StockActual?: number;
  StockMinimo?: number;
  PrecioUnitario?: number;
  ProveedorNombre?: string;
  Activo?: boolean;
}

@Injectable({ providedIn: 'root' })
export class InsumoService {
  private apiUrl = environment.apiUrl + '/insumos';
  constructor(private http: HttpClient) {}
  getAll(): Observable<Insumo[]> { return this.http.get<Insumo[]>(this.apiUrl); }
  getById(id: string): Observable<Insumo> { return this.http.get<Insumo>(`${this.apiUrl}/${id}`); }
  create(data: Partial<Insumo>): Observable<Insumo> { return this.http.post<Insumo>(this.apiUrl, data); }
  update(id: string, data: Partial<Insumo>): Observable<Insumo> { return this.http.put<Insumo>(`${this.apiUrl}/${id}`, data); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.apiUrl}/${id}`); }
}
