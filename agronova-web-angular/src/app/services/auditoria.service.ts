import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Auditoria {
  Id?: string;
  UsuarioId?: string;
  Accion?: string;
  Modulo?: string;
  RegistroId?: string;
  DatosAntes?: any;
  DatosDespues?: any;
  IpAddress?: string;
  FechaHora?: string;
}

@Injectable({ providedIn: 'root' })
export class AuditoriaService {
  private apiUrl = environment.apiUrl + '/auditorias';
  constructor(private http: HttpClient) {}
  getAll(): Observable<Auditoria[]> { return this.http.get<Auditoria[]>(this.apiUrl); }
  getById(id: string): Observable<Auditoria> { return this.http.get<Auditoria>(`${this.apiUrl}/${id}`); }
}
