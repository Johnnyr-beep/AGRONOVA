import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Traslado {
  Id?: string;
  NumeroTraslado: string;
  FechaTraslado?: string;
  CanalId?: string;
  CavaOrigenId?: string;
  CavaDestinoId?: string;
  Origen?: string;
  Destino?: string;
  Estado?: string;
  Observaciones?: string;
}

@Injectable({ providedIn: 'root' })
export class TrasladoService {
  private apiUrl = environment.apiUrl + '/traslados';
  constructor(private http: HttpClient) {}
  getAll(): Observable<Traslado[]> { return this.http.get<Traslado[]>(this.apiUrl); }
  getById(id: string): Observable<Traslado> { return this.http.get<Traslado>(`${this.apiUrl}/${id}`); }
  create(data: Partial<Traslado>): Observable<Traslado> { return this.http.post<Traslado>(this.apiUrl, data); }
  update(id: string, data: Partial<Traslado>): Observable<Traslado> { return this.http.put<Traslado>(`${this.apiUrl}/${id}`, data); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.apiUrl}/${id}`); }
  ejecutar(id: string): Observable<any> { return this.http.post(`${this.apiUrl}/${id}/ejecutar`, {}); }
}
