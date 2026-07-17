import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CarritoService, CarritoItem } from '../../core/services/carrito.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="section">
      <h2 class="mb-4">Carrito de Compras</h2>

      @if (items.length === 0) {
        <div class="text-center py-5">
          <h4 class="text-muted">Tu carrito esta vacio</h4>
          <a routerLink="/catalogo" class="btn-carrito mt-3" style="display:inline-block;">
            Ir al Catalogo
          </a>
        </div>
      } @else {
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio Unit.</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (item of items; track item.producto.id) {
                <tr>
                  <td>{{ item.producto.nombre }}</td>
                  <td>\${{ item.producto.precio.toFixed(2) }}</td>
                  <td>
                    <div class="cart-item-qty" style="margin-top:0;">
                      <button (click)="cambiarCantidad(item.producto.id!, -1)">-</button>
                      <span>{{ item.cantidad }}</span>
                      <button (click)="cambiarCantidad(item.producto.id!, 1)">+</button>
                    </div>
                  </td>
                  <td>\${{ (item.producto.precio * item.cantidad).toFixed(2) }}</td>
                  <td>
                    <button class="btn-delete" (click)="eliminar(item.producto.id!)">Eliminar</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:2rem;">
          <a routerLink="/catalogo" class="btn-carrito" style="background:var(--gray);">Seguir Comprando</a>
          <div style="display:flex; align-items:center; gap:1.5rem;">
            <h4 style="margin:0; font-weight:700;">Total: <span style="color:var(--primary-dark);">\${{ carritoService.calcularTotal().toFixed(2) }}</span></h4>
            <button class="btn-checkout" style="width:auto; padding:0.8rem 2rem;" (click)="procederCheckout()">
              Finalizar Compra
            </button>
          </div>
        </div>
      }
    </div>
  `
})
export class CarritoComponent implements OnInit {
  items: CarritoItem[] = [];

  constructor(
    public carritoService: CarritoService,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carritoService.carrito$.subscribe(items => { this.items = items; this.cdr.detectChanges(); });
  }

  cambiarCantidad(id: number, delta: number): void {
    this.carritoService.cambiarCantidad(id, delta);
  }

  eliminar(id: number): void {
    this.carritoService.eliminarProducto(id);
  }

  procederCheckout(): void {
    const usuario = this.authService.getUsuarioStorage();
    if (!usuario) {
      this.toastService.show('Necesitas una cuenta para finalizar la compra. Registrese para continuar.', 'error');
      this.router.navigate(['/registro']);
      return;
    }
    this.router.navigate(['/checkout']);
  }
}
