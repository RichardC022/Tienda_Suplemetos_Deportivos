import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../../models';

/*
 * Servicio para interactuar con el catálogo de productos del backend.
 * Proporciona métodos para CRUD y búsquedas de productos.
 */
@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private readonly API_URL = '/api/productos';

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.API_URL);
  }

  obtenerPorId(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.API_URL}/${id}`);
  }

  /*
   * Filtra productos por categoría.
   * Se usa en la página de catálogo para mostrar solo productos
   * de una categoría específica (ej: Proteínas, Creatinas).
   */
  obtenerPorCategoria(categoriaId: number): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.API_URL}/categoria/${categoriaId}`);
  }

  crear(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.API_URL, producto);
  }

  actualizar(id: number, producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.API_URL}/${id}`, producto);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}
