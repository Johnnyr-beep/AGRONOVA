import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PesoEnPie {
  id?: string;
  Consecutivo?: string;
  Fecha: string;
  GuiaMovilizacion: string;
  ProveedorNombre: string;
  ClienteNombre: string;
  TipoAnimal: 'MACHO' | 'HEMBRA' | 'BUFALO' | 'BUFALA';
  UbicacionCorral: string;
  PesoKg: number;
  Observaciones?: string;
  Estado?: string;
  created_at?: string;
}

export interface PesoEnPieStats {
  totalAnimales: number;
  pesoTotal: number;
  guiasAbiertas: number;
}

@Injectable({
  providedIn: 'root'
})
export class PesoEnPieService {
  private apiUrl = environment.apiUrl + '/peso-en-pie';

  constructor(private http: HttpClient) {}

  getAll(): Observable<PesoEnPie[]> {
    return this.http.get<PesoEnPie[]>(this.apiUrl);
  }

  getById(id: string): Observable<PesoEnPie> {
    return this.http.get<PesoEnPie>(`${this.apiUrl}/${id}`);
  }

  create(data: Partial<PesoEnPie>): Observable<PesoEnPie> {
    return this.http.post<PesoEnPie>(this.apiUrl, data);
  }

  update(id: string, data: Partial<PesoEnPie>): Observable<PesoEnPie> {
    return this.http.put<PesoEnPie>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getSuggestions(field: string, query: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/suggestions`, {
      params: { field, query }
    });
  }

  getStats(): Observable<PesoEnPieStats> {
    return this.http.get<PesoEnPieStats>(`${this.apiUrl}/stats`);
  }
}
