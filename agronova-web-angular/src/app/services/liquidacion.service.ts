import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Liquidacion {
  Id?: string;
  NumeroLiquidacion: string;
  FechaLiquidacion?: string;
  BeneficioId?: string;
  ProveedorId?: string;
  TotalAnimales?: number;
  PesoTotalKg?: number;
  PrecioKg?: number;
  ValorBruto?: number;
  Deducciones?: number;
  ValorNeto?: number;
  Estado?: string;
  FechaPago?: string;
  Observaciones?: string;
}

@Injectable({ providedIn: 'root' })
export class LiquidacionService {
  private apiUrl = environment.apiUrl + '/liquidaciones';
  constructor(private http: HttpClient) {}
  getAll(): Observable<Liquidacion[]> { return this.http.get<Liquidacion[]>(this.apiUrl); }
  getById(id: string): Observable<Liquidacion> { return this.http.get<Liquidacion>(`${this.apiUrl}/${id}`); }
  create(data: Partial<Liquidacion>): Observable<Liquidacion> { return this.http.post<Liquidacion>(this.apiUrl, data); }
  update(id: string, data: Partial<Liquidacion>): Observable<Liquidacion> { return this.http.put<Liquidacion>(`${this.apiUrl}/${id}`, data); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.apiUrl}/${id}`); }
  aprobar(id: string): Observable<any> { return this.http.post(`${this.apiUrl}/${id}/aprobar`, {}); }
  marcarPagada(id: string): Observable<any> { return this.http.post(`${this.apiUrl}/${id}/pagar`, {}); }
}
