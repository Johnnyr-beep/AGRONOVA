import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Piel {
  Id?: string;
  CanalId?: string;
  FechaRegistro?: string;
  PesoKg?: number;
  Estado?: string;
  Destino?: string;
  PrecioKg?: number;
  ValorTotal?: number;
  Observaciones?: string;
}

@Injectable({ providedIn: 'root' })
export class PielService {
  private apiUrl = environment.apiUrl + '/pieles';
  constructor(private http: HttpClient) {}
  getAll(): Observable<Piel[]> { return this.http.get<Piel[]>(this.apiUrl); }
  getById(id: string): Observable<Piel> { return this.http.get<Piel>(`${this.apiUrl}/${id}`); }
  create(data: Partial<Piel>): Observable<Piel> { return this.http.post<Piel>(this.apiUrl, data); }
  update(id: string, data: Partial<Piel>): Observable<Piel> { return this.http.put<Piel>(`${this.apiUrl}/${id}`, data); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.apiUrl}/${id}`); }
}
