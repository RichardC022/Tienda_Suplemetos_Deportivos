import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="admin-layout">
      <aside class="admin-sidebar">
        <h4>Panel</h4>
        <a routerLink="/admin/productos" routerLinkActive="active">
          <span>&#128230;</span> <span>Productos</span>
        </a>
        <a routerLink="/admin/categorias" routerLinkActive="active">
          <span>&#127991;</span> <span>Categorias</span>
        </a>
        <a routerLink="/admin/inventario" routerLinkActive="active">
          <span>&#128203;</span> <span>Inventario</span>
        </a>
        <a routerLink="/admin/ventas/manuales" routerLinkActive="active">
          <span>&#128176;</span> <span>Ventas Manuales</span>
        </a>
        <a routerLink="/admin/ventas/online" routerLinkActive="active">
          <span>&#128722;</span> <span>Ventas en Linea</span>
        </a>
        <a routerLink="/admin/ventas/manual" routerLinkActive="active">
          <span>&#10133;</span> <span>Nueva Venta Manual</span>
        </a>
        <a routerLink="/admin/metodos-pago" routerLinkActive="active">
          <span>&#128179;</span> <span>Metodos Pago</span>
        </a>
        <a routerLink="/admin/usuarios" routerLinkActive="active">
          <span>&#128100;</span> <span>Usuarios</span>
        </a>
        <a routerLink="/admin/envios" routerLinkActive="active">
          <span>&#128666;</span> <span>Envios</span>
        </a>
      </aside>
      <main class="admin-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AdminLayoutComponent {
  constructor(public authService: AuthService) {}
}
