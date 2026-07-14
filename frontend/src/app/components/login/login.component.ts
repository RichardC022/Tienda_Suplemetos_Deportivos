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
            Ingresar
          </button>
        </form>

        <div class="auth-footer">
          No tienes cuenta? <a routerLink="/registro">Registrate aqui</a>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent implements OnInit {
  correo = '';
  clave = '';
  error = '';
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
    }
  }

  onSubmit(): void {
    this.cargando = true;
    this.error = '';

    this.authService.login(this.correo, this.clave).subscribe({
      next: (usuario) => {
        this.cargando = false;
        this.toastService.show('Bienvenido ' + (usuario.persona?.nombre || usuario.correo), 'exito');
        if (this.authService.isAdmin()) {
          this.router.navigate(['/admin/productos']);
        } else {
          this.router.navigate(['/catalogo']);
        }
      },
      error: () => {
        this.cargando = false;
        this.error = 'Credenciales incorrectas. Por favor, intenta de nuevo.';
      }
    });
  }
}
