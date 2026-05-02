import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Movimiento {
  Id?: string;
  Tipo: string;
  InsumoId: string;
  Cantidad: number;
  StockAnterior?: number;
  StockResultante?: number;
  FechaMovimiento?: string;
  Referencia?: string;
  Motivo?: string;
  insumo?: any;
}

@Injectable({ providedIn: 'root' })
export class MovimientoService {
  private apiUrl = environment.apiUrl + '/movimientos';
  constructor(private http: HttpClient) {}
  getAll(): Observable<Movimiento[]> { return this.http.get<Movimiento[]>(this.apiUrl); }
  create(data: Partial<Movimiento>): Observable<Movimiento> { return this.http.post<Movimiento>(this.apiUrl, data); }
}
