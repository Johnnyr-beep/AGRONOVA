import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Cava {
  Id?: string;
  Nombre: string;
  Numero?: number;
  CapacidadCanales?: number;
  TemperaturaObjetivo?: number;
  TemperaturaActual?: number;
  Estado?: string;
  Descripcion?: string;
  Activo?: boolean;
}

@Injectable({ providedIn: 'root' })
export class CavaService {
  private apiUrl = environment.apiUrl + '/cavas';
  constructor(private http: HttpClient) {}
  getAll(): Observable<Cava[]> { return this.http.get<Cava[]>(this.apiUrl); }
  getById(id: string): Observable<Cava> { return this.http.get<Cava>(`${this.apiUrl}/${id}`); }
  create(data: Partial<Cava>): Observable<Cava> { return this.http.post<Cava>(this.apiUrl, data); }
  update(id: string, data: Partial<Cava>): Observable<Cava> { return this.http.put<Cava>(`${this.apiUrl}/${id}`, data); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.apiUrl}/${id}`); }
}
