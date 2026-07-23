import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DireccionEntrega, EstadoEntrega } from '../models';

/*
 * Servicio para gestionar las direcciones de entrega y envíos.
 * Permite registrar direcciones, consultar por estado y actualizar envíos.
 */
@Injectable({
  providedIn: 'root'
})
export class EnvioService {
  private readonly API_URL = '/api/envios';

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<DireccionEntrega[]> {
    return this.http.get<DireccionEntrega[]>(this.API_URL);
  }

  obtenerPorId(id: number): Observable<DireccionEntrega> {
    return this.http.get<DireccionEntrega>(`${this.API_URL}/${id}`);
  }

  obtenerPorEstado(estado: EstadoEntrega): Observable<DireccionEntrega[]> {
    return this.http.get<DireccionEntrega[]>(`${this.API_URL}/estado/${estado}`);
  }

  guardar(direccion: DireccionEntrega): Observable<DireccionEntrega> {
    return this.http.post<DireccionEntrega>(this.API_URL, direccion);
  }

  actualizar(id: number, direccion: DireccionEntrega): Observable<DireccionEntrega> {
    return this.http.put<DireccionEntrega>(`${this.API_URL}/${id}`, direccion);
  }

  /*
   * Actualiza solo el estado del envío.
   * Se usa cuando el repartidor confirma la entrega o cambia el estado.
   */
  actualizarEstado(id: number, estado: EstadoEntrega): Observable<DireccionEntrega> {
    return this.http.put<DireccionEntrega>(`${this.API_URL}/${id}/estado`, { estado });
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}
