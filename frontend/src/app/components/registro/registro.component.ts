import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { ThemeService } from '../../core/services/theme.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <a routerLink="/catalogo" class="auth-back" title="Volver al inicio">&#8592;</a>
      <button class="auth-toggle" (click)="themeService.toggleTheme()" title="Cambiar tema">
        {{ themeService.isDark() ? '&#127769;' : '&#9728;&#65039;' }}
      </button>
      <div class="auth-card">
        <div class="auth-header">
          <img src="Logo/imagen_001.png" alt="Logo">
          <h2>Crear Cuenta</h2>
          <p>Registrate para empezar a comprar</p>
        </div>

        @if (error) {
          <div class="alert alert-danger">{{ error }}</div>
        }
        @if (exito) {
          <div class="alert alert-success">{{ exito }}</div>
        }

        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="nombre">Nombre</label>
            <input type="text" id="nombre" class="form-control"
                   [(ngModel)]="nombre" name="nombre"
                   placeholder="Tu nombre" required>
          </div>

          <div class="form-group">
            <label for="apellido">Apellido</label>
            <input type="text" id="apellido" class="form-control"
                   [(ngModel)]="apellido" name="apellido"
                   placeholder="Tu apellido" required>
          </div>

          <div class="form-group">
            <label for="telefono">Telefono <span style="color:var(--danger)">*</span></label>
            <input type="tel" id="telefono" class="form-control"
                   [(ngModel)]="telefono" name="telefono"
                   placeholder="0991234567" required
                   maxlength="10"
                   (input)="validarTelefono()">
            @if (telefonoError) {
              <small style="color:var(--danger); font-size:0.8rem;">
                El telefono debe tener exactamente 10 numeros
              </small>
            }
          </div>

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
                   placeholder="Minimo 4 caracteres" required>
          </div>

          <button type="submit" class="btn-primary" [disabled]="cargando">
            @if (cargando) {
              <span class="spinner-border spinner-border-sm me-2"></span>
            }
            Crear Cuenta
          </button>
        </form>

        <div class="auth-footer">
          Ya tienes cuenta? <a routerLink="/login">Inicia sesion</a>
        </div>
      </div>
    </div>
  `
})
export class RegistroComponent implements OnInit {
  nombre = '';
  apellido = '';
  telefono = '';
  correo = '';
  clave = '';
  error = '';
  exito = '';
  cargando = false;
  telefonoError = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
    private http: HttpClient,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/catalogo']);
    }
  }

  validarTelefono(): void {
    this.telefono = this.telefono.replace(/[^0-9]/g, '');
    this.telefonoError = this.telefono.length > 0 && this.telefono.length !== 10;
  }

  onSubmit(): void {
    this.error = '';

    if (!this.nombre.trim() || !this.apellido.trim() || !this.correo.trim() || !this.clave) {
      this.toastService.show('Todos los campos son obligatorios', 'error');
      return;
    }

    if (!this.telefono || this.telefono.length !== 10 || !/^\d{10}$/.test(this.telefono)) {
      this.telefonoError = true;
      return;
    }

    if (this.clave.length < 4) {
      this.toastService.show('La contrasena debe tener minimo 4 caracteres', 'error');
      return;
    }

    this.cargando = true;

    this.http.get<any>(`/api/auth/check-email?correo=${encodeURIComponent(this.correo)}`).subscribe({
      next: (checkData) => {
        if (checkData.existe) {
          this.cargando = false;
          this.toastService.show('Este correo ya esta registrado', 'error');
          return;
        }
        this.registrar();
      },
      error: () => {
        this.registrar();
      }
    });
  }

  private registrar(): void {
    const usuario = {
      correo: this.correo,
      clave: this.clave,
      persona: {
        nombre: this.nombre,
        apellido: this.apellido,
        telefono: this.telefono
      }
    };

    this.authService.registro(usuario).subscribe({
      next: () => {
        this.cargando = false;
        this.toastService.show('Cuenta creada correctamente', 'exito');
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: () => {
        this.cargando = false;
        this.error = 'Error al registrar. Verifica los datos e intenta de nuevo.';
      }
    });
  }
}
