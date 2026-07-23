import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models';

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

  subirImagen(id: number, archivo: File): Observable<{ imagenUrl: string }> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    return this.http.post<{ imagenUrl: string }>(`${this.API_URL}/${id}/imagen`, formData);
  }
}
