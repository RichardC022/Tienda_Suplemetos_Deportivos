import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Compra } from '../../models';

@Injectable({ providedIn: 'root' })
export class CompraService {
  private readonly API_URL = '/api/compras';

  constructor(private http: HttpClient) {}

  listarTodas(): Observable<Compra[]> {
    return this.http.get<Compra[]>(this.API_URL);
  }

  obtenerPorId(id: number): Observable<Compra> {
    return this.http.get<Compra>(`${this.API_URL}/${id}`);
  }

  obtenerHistorialPorPersona(personaId: number): Observable<Compra[]> {
    return this.http.get<Compra[]>(`${this.API_URL}/persona/${personaId}`);
  }

  registrarCompra(compra: Compra): Observable<Compra> {
    return this.http.post<Compra>(this.API_URL, compra);
  }

  actualizar(id: number, compra: Compra): Observable<Compra> {
    return this.http.put<Compra>(`${this.API_URL}/${id}`, compra);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}
