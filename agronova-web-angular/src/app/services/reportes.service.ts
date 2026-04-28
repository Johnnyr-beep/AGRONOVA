import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private apiUrl = environment.apiUrl + '/reportes';

  constructor(private http: HttpClient) { }

  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard`);
  }

  getFaenaReport(params: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/faena`, { params });
  }

  getDesposteReport(params: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/desposte`, { params });
  }
}
