import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <a routerLink="/catalogo" class="auth-back" title="Volver al inicio">&#8592;</a>
      <button class="auth-toggle" (click)="themeService.toggleTheme()" title="Cambiar tema">
        {{ themeService.isDark() ? '&#127769;' : '&#9728;&#65039;' }}
      </button>
      <div class="auth-card">
        <!-- PASO 1: Credenciales -->
        @if (paso === 1) {
          <div class="auth-header">
            <img src="Logo/imagen_001.png" alt="Logo">
            <h2>Iniciar Sesion</h2>
            <p>Ingresa tus credenciales para acceder</p>
          </div>

          @if (error) {
            <div class="alert alert-danger">{{ error }}</div>
          }

          <form (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label for="correo">Correo electronico</label>
              <input type="email" id="correo" class="form-control"
                     [(ngModel)]="correo" name="correo"
                     placeholder="tu&#64;email.com" required>
            </div>

            <div class="form-group">
              <label for="clave">Contrasena</label>
              <input type="password" id="clave" class="form-control"
                     [(ngModel)]="clave" name="clave"
                     placeholder="Tu contrasena" required>
            </div>

            <button type="submit" class="btn-primary" [disabled]="cargando">
              @if (cargando) {
                <span class="spinner-border spinner-border-sm me-2"></span>
              }
              Continuar
            </button>
          </form>

          <div class="auth-footer">
            No tienes cuenta? <a routerLink="/registro">Registrate aqui</a>
          </div>
        }

        <!-- PASO 2: PIN -->
        @if (paso === 2) {
          <div class="auth-header">
            <img src="Logo/imagen_001.png" alt="Logo">
            <h2>Verificar PIN</h2>
            <p>Ingresa tu PIN de 4 digitos para completar el acceso</p>
          </div>

          @if (error) {
            <div class="alert alert-danger">{{ error }}</div>
          }

          <form (ngSubmit)="onVerifyPin()">
            <div class="form-group">
              <label for="pin">PIN de 4 digitos</label>
              <input type="password" id="pin" class="form-control"
                     [(ngModel)]="pin" name="pin"
                     placeholder="****" maxlength="4"
                     autocomplete="off" required
                     inputmode="numeric" pattern="[0-9]*">
            </div>

            <button type="submit" class="btn-primary" [disabled]="cargando">
              @if (cargando) {
                <span class="spinner-border spinner-border-sm me-2"></span>
              }
              Verificar PIN
            </button>
          </form>

          <div class="auth-footer">
            <a href="#" (click)="onVolverCredenciales($event)">Volver a credenciales</a>
            <br>
            <a href="#" (click)="onForgotPin($event)">Olvide mi PIN</a>
          </div>
        }

        <!-- PASO 3: Codigo de recuperacion -->
        @if (paso === 3) {
          <div class="auth-header">
            <img src="Logo/imagen_001.png" alt="Logo">
            <h2>Recuperar PIN</h2>
            <p>Ingresa el codigo de 6 digitos enviado a tu correo</p>
          </div>

          @if (error) {
            <div class="alert alert-danger">{{ error }}</div>
          }
          @if (exito) {
            <div class="alert alert-success">{{ exito }}</div>
          }

          <form (ngSubmit)="onVerifyCode()">
            <div class="form-group">
              <label for="correoRecuperacion">Correo electronico</label>
              <input type="email" id="correoRecuperacion" class="form-control"
                     [(ngModel)]="correoRecuperacion" name="correoRecuperacion"
                     placeholder="tu&#64;email.com" required>
            </div>

            @if (codigoEnviado) {
              <div class="form-group">
                <label for="codigoRecuperacion">Codigo de verificacion</label>
                <input type="text" id="codigoRecuperacion" class="form-control"
                       [(ngModel)]="codigoRecuperacion" name="codigoRecuperacion"
                       placeholder="000000" maxlength="6"
                       autocomplete="off" required
                       inputmode="numeric" pattern="[0-9]*">
              </div>
            }

            @if (!codigoEnviado) {
              <button type="submit" class="btn-primary" [disabled]="cargando">
                @if (cargando) {
                  <span class="spinner-border spinner-border-sm me-2"></span>
                }
                Enviar Codigo
              </button>
            } @else {
              <button type="submit" class="btn-primary" [disabled]="cargando">
                @if (cargando) {
                  <span class="spinner-border spinner-border-sm me-2"></span>
                }
                Verificar Codigo
              </button>
            }
          </form>

          <div class="auth-footer">
            <a href="#" (click)="onVolverLogin($event)">Volver al login</a>
          </div>
        }

        <!-- PASO 4: Nuevo PIN -->
        @if (paso === 4) {
          <div class="auth-header">
            <img src="Logo/imagen_001.png" alt="Logo">
            <h2>Crear Nuevo PIN</h2>
            <p>Ingresa tu nuevo PIN de 4 digitos</p>
          </div>

          @if (error) {
            <div class="alert alert-danger">{{ error }}</div>
          }

          <form (ngSubmit)="onResetPin()">
            <div class="form-group">
              <label for="nuevoPin">Nuevo PIN</label>
              <input type="password" id="nuevoPin" class="form-control"
                     [(ngModel)]="nuevoPin" name="nuevoPin"
                     placeholder="****" maxlength="4"
                     autocomplete="off" required
                     inputmode="numeric" pattern="[0-9]*">
            </div>

            <div class="form-group">
              <label for="confirmarPin">Confirmar PIN</label>
              <input type="password" id="confirmarPin" class="form-control"
                     [(ngModel)]="confirmarPin" name="confirmarPin"
                     placeholder="****" maxlength="4"
                     autocomplete="off" required
                     inputmode="numeric" pattern="[0-9]*">
            </div>

            <button type="submit" class="btn-primary" [disabled]="cargando">
              @if (cargando) {
                <span class="spinner-border spinner-border-sm me-2"></span>
              }
              Guardar Nuevo PIN
            </button>
          </form>

          <div class="auth-footer">
            <a href="#" (click)="onVolverLogin($event)">Volver al login</a>
          </div>
        }
      </div>
    </div>
  `
})
export class LoginComponent implements OnInit {
  paso: 1 | 2 | 3 | 4 = 1;

  correo = '';
  clave = '';
  pin = '';

  correoRecuperacion = '';
  codigoRecuperacion = '';
  codigoEnviado = false;
  recoveryToken = '';

  nuevoPin = '';
  confirmarPin = '';

  error = '';
  exito = '';
  cargando = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/catalogo']);
    } else if (this.authService.isTempAuthenticated()) {
      this.paso = 2;
      const info = this.authService.getTempUserInfo();
      if (info) this.correo = info.correo;
    }
  }

  onSubmit(): void {
    this.cargando = true;
    this.error = '';

    if (!this.correo.trim()) {
      this.cargando = false;
      this.error = 'El correo es obligatorio';
      return;
    }
    if (!this.clave.trim()) {
      this.cargando = false;
      this.error = 'La contrasena es obligatoria';
      return;
    }

    this.authService.loginPaso1(this.correo, this.clave).subscribe({
      next: (res: any) => {
        this.cargando = false;
        if (res.tempToken) {
          this.paso = 2;
        } else {
          this.error = 'Respuesta inesperada del servidor';
        }
      },
      error: (err) => {
        this.cargando = false;
        this.error = err.error?.error || 'Credenciales incorrectas';
      }
    });
  }

  onVerifyPin(): void {
    this.cargando = true;
    this.error = '';

    if (!this.pin.trim() || this.pin.length !== 4) {
      this.cargando = false;
      this.error = 'El PIN debe tener exactamente 4 digitos';
      return;
    }

    this.authService.verifyPin(this.pin).subscribe({
      next: () => {
        this.cargando = false;
        this.toastService.show('Bienvenido al sistema', 'exito');
        if (this.authService.isAdmin()) {
          this.router.navigate(['/admin/productos']);
        } else {
          this.router.navigate(['/catalogo']);
        }
      },
      error: (err) => {
        this.cargando = false;
        this.error = err.error?.error || 'PIN incorrecto';
        this.pin = '';
      }
    });
  }

  onForgotPin(e: Event): void {
    e.preventDefault();
    this.paso = 3;
    this.correoRecuperacion = this.correo;
    this.error = '';
    this.exito = '';
  }

  onVerifyCode(): void {
    this.cargando = true;
    this.error = '';

    if (!this.codigoEnviado) {
      if (!this.correoRecuperacion.trim()) {
        this.cargando = false;
        this.error = 'El correo es obligatorio';
        return;
      }

      this.authService.forgotPin(this.correoRecuperacion).subscribe({
        next: () => {
          this.cargando = false;
          this.codigoEnviado = true;
          this.exito = 'Codigo enviado. Revisa tu correo electronico.';
        },
        error: (err) => {
          this.cargando = false;
          this.error = err.error?.error || 'Error al enviar el codigo';
        }
      });
    } else {
      if (!this.codigoRecuperacion.trim() || this.codigoRecuperacion.length !== 6) {
        this.cargando = false;
        this.error = 'El codigo debe tener exactamente 6 digitos';
        return;
      }

      this.authService.verifyRecoveryCode(this.correoRecuperacion, this.codigoRecuperacion).subscribe({
        next: (res: any) => {
          this.cargando = false;
          this.recoveryToken = res.recoveryToken;
          this.paso = 4;
          this.error = '';
          this.exito = '';
        },
        error: (err) => {
          this.cargando = false;
          this.error = err.error?.error || 'Codigo incorrecto o expirado';
        }
      });
    }
  }

  onResetPin(): void {
    this.cargando = true;
    this.error = '';

    if (!this.nuevoPin || !this.nuevoPin.match(/^\d{4}$/)) {
      this.cargando = false;
      this.error = 'El PIN debe ser exactamente 4 digitos numericos';
      return;
    }
    if (this.nuevoPin !== this.confirmarPin) {
      this.cargando = false;
      this.error = 'Los PINes no coinciden';
      return;
    }

    this.authService.resetPin(this.recoveryToken, this.nuevoPin).subscribe({
      next: (res: any) => {
        this.cargando = false;
        this.toastService.show(res.mensaje || 'PIN restablecido correctamente', 'exito');
        this.authService.clearTempAuth();
        this.paso = 1;
        this.pin = '';
        this.nuevoPin = '';
        this.confirmarPin = '';
      },
      error: (err) => {
        this.cargando = false;
        this.error = err.error?.error || 'Error al restablecer el PIN';
      }
    });
  }

  onVolverCredenciales(e: Event): void {
    e.preventDefault();
    this.authService.clearTempAuth();
    this.paso = 1;
    this.pin = '';
    this.error = '';
  }

  onVolverLogin(e: Event): void {
    e.preventDefault();
    this.authService.clearTempAuth();
    this.paso = 1;
    this.correo = '';
    this.clave = '';
    this.pin = '';
    this.correoRecuperacion = '';
    this.codigoRecuperacion = '';
    this.codigoEnviado = false;
    this.recoveryToken = '';
    this.error = '';
    this.exito = '';
  }
}
