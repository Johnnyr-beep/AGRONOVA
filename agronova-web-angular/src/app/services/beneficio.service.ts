import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AnimalBeneficio {
  Id?: string;
  BeneficioId?: string;
  Turno: number;
  NumeroAnimal?: number;
  TipoAnimal?: string;
  PesoKg?: number;
  Estado?: 'Vivo' | 'Tumbado';
  ObservacionesCamionera?: string;
  Eliminado?: boolean;
}

export interface Beneficio {
  Id?: string;
  NumeroOrden: string;
  Fecha: string;
  ClienteNit?: string;
  ClienteNombre: string;
  ModoImpresion?: 'MANUAL' | 'AUTO';
  Estado?: string;
  Eliminado?: boolean;
  animales?: AnimalBeneficio[];
  TotalAnimales?: number;
  TotalVivos?: number;
  TotalTumbados?: number;
}

@Injectable({ providedIn: 'root' })
export class BeneficioService {
  private apiUrl = environment.apiUrl + '/beneficio';

  constructor(private http: HttpClient) {}

  getAll(fecha?: string): Observable<Beneficio[]> {
    if (fecha) {
      return this.http.get<Beneficio[]>(this.apiUrl, { params: { fecha } });
    }
    return this.http.get<Beneficio[]>(this.apiUrl);
  }

  getById(id: string): Observable<Beneficio> {
    return this.http.get<Beneficio>(`${this.apiUrl}/${id}`);
  }

  create(data: Partial<Beneficio>): Observable<Beneficio> {
    return this.http.post<Beneficio>(this.apiUrl, data);
  }

  update(id: string, data: Partial<Beneficio>): Observable<Beneficio> {
    return this.http.put<Beneficio>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  aprobar(id: string): Observable<Beneficio> {
    return this.http.post<Beneficio>(`${this.apiUrl}/${id}/aprobar`, {});
  }

  rechazar(id: string): Observable<Beneficio> {
    return this.http.post<Beneficio>(`${this.apiUrl}/${id}/rechazar`, {});
  }

  addAnimal(beneficioId: string, data: Partial<AnimalBeneficio>): Observable<AnimalBeneficio> {
    return this.http.post<AnimalBeneficio>(`${this.apiUrl}/${beneficioId}/animales`, data);
  }

  updateAnimal(beneficioId: string, animalId: string, data: Partial<AnimalBeneficio>): Observable<AnimalBeneficio> {
    return this.http.put<AnimalBeneficio>(`${this.apiUrl}/${beneficioId}/animales/${animalId}`, data);
  }

  removeAnimal(beneficioId: string, animalId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${beneficioId}/animales/${animalId}`);
  }
}
