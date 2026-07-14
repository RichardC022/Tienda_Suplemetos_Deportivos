import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CarritoService, CarritoItem } from '../../core/services/carrito.service';
import { ThemeService } from '../../core/services/theme.service';
import { ToastService, Toast } from '../../core/services/toast.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <!-- Toast notifications -->
    <div class="toast-container">
      @for (toast of toasts; track toast.id) {
        <div class="toast-notification" [class.error]="toast.tipo === 'error'">
          {{ toast.mensaje }}
        </div>
      }
    </div>

    <!-- Navbar -->
    <nav class="navbar">
      <div class="navbar-brand">
        <img src="Logo/imagen_001.png" alt="Logo" class="navbar-logo">
        <h1>Sys<span>Supplements</span>Gym</h1>
      </div>
      <div class="navbar-links">
        <a routerLink="/catalogo" routerLinkActive="active">Inicio</a>

        @if (authService.isAdmin()) {
          <a routerLink="/admin/productos" routerLinkActive="active">Admin</a>
        }

        @if (authService.isAuthenticated()) {
          <span class="user-label">{{ getUserName() }}</span>
          <a routerLink="/carrito" class="cart-icon" (click)="toggleSidebar($event)">
            &#128722;
            @if (cantidadItems > 0) {
              <span class="cart-badge">{{ cantidadItems }}</span>
            }
          </a>
          <a href="#" (click)="cerrarSesion($event)">Salir</a>
        } @else {
          <a routerLink="/login" routerLinkActive="active">Iniciar Sesion</a>
        }

        <button class="theme-toggle" (click)="themeService.toggleTheme()" title="Cambiar tema">
          {{ themeService.isDark() ? '&#9728;&#65039;' : '&#127769;' }}
        </button>
      </div>
    </nav>

    <!-- Cart Sidebar Overlay -->
    @if (sidebarOpen) {
      <div class="cart-overlay" (click)="sidebarOpen = false"></div>
    }
    <div class="cart-sidebar" [class.open]="sidebarOpen">
      <div class="cart-header">
        <h3>Mi Carrito</h3>
        <button class="cart-close" (click)="sidebarOpen = false">&times;</button>
      </div>
      <div class="cart-body">
        @if (carritoItems.length === 0) {
          <div class="cart-empty">
            <div class="cart-empty-icon">&#128722;</div>
            <p>Tu carrito esta vacio</p>
          </div>
        }
        @for (item of carritoItems; track item.producto.id) {
          <div class="cart-item">
            <div class="cart-item-img">&#128230;</div>
            <div class="cart-item-info">
              <h4>{{ item.producto.nombre }}</h4>
              <div class="cart-item-price">\${{ (item.producto.precio * item.cantidad).toFixed(2) }}</div>
              <div class="cart-item-qty">
                <button (click)="cambiarCantidad(item.producto.id!, -1)">-</button>
                <span>{{ item.cantidad }}</span>
                <button (click)="cambiarCantidad(item.producto.id!, 1)">+</button>
              </div>
            </div>
            <button class="cart-item-remove" (click)="eliminarItem(item.producto.id!)">&#128465;</button>
          </div>
        }
      </div>
      @if (carritoItems.length > 0) {
        <div class="cart-footer">
          <div class="cart-total">
            <span>Total:</span>
            <span>\${{ carritoService.calcularTotal().toFixed(2) }}</span>
          </div>
          <button class="btn-checkout" (click)="finalizarCompra()">Finalizar Compra</button>
          <button class="btn-clear" (click)="vaciarCarrito()">Vaciar Carrito</button>
        </div>
      }
    </div>

    <!-- Main Content -->
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <p>&copy; 2026 <span>SysSupplementsGym</span>. Todos los derechos reservados.</p>
    </footer>
  `
})
export class LayoutComponent implements OnInit {
  sidebarOpen = false;
  carritoItems: CarritoItem[] = [];
  cantidadItems = 0;
  toasts: Toast[] = [];

  constructor(
    public authService: AuthService,
    public carritoService: CarritoService,
    public themeService: ThemeService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carritoService.carrito$.subscribe(items => {
      this.carritoItems = items;
      this.cantidadItems = this.carritoService.getCantidadItems();
    });
    this.toastService.toasts$.subscribe(toasts => this.toasts = toasts);
  }

  getUserName(): string {
    const user = this.authService.getUsuarioStorage();
    return user?.persona?.nombre || user?.correo || '';
  }

  toggleSidebar(e: Event): void {
    e.preventDefault();
    this.sidebarOpen = !this.sidebarOpen;
  }

  cambiarCantidad(id: number, delta: number): void {
    this.carritoService.cambiarCantidad(id, delta);
  }

  eliminarItem(id: number): void {
    this.carritoService.eliminarProducto(id);
  }

  vaciarCarrito(): void {
    this.carritoService.limpiarCarrito();
  }

  finalizarCompra(): void {
    const usuario = this.authService.getUsuarioStorage();
    if (!usuario) {
      this.sidebarOpen = false;
      this.router.navigate(['/login']);
      return;
    }

    this.carritoService.registrarCompra(usuario.persona!.id!).subscribe({
      next: () => {
        this.carritoService.limpiarCarrito();
        this.sidebarOpen = false;
        this.toastService.show('Compra registrada correctamente', 'exito');
      },
      error: () => {
        this.toastService.show('Error al registrar la compra', 'error');
      }
    });
  }

  cerrarSesion(e: Event): void {
    e.preventDefault();
    this.authService.logout();
    this.router.navigate(['/catalogo']);
  }
}
