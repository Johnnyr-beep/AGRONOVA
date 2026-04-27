import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Bascula {
  Id?: string;
  NumeroTicket: string;
  NumeroBascula: number;
  GuiaMovilizacion?: string;
  PatentaVehiculo: string;
  Transportista: string;
  Conductor?: string;
  Procedencia?: string;
  ClienteNombre?: string;
  Referencia?: string;
  PesoLleno: number;
  PesoVacio: number;
  PesoNeto?: number;
  CantidadAnimales: number;
  ProveedorId?: string;
  ProveedorNombre?: string;
  Observaciones?: string;
  Estado?: string;
  FechaIngreso?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BasculaService {
  private apiUrl = 'http://localhost:8000/api/bascula';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Bascula[]> {
    return this.http.get<Bascula[]>(this.apiUrl);
  }

  getById(id: string): Observable<Bascula> {
    return this.http.get<Bascula>(`${this.apiUrl}/${id}`);
  }

  create(data: Bascula): Observable<Bascula> {
    return this.http.post<Bascula>(this.apiUrl, data);
  }

  update(id: string, data: Partial<Bascula>): Observable<Bascula> {
    return this.http.put<Bascula>(`${this.apiUrl}/${id}`, data);
  }

  getSuggestions(field: string, query: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/suggestions`, {
      params: { field, query }
    });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
