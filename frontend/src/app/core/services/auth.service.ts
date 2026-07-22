import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Usuario } from '../../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = '/api/auth';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  private readonly TEMP_TOKEN_KEY = 'auth_temp_token';
  private readonly TEMP_USER_KEY = 'auth_temp_user';

  private usuarioActual = new BehaviorSubject<Usuario | null>(this.getUsuarioStorage());
  usuario$ = this.usuarioActual.asObservable();

  constructor(private http: HttpClient) {}

  login(correo: string, clave: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/login`, { correo, clave });
  }

  loginPaso1(correo: string, clave: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/login`, { correo, clave }).pipe(
      tap((res: any) => {
        if (res.tempToken) {
          localStorage.setItem(this.TEMP_TOKEN_KEY, res.tempToken);
          localStorage.setItem(this.TEMP_USER_KEY, JSON.stringify({
            id: res.usuarioId,
            correo: res.correo,
            nombre: res.nombre,
            rol: { nombre: res.rol }
          }));
        }
      })
    );
  }

  verifyPin(pin: string): Observable<any> {
    const tempToken = localStorage.getItem(this.TEMP_TOKEN_KEY);
    return this.http.post<any>(`${this.API_URL}/verify-pin`, { tempToken, pin }).pipe(
      tap(() => {
        const tempUser = localStorage.getItem(this.TEMP_USER_KEY);
        if (tempUser) {
          const user = JSON.parse(tempUser);
          localStorage.setItem(this.TOKEN_KEY, String(user.id));
          localStorage.setItem(this.USER_KEY, tempUser);
          this.usuarioActual.next(user);
        }
        localStorage.removeItem(this.TEMP_TOKEN_KEY);
        localStorage.removeItem(this.TEMP_USER_KEY);
      })
    );
  }

  isTempAuthenticated(): boolean {
    return localStorage.getItem(this.TEMP_TOKEN_KEY) !== null;
  }

  getTempUserInfo(): { correo: string; nombre: string } | null {
    const raw = localStorage.getItem(this.TEMP_USER_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      return { correo: parsed.correo, nombre: parsed.nombre };
    } catch { return null; }
  }

  clearTempAuth(): void {
    localStorage.removeItem(this.TEMP_TOKEN_KEY);
    localStorage.removeItem(this.TEMP_USER_KEY);
  }

  forgotPin(correo: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/forgot-pin`, { correo });
  }

  verifyRecoveryCode(correo: string, codigo: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/verify-recovery-code`, { correo, codigo });
  }

  resetPin(recoveryToken: string, nuevoPin: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/reset-pin`, { recoveryToken, nuevoPin });
  }

  registro(usuario: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/registro`, usuario);
  }

  verificarDocumento(documento: string): Observable<{ existe: boolean }> {
    return this.http.get<{ existe: boolean }>(`${this.API_URL}/check-documento`, { params: { documento } });
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.TEMP_TOKEN_KEY);
    localStorage.removeItem(this.TEMP_USER_KEY);
    this.usuarioActual.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUsuarioStorage(): Usuario | null {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  isAdmin(): boolean {
    const user = this.getUsuarioStorage();
    return user?.rol?.nombre === 'ADMIN';
  }
}
