import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Usuario } from '../../models';

/*
 * Servicio de autenticación.
 * Maneja el login, registro, almacenamiento del token JWT y
 * el estado de autenticación del usuario en la aplicación.
 *
 * Se usa BehaviorSubject para que los componentes puedan suscribirse
 * al estado de autenticación y reaccionar a cambios (login/logout)
 * de forma reactiva.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = '/api/auth';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  /*
   * BehaviorSubject que mantiene el estado actual del usuario autenticado.
   * Los componentes se suscriben a este observable para saber si hay
   * un usuario logueado y mostrar u ocultar elementos de la UI.
   */
  private usuarioActual = new BehaviorSubject<Usuario | null>(this.getUsuarioStorage());

  /*
   * Observable público para que los componentes se suscriban al estado
   * de autenticación. Se expone como Observable (sin write) para que
   * solo el servicio pueda modificar el valor.
   */
  usuario$ = this.usuarioActual.asObservable();

  constructor(private http: HttpClient) {}

  login(correo: string, clave: string): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.API_URL}/login`, { correo, clave })
      .pipe(
        tap(usuario => {
          /*
           * Se guarda el token y el usuario en localStorage para mantener
           * la sesión entre recargas de página. Se usa localStorage porque
           * la sesión debe persistir incluso si el usuario cierra el navegador.
           */
          /*
           * Se guarda solo el ID del usuario como token (simulado).
           * El interceptor agrega "Bearer " automáticamente, por lo que
           * NO se debe incluir "Bearer " aquí para evitar "Bearer Bearer X".
           * Cuando se implemente JWT real, aquí se guardaría el token JWT.
           */
          localStorage.setItem(this.TOKEN_KEY, String(usuario.id));
          localStorage.setItem(this.USER_KEY, JSON.stringify(usuario));
          this.usuarioActual.next(usuario);
        })
      );
  }

  registro(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.API_URL}/registro`, usuario);
  }

  verificarDocumento(documento: string): Observable<{ existe: boolean }> {
    return this.http.get<{ existe: boolean }>(`${this.API_URL}/check-documento`, { params: { documento } });
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.usuarioActual.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUsuarioStorage(): Usuario | null {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  /*
   * Verifica si el usuario está autenticado.
   * Se usa en los guards para proteger rutas.
   */
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  /*
   * Verifica si el usuario tiene rol de administrador.
   * Se usa en el guard de rutas admin para denegar acceso
   * a usuarios con rol CLIENTE.
   */
  isAdmin(): boolean {
    const user = this.getUsuarioStorage();
    return user?.rol?.nombre === 'ADMIN';
  }
}
