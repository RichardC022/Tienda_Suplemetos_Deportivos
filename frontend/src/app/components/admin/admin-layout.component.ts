import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';

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
        <a routerLink="/admin/compras" routerLinkActive="active">
          <span>&#128722;</span> <span>Compras</span>
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
