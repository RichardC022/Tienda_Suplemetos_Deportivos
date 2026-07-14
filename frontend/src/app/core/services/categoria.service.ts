import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../../models';

/*
 * Servicio para gestionar las categorías de productos.
 * Se usa para llenar los selectores de categoría en el catálogo
 * y en el formulario de productos del admin.
 */
@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private readonly API_URL = '/api/categorias';

  constructor(private http: HttpClient) {}

  listarTodas(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.API_URL);
  }

  obtenerPorId(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.API_URL}/${id}`);
  }

  crear(categoria: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(this.API_URL, categoria);
  }

  actualizar(id: number, categoria: Categoria): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.API_URL}/${id}`, categoria);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}
