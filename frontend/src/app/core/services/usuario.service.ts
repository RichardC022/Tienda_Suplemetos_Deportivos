import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../../models';

/*
 * Servicio para la administración de usuarios.
 * Se usa en el módulo admin para gestionar los usuarios del sistema.
 * Se separa de AuthService porque AuthService maneja login/registro,
 * mientras que este servicio maneja el CRUD administrativo.
 */
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly API_URL = '/api/usuarios';

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.API_URL);
  }

  obtenerPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.API_URL}/${id}`);
  }

  actualizar(id: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.API_URL}/${id}`, usuario);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}
