import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Beneficio {
  Id?: string;
  CanalId: string;
  BasculaId?: string;
  NumeroFaena: string;
  NumeroCanal: string;
  TipoAnimal: string;
  NumeroIdentificacion: string;
  PesoEntrada: number;
  PesoCanal?: number;
  Estado?: number;
  HoraInicio?: string;
  HoraFin?: string;
  // ... otros campos
}

@Injectable({
  providedIn: 'root'
})
export class BeneficioService {
  private apiUrl = 'http://localhost:8000/api/beneficio';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Beneficio[]> {
    return this.http.get<Beneficio[]>(this.apiUrl);
  }

  getById(id: string): Observable<Beneficio> {
    return this.http.get<Beneficio>(`${this.apiUrl}/${id}`);
  }

  create(data: Beneficio): Observable<Beneficio> {
    return this.http.post<Beneficio>(this.apiUrl, data);
  }

  // Métodos de proceso
  insensibilizar(id: string, metodo: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/insensibilizar`, { metodo });
  }

  desangrar(id: string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/desangrar`, data);
  }

  pelar(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/pelar`, {});
  }

  eviscerar(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/eviscerar`, {});
  }

  dividir(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/dividir`, {});
  }

  aprobar(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/aprobar`, {});
  }

  rechazar(id: string, razonRechazo: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/rechazar`, { razonRechazo });
  }
}
