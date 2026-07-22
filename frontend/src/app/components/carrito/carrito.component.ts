import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CarritoService, CarritoItem } from '../../core/services/carrito.service';
import { AuthService } from '../../core/services/auth.service';
import { InventarioService } from '../../core/services/inventario.service';
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
                <th>Stock</th>
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
                    <span class="stock-badge" [class.sin-stock]="getStock(item.producto.id!) === 0"
                          [class.stock-bajo]="getStock(item.producto.id!) > 0 && getStock(item.producto.id!) <= 3">
                      {{ getStock(item.producto.id!) }}
                    </span>
                  </td>
                  <td>
                    <div class="cart-item-qty" style="margin-top:0;">
                      <button (click)="cambiarCantidad(item.producto.id!, -1)">-</button>
                      <span>{{ item.cantidad }}</span>
                      <button (click)="aumentarCantidad(item)">+</button>
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
  `,
  styles: [`
    .stock-badge {
      display: inline-block; padding: 0.2rem 0.6rem; border-radius: 4px;
      font-size: 0.75rem; font-weight: 600; background: #d1e7dd; color: #0f5132;
    }
    .stock-badge.stock-bajo { background: #fff3cd; color: #664d03; }
    .stock-badge.sin-stock { background: #f8d7da; color: #842029; }
  `]
})
export class CarritoComponent implements OnInit {
  items: CarritoItem[] = [];
  stockMap: Map<number, number> = new Map();

  constructor(
    public carritoService: CarritoService,
    private authService: AuthService,
    private inventarioService: InventarioService,
    private toastService: ToastService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carritoService.carrito$.subscribe(items => { this.items = items; this.cdr.detectChanges(); });
    this.cargarStock();
  }

  cargarStock(): void {
    this.inventarioService.obtenerStockPorProducto().subscribe({
      next: (data) => { this.stockMap = new Map(Object.entries(data).map(([k, v]) => [Number(k), v])); this.cdr.detectChanges(); }
    });
  }

  getStock(productoId: number): number {
    return this.stockMap.get(productoId) ?? 0;
  }

  cambiarCantidad(id: number, delta: number): void {
    this.carritoService.cambiarCantidad(id, delta);
  }

  aumentarCantidad(item: CarritoItem): void {
    const stock = this.getStock(item.producto.id!);
    if (item.cantidad >= stock) {
      this.toastService.show('La cantidad que solicita supera el stock actual', 'error');
      return;
    }
    this.carritoService.cambiarCantidad(item.producto.id!, 1);
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
