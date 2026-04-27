import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Despacho {
  Id?: string;
  NumeroDespacho: string;
  FechaDespacho?: string;
  Estado?: number;
  ClienteId: string;
  DireccionDestino?: string;
  PatentaVehiculo: string;
  TransportistaNombre: string;
  FechaSalida?: string;
  FechaEntregaConfirmada?: string;
  PesoTotalKg?: number;
  CantidadProductos?: number;
  MontoTotal?: number;
  TemperaturaVehiculo: number;
  NumeroSelloRefrigeracion?: string;
  ObservacionesDespacho?: string;
  AprobadoDespacho?: boolean;
  NumeroGuiaTransporte?: string;
  NumeroFactura?: string;
  ResponsableDespachoId?: string;
  cliente?: any;
  responsable?: any;
}

@Injectable({
  providedIn: 'root'
})
export class DespachoService {
  private apiUrl = 'http://localhost:8000/api/despacho';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Despacho[]> {
    return this.http.get<Despacho[]>(this.apiUrl);
  }

  getById(id: string): Observable<Despacho> {
    return this.http.get<Despacho>(`${this.apiUrl}/${id}`);
  }

  create(data: Partial<Despacho>): Observable<Despacho> {
    return this.http.post<Despacho>(this.apiUrl, data);
  }

  update(id: string, data: Partial<Despacho>): Observable<Despacho> {
    return this.http.put<Despacho>(`${this.apiUrl}/${id}`, data);
  }

  confirmar(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/confirmar`, {});
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
