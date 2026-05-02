import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Proveedor {
  Id?: string;
  Nombre: string;
  RazonSocial?: string;
  NIT?: string;
  Telefono?: string;
  Email?: string;
  Direccion?: string;
  Ciudad?: string;
  Contacto?: string;
  Observaciones?: string;
  Activo?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ProveedorService {
  private apiUrl = environment.apiUrl + '/proveedores';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(this.apiUrl);
  }

  getById(id: string): Observable<Proveedor> {
    return this.http.get<Proveedor>(`${this.apiUrl}/${id}`);
  }

  create(data: Partial<Proveedor>): Observable<Proveedor> {
    return this.http.post<Proveedor>(this.apiUrl, data);
  }

  update(id: string, data: Partial<Proveedor>): Observable<Proveedor> {
    return this.http.put<Proveedor>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getSuggestions(field: string, query: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/suggestions`, {
      params: { field, query }
    });
  }
}
