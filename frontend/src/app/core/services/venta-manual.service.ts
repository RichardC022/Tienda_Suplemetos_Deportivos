import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VentaManualRequest, VentaManualResponse, Producto } from '../../models';

@Injectable({ providedIn: 'root' })
export class VentaManualService {
  private readonly API_URL = '/api/ventas-manuales';
  private readonly PRODUCTOS_URL = '/api/productos';

  constructor(private http: HttpClient) {}

  registrarVenta(request: VentaManualRequest): Observable<VentaManualResponse> {
    return this.http.post<VentaManualResponse>(this.API_URL, request);
  }

  buscarProductos(termino: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.PRODUCTOS_URL}/buscar`, { params: { q: termino } });
  }

  listarProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.PRODUCTOS_URL);
  }
}
