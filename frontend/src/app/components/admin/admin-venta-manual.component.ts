import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VentaManualService } from '../../services/venta-manual.service';
import { MetodoPagoService, MetodoPagoItem } from '../../services/metodo-pago.service';
import { ToastService } from '../../services/toast.service';
import { Producto, VentaManualItem } from '../../models';

@Component({
  selector: 'app-admin-venta-manual',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="vm-container">
      <div class="vm-header">
        <h2>Venta Manual</h2>
        <p class="vm-subtitle">Registrar venta presencial del cliente</p>
      </div>

      <div class="vm-grid">
        <div class="vm-col-left">

          <div class="vm-card">
            <h3 class="vm-card-title">Productos</h3>
            <div class="vm-search-box">
              <input type="text" class="vm-input vm-search-input"
                     placeholder="Buscar por nombre o codigo..."
                     [(ngModel)]="terminoBusqueda"
                     (input)="onBuscar()"
                     (focus)="mostrarSugerencias = true">
              @if (mostrarSugerencias && sugerencias.length > 0) {
                <div class="vm-sugerencias">
                  @for (p of sugerencias; track p.id) {
                    <div class="vm-sugerencia-item" (click)="seleccionarProducto(p)">
                      <span class="vm-sug-codigo">#{{ p.cod }}</span>
                      <span class="vm-sug-nombre">{{ p.nombre }}</span>
                      <span class="vm-sug-precio">\${{ p.precio?.toFixed(2) }}</span>
                      <span class="vm-sug-stock" [class.sin-stock]="obtenerStock(p.id!) === 0">
                        Stock: {{ obtenerStock(p.id!) }}
                      </span>
                    </div>
                  }
                </div>
              }
            </div>

            @if (items.length > 0) {
              <div class="vm-items-table">
                <table>
                  <thead>
                    <tr>
                      <th>Cod</th>
                      <th>Producto</th>
                      <th>Precio</th>
                      <th>Cant</th>
                      <th>Subtotal</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (item of items; track item.productoId; let i = $index) {
                      <tr>
                        <td class="vm-cod">{{ item.codigoProducto }}</td>
                        <td class="vm-nombre">{{ item.nombreProducto }}</td>
                        <td class="vm-precio">\${{ item.precioUnitario?.toFixed(2) }}</td>
                        <td class="vm-cant-cell">
                          <input type="number" class="vm-cant-input"
                                 [(ngModel)]="item.cantidad"
                                 min="1" [max]="item.stockDisponible || 999"
                                 (input)="recalcular()">
                        </td>
                        <td class="vm-subtotal">\${{ (item.precioUnitario! * item.cantidad).toFixed(2) }}</td>
                        <td>
                          <button class="vm-btn-remove" (click)="eliminarItem(i)" title="Eliminar">&#10005;</button>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            } @else {
              <div class="vm-empty">
                <span>&#128722;</span>
                <p>Busca y agrega productos a la venta</p>
              </div>
            }
          </div>

          <div class="vm-card">
            <h3 class="vm-card-title">Datos del Cliente</h3>
            <div class="vm-form-grid">
              <div class="vm-field">
                <label>Nombre <span class="vm-required">*</span></label>
                <input type="text" class="vm-input" [(ngModel)]="clienteNombre" placeholder="Nombre">
              </div>
              <div class="vm-field">
                <label>Apellido <span class="vm-required">*</span></label>
                <input type="text" class="vm-input" [(ngModel)]="clienteApellido" placeholder="Apellido">
              </div>
              <div class="vm-field">
                <label>Cedula / Documento <span class="vm-required">*</span></label>
                <input type="text" class="vm-input" [(ngModel)]="clienteDocumento"
                       placeholder="1234567890" maxlength="10" (input)="clienteDocumento = clienteDocumento.replace(/[^0-9]/g, '')">
              </div>
              <div class="vm-field">
                <label>Telefono <span class="vm-required">*</span></label>
                <input type="text" class="vm-input" [(ngModel)]="clienteTelefono"
                       placeholder="0991234567" maxlength="10" (input)="clienteTelefono = clienteTelefono.replace(/[^0-9]/g, '')">
              </div>
              <div class="vm-field vm-full">
                <label>Calle Principal <span class="vm-required">*</span></label>
                <input type="text" class="vm-input" [(ngModel)]="direccionCalle" placeholder="Av. Principal">
              </div>
              <div class="vm-field">
                <label>Calle Secundaria</label>
                <input type="text" class="vm-input" [(ngModel)]="direccionSecundaria" placeholder="Calle secundaria">
              </div>
              <div class="vm-field">
                <label>Referencia</label>
                <input type="text" class="vm-input" [(ngModel)]="direccionReferencia" placeholder="Referencia">
              </div>
            </div>
          </div>
        </div>

        <div class="vm-col-right">
          <div class="vm-card vm-summary-card">
            <h3 class="vm-card-title">Resumen de Venta</h3>

            <div class="vm-field" style="margin-bottom:1.2rem">
              <label>Metodo de Pago <span class="vm-required">*</span></label>
              <div class="vm-metodos-grid">
                @for (m of metodosActivos; track m.nombre) {
                  <button class="vm-metodo-btn"
                          [class.vm-metodo-selected]="metodoPago === m.nombre"
                          (click)="seleccionarMetodo(m.nombre)">
                    <span class="vm-metodo-icon">{{ iconoMetodo(m.nombre) }}</span>
                    <span>{{ m.nombre }}</span>
                  </button>
                }
              </div>
            </div>

            @if (metodoPago === 'EFECTIVO') {
              <div class="vm-cash-box">
                <div class="vm-cash-field">
                  <label>Valor Recibido <span class="vm-required">*</span></label>
                  <div class="vm-cash-input-wrap">
                    <span class="vm-cash-prefix">$</span>
                    <input type="number" class="vm-input vm-cash-input"
                           [(ngModel)]="valorRecibido"
                           [min]="totalFinal"
                           placeholder="0.00"
                           (input)="calcularCambio()">
                  </div>
                  @if (valorRecibido > 0 && valorRecibido < totalFinal) {
                    <small class="vm-cash-error">El valor recibido es menor al total</small>
                  }
                </div>
                <div class="vm-cash-field">
                  <label>Cambio</label>
                  <div class="vm-cash-cambio" [class.vm-cambio-ok]="cambio >= 0">
                    \${{ cambio.toFixed(2) }}
                  </div>
                </div>
              </div>
            }

            <div class="vm-desglose">
              <div class="vm-desglose-row">
                <span>Productos ({{ totalItems }})</span>
                <span>\${{ subtotalGeneral.toFixed(2) }}</span>
              </div>
              <div class="vm-desglose-row">
                <span>IVA (15%)</span>
                <span>\${{ impuestos.toFixed(2) }}</span>
              </div>
              <div class="vm-desglose-row vm-total">
                <span>Total a Pagar</span>
                <span>\${{ totalFinal.toFixed(2) }}</span>
              </div>
            </div>

            <button class="vm-btn-confirm"
                    [disabled]="procesando || items.length === 0"
                    (click)="confirmarVenta()">
              @if (procesando) {
                <span class="vm-spinner"></span> Procesando...
              } @else {
                &#10003; Confirmar Venta
              }
            </button>

            @if (resultadoVenta) {
              <div class="vm-resultado">
                <div class="vm-resultado-icon">&#10003;</div>
                <h4>Venta Registrada</h4>
                <p>Factura: <strong>{{ resultadoVenta.numeroFactura }}</strong></p>
                <p>Total: <strong>\${{ resultadoVenta.total?.toFixed(2) }}</strong></p>
                <button class="vm-btn-nueva" (click)="nuevaVenta()">Nueva Venta</button>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .vm-container { max-width: 1200px; margin: 0 auto; padding: 1.5rem; }
    .vm-header { margin-bottom: 1.5rem; }
    .vm-header h2 { margin: 0; font-size: 1.5rem; color: var(--text); }
    .vm-subtitle { margin: 0.25rem 0 0; color: var(--text-secondary); font-size: 0.9rem; }
    .vm-grid { display: grid; grid-template-columns: 1fr 380px; gap: 1.5rem; align-items: start; }
    @media (max-width: 900px) { .vm-grid { grid-template-columns: 1fr; } }

    .vm-card { background: var(--card-bg, #fff); border: 1px solid var(--border, #e0e0e0); border-radius: 10px; padding: 1.2rem; }
    .vm-card-title { margin: 0 0 1rem; font-size: 1.05rem; color: var(--text); border-bottom: 1px solid var(--border, #e0e0e0); padding-bottom: 0.5rem; }
    .vm-summary-card { position: sticky; top: 1rem; }

    .vm-search-box { position: relative; margin-bottom: 1rem; }
    .vm-search-input { width: 100%; padding: 0.65rem 1rem; font-size: 0.95rem; }
    .vm-sugerencias { position: absolute; top: 100%; left: 0; right: 0; background: var(--card-bg, #fff); border: 1px solid var(--border, #e0e0e0); border-radius: 0 0 8px 8px; max-height: 260px; overflow-y: auto; z-index: 100; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .vm-sugerencia-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 1rem; cursor: pointer; transition: background 0.15s; }
    .vm-sugerencia-item:hover { background: var(--hover-bg, #f5f5f5); }
    .vm-sug-codigo { color: var(--text-secondary); font-size: 0.8rem; min-width: 3rem; }
    .vm-sug-nombre { flex: 1; font-weight: 500; color: var(--text); }
    .vm-sug-precio { font-weight: 600; color: var(--primary, #2563eb); }
    .vm-sug-stock { font-size: 0.8rem; color: var(--text-secondary); }
    .vm-sug-stock.sin-stock { color: var(--danger, #ef4444); font-weight: 600; }

    .vm-items-table { overflow-x: auto; }
    .vm-items-table table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
    .vm-items-table th { text-align: left; padding: 0.5rem; color: var(--text-secondary); font-weight: 500; border-bottom: 1px solid var(--border, #e0e0e0); }
    .vm-items-table td { padding: 0.5rem; border-bottom: 1px solid var(--border, #f0f0f0); color: var(--text); }
    .vm-cod { color: var(--text-secondary); font-size: 0.8rem; }
    .vm-nombre { font-weight: 500; }
    .vm-precio { white-space: nowrap; }
    .vm-subtotal { font-weight: 600; color: var(--primary, #2563eb); white-space: nowrap; }
    .vm-cant-cell { width: 70px; }
    .vm-cant-input { width: 60px; padding: 0.3rem; text-align: center; border: 1px solid var(--border, #e0e0e0); border-radius: 4px; font-size: 0.9rem; background: var(--input-bg, #fff); color: var(--text); }
    .vm-btn-remove { background: none; border: none; color: var(--danger, #ef4444); cursor: pointer; font-size: 1rem; padding: 0.2rem 0.4rem; border-radius: 4px; }
    .vm-btn-remove:hover { background: var(--danger-bg, #fef2f2); }

    .vm-empty { text-align: center; padding: 2.5rem 1rem; color: var(--text-secondary); }
    .vm-empty span { font-size: 2rem; display: block; margin-bottom: 0.5rem; }
    .vm-empty p { margin: 0; }

    .vm-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; }
    .vm-full { grid-column: 1 / -1; }
    .vm-field label { display: block; margin-bottom: 0.3rem; font-size: 0.85rem; font-weight: 500; color: var(--text-secondary); }
    .vm-required { color: var(--danger, #ef4444); }
    .vm-input { width: 100%; padding: 0.55rem 0.75rem; border: 1px solid var(--border, #e0e0e0); border-radius: 6px; font-size: 0.9rem; background: var(--input-bg, #fff); color: var(--text); box-sizing: border-box; }
    .vm-input:focus { outline: none; border-color: var(--primary, #2563eb); box-shadow: 0 0 0 2px rgba(37,99,235,0.15); }

    .vm-cash-box { background: var(--bg-secondary, #f9fafb); border: 1px solid var(--border, #e0e0e0); border-radius: 8px; padding: 1rem; margin-bottom: 1rem; display: flex; gap: 1rem; align-items: end; }
    .vm-cash-field { flex: 1; }
    .vm-cash-field label { display: block; margin-bottom: 0.3rem; font-size: 0.85rem; font-weight: 500; color: var(--text-secondary); }
    .vm-cash-input-wrap { display: flex; align-items: center; border: 1px solid var(--border, #e0e0e0); border-radius: 6px; background: var(--input-bg, #fff); overflow: hidden; }
    .vm-cash-prefix { padding: 0 0.5rem; color: var(--text-secondary); font-weight: 600; background: var(--bg-secondary, #f3f4f6); height: 100%; display: flex; align-items: center; border-right: 1px solid var(--border, #e0e0e0); }
    .vm-cash-input { border: none !important; border-radius: 0 !important; box-shadow: none !important; }
    .vm-cash-error { color: var(--danger, #ef4444); font-size: 0.8rem; margin-top: 0.3rem; display: block; }
    .vm-cash-cambio { padding: 0.6rem 0.75rem; border: 1px solid var(--border, #e0e0e0); border-radius: 6px; font-size: 1.2rem; font-weight: 700; background: var(--input-bg, #fff); color: var(--text); text-align: center; }
    .vm-cambio-ok { color: var(--success, #22c55e); border-color: var(--success, #22c55e); background: var(--success-bg, #f0fdf4); }

    .vm-metodos-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
    .vm-metodo-btn { display: flex; align-items: center; gap: 0.4rem; padding: 0.6rem; border: 2px solid var(--border, #e0e0e0); border-radius: 8px; background: var(--card-bg, #fff); cursor: pointer; font-size: 0.85rem; color: var(--text); transition: all 0.15s; }
    .vm-metodo-btn:hover { border-color: var(--primary, #2563eb); }
    .vm-metodo-selected { border-color: var(--primary, #2563eb); background: var(--primary-bg, #eff6ff); color: var(--primary, #2563eb); font-weight: 600; }
    .vm-metodo-icon { font-size: 1.1rem; }

    .vm-desglose { margin: 1.2rem 0; padding: 1rem; background: var(--bg-secondary, #f9fafb); border-radius: 8px; }
    .vm-desglose-row { display: flex; justify-content: space-between; padding: 0.4rem 0; color: var(--text-secondary); font-size: 0.9rem; }
    .vm-desglose-row.vm-total { border-top: 2px solid var(--border, #e0e0e0); margin-top: 0.5rem; padding-top: 0.7rem; font-size: 1.1rem; font-weight: 700; color: var(--text); }

    .vm-btn-confirm { width: 100%; padding: 0.8rem; background: var(--primary, #2563eb); color: #fff; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: opacity 0.2s; margin-top: 0.5rem; }
    .vm-btn-confirm:hover:not(:disabled) { opacity: 0.9; }
    .vm-btn-confirm:disabled { opacity: 0.5; cursor: not-allowed; }
    .vm-spinner { display: inline-block; width: 1rem; height: 1rem; border: 2px solid #fff; border-top-color: transparent; border-radius: 50%; animation: vm-spin 0.6s linear infinite; }
    @keyframes vm-spin { to { transform: rotate(360deg); } }

    .vm-resultado { margin-top: 1rem; padding: 1rem; background: var(--success-bg, #f0fdf4); border: 1px solid var(--success-border, #bbf7d0); border-radius: 8px; text-align: center; }
    .vm-resultado-icon { font-size: 2rem; color: var(--success, #22c55e); }
    .vm-resultado h4 { margin: 0.5rem 0; color: var(--text); }
    .vm-resultado p { margin: 0.25rem 0; color: var(--text-secondary); }
    .vm-btn-nueva { margin-top: 0.75rem; padding: 0.5rem 1.5rem; background: var(--primary, #2563eb); color: #fff; border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem; }
  `]
})
export class AdminVentaManualComponent implements OnInit {
  terminoBusqueda = '';
  sugerencias: Producto[] = [];
  mostrarSugerencias = false;
  items: VentaManualItem[] = [];
  stocks: Map<number, number> = new Map();

  clienteNombre = '';
  clienteApellido = '';
  clienteDocumento = '';
  clienteTelefono = '';
  direccionCalle = '';
  direccionSecundaria = '';
  direccionReferencia = '';
  metodoPago = 'EFECTIVO';
  metodosActivos: MetodoPagoItem[] = [];

  valorRecibido = 0;
  cambio = 0;

  procesando = false;
  resultadoVenta: any = null;

  subtotalGeneral = 0;
  impuestos = 0;
  totalFinal = 0;
  totalItems = 0;

  private busquedaTimeout: any;

  constructor(
    private ventaManualService: VentaManualService,
    private metodoPagoService: MetodoPagoService,
    private toastService: ToastService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.metodosActivos = this.metodoPagoService.listarActivos();
    this.cargarInventario();
  }

  cargarInventario(): void {
    this.ventaManualService.listarProductos().subscribe({
      next: (productos) => {
        productos.forEach(p => {
          if (p.id) {
            this.ventaManualService['http'].get<any>(`/api/inventario/producto/${p.id}`).subscribe({
              next: (inv) => { if (inv) this.stocks.set(p.id!, inv.stock); this.cdr.detectChanges(); },
              error: () => { this.stocks.set(p.id!, 0); }
            });
          }
        });
      }
    });
  }

  seleccionarMetodo(nombre: string): void {
    this.metodoPago = nombre;
    if (nombre !== 'EFECTIVO') {
      this.valorRecibido = 0;
      this.cambio = 0;
    } else {
      this.calcularCambio();
    }
  }

  calcularCambio(): void {
    this.cambio = (this.valorRecibido || 0) - this.totalFinal;
    if (this.cambio < 0) this.cambio = 0;
  }

  onBuscar(): void {
    clearTimeout(this.busquedaTimeout);
    if (this.terminoBusqueda.trim().length < 1) {
      this.sugerencias = [];
      return;
    }
    this.busquedaTimeout = setTimeout(() => {
      this.ventaManualService.buscarProductos(this.terminoBusqueda).subscribe({
        next: (productos) => {
          this.sugerencias = productos.filter(p =>
            !this.items.some(item => item.productoId === p.id)
          );
          this.cdr.detectChanges();
        }
      });
    }, 200);
  }

  seleccionarProducto(producto: Producto): void {
    const stock = this.obtenerStock(producto.id!);
    if (stock <= 0) {
      this.toastService.show('No hay stock disponible para este producto', 'error');
      return;
    }
    this.items.push({
      productoId: producto.id!,
      cantidad: 1,
      precioUnitario: producto.precio,
      subtotal: producto.precio,
      nombreProducto: producto.nombre,
      codigoProducto: producto.cod,
      stockDisponible: stock
    });
    this.terminoBusqueda = '';
    this.sugerencias = [];
    this.mostrarSugerencias = false;
    this.recalcular();
  }

  eliminarItem(index: number): void {
    this.items.splice(index, 1);
    this.recalcular();
  }

  recalcular(): void {
    this.subtotalGeneral = 0;
    this.totalItems = 0;
    this.items.forEach(item => {
      item.subtotal = (item.precioUnitario || 0) * item.cantidad;
      this.subtotalGeneral += item.subtotal!;
      this.totalItems += item.cantidad;
    });
    this.impuestos = this.subtotalGeneral * 0.15;
    this.totalFinal = this.subtotalGeneral + this.impuestos;
    this.calcularCambio();
  }

  obtenerStock(productoId: number): number {
    return this.stocks.get(productoId) || 0;
  }

  iconoMetodo(nombre: string): string {
    switch (nombre) {
      case 'EFECTIVO': return '\uD83D\uDCB5';
      case 'TARJETA': return '\uD83D\uDCB3';
      case 'TRANSFERENCIA': return '\uD83D\uDCB8';
      case 'PAYPAL': return '\u2708\uFE0F';
      default: return '\uD83D\uDCB0';
    }
  }

  confirmarVenta(): void {
    if (this.items.length === 0) {
      this.toastService.show('Debe agregar al menos un producto', 'error');
      return;
    }
    if (!this.clienteNombre.trim() || !this.clienteApellido.trim()) {
      this.toastService.show('Nombre y apellido del cliente son obligatorios', 'error');
      return;
    }
    if (!this.clienteDocumento.trim() || this.clienteDocumento.trim().length < 6) {
      this.toastService.show('Ingrese una cedula o documento valido', 'error');
      return;
    }
    if (!this.clienteTelefono.trim() || this.clienteTelefono.trim().length < 7) {
      this.toastService.show('Ingrese un numero de telefono valido', 'error');
      return;
    }
    if (!this.direccionCalle.trim()) {
      this.toastService.show('La calle principal es obligatoria', 'error');
      return;
    }
    if (!this.metodoPago) {
      this.toastService.show('Seleccione un metodo de pago', 'error');
      return;
    }
    if (this.metodoPago === 'EFECTIVO') {
      if (!this.valorRecibido || this.valorRecibido <= 0) {
        this.toastService.show('Ingrese el valor recibido del cliente', 'error');
        return;
      }
      if (this.valorRecibido < this.totalFinal) {
        this.toastService.show('El valor recibido es menor al total de la venta', 'error');
        return;
      }
    }

    for (const item of this.items) {
      if (item.cantidad > item.stockDisponible!) {
        this.toastService.show(`Stock insuficiente para "${item.nombreProducto}". Disponible: ${item.stockDisponible}`, 'error');
        return;
      }
    }

    this.procesando = true;
    this.cdr.detectChanges();

    const request = {
      clienteNombre: this.clienteNombre.trim(),
      clienteApellido: this.clienteApellido.trim(),
      clienteDocumento: this.clienteDocumento.trim(),
      clienteTelefono: this.clienteTelefono.trim(),
      direccionCallePrincipal: this.direccionCalle.trim(),
      direccionCalleSecundaria: this.direccionSecundaria.trim(),
      direccionReferencia: this.direccionReferencia.trim(),
      metodoPago: this.metodoPago,
      items: this.items.map(i => ({
        productoId: i.productoId,
        cantidad: i.cantidad,
        precioUnitario: i.precioUnitario!
      }))
    };

    this.ventaManualService.registrarVenta(request).subscribe({
      next: (res) => {
        this.procesando = false;
        this.resultadoVenta = res;
        this.toastService.show('Venta registrada correctamente', 'exito');
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.procesando = false;
        const msg = err.error?.error || 'Error al registrar la venta';
        this.toastService.show(msg, 'error');
        this.cdr.detectChanges();
      }
    });
  }

  nuevaVenta(): void {
    this.items = [];
    this.clienteNombre = '';
    this.clienteApellido = '';
    this.clienteDocumento = '';
    this.clienteTelefono = '';
    this.direccionCalle = '';
    this.direccionSecundaria = '';
    this.direccionReferencia = '';
    this.metodoPago = 'EFECTIVO';
    this.valorRecibido = 0;
    this.cambio = 0;
    this.resultadoVenta = null;
    this.subtotalGeneral = 0;
    this.impuestos = 0;
    this.totalFinal = 0;
    this.totalItems = 0;
    this.cargarInventario();
  }
}
