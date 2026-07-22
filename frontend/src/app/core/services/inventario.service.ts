import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inventario } from '../../models';

/*
 * Servicio para gestionar el inventario de productos.
 * Permite consultar stock y gestionar entradas/salidas de mercadería.
 */
@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private readonly API_URL = '/api/inventario';

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Inventario[]> {
    return this.http.get<Inventario[]>(this.API_URL);
  }

  obtenerPorId(id: number): Observable<Inventario> {
    return this.http.get<Inventario>(`${this.API_URL}/${id}`);
  }

  obtenerPorProducto(productoId: number): Observable<Inventario> {
    return this.http.get<Inventario>(`${this.API_URL}/producto/${productoId}`);
  }

  obtenerStockPorProducto(): Observable<Record<string, number>> {
    return this.http.get<Record<string, number>>(`${this.API_URL}/stock`);
  }

  guardar(inventario: Inventario): Observable<Inventario> {
    return this.http.post<Inventario>(this.API_URL, inventario);
  }

  actualizar(id: number, inventario: Inventario): Observable<Inventario> {
    return this.http.put<Inventario>(`${this.API_URL}/${id}`, inventario);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}
