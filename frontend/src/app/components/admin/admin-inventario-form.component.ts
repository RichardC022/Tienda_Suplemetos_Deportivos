import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InventarioService } from '../../services/inventario.service';
import { ProductoService } from '../../services/producto.service';
import { ToastService } from '../../services/toast.service';
import { Inventario, Producto } from '../../models';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-inventario-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="d-flex align-items-center gap-3 mb-4">
      <a routerLink="/admin/inventario" class="btn-back">&#8592; Volver</a>
      <h2>{{ editando ? 'Editar Inventario' : 'Nuevo Registro de Inventario' }}</h2>
    </div>

    <div class="card">
      <div class="card-body">
        <form (ngSubmit)="guardar()" #inventarioForm="ngForm">
          <div class="row">
            <div class="col-md-4 mb-3">
              <label class="form-label">Producto <span class="text-danger">*</span></label>
              <select class="form-select" [(ngModel)]="inventario.producto"
                      name="productoId" required [disabled]="editando" #producto="ngModel">
                <option [ngValue]="null" disabled>Seleccione un producto</option>
                @for (prod of productos; track prod.id) {
                  <option [ngValue]="prod">{{ prod.nombre }}</option>
                }
              </select>
              @if (producto.invalid && producto.touched) {
                <small class="text-danger">El producto es obligatorio</small>
              }
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">Stock Actual <span class="text-danger">*</span></label>
              <input type="number" class="form-control"
                     [(ngModel)]="inventario.stock" name="stock" min="0" required #stock="ngModel">
              @if (stock.invalid && stock.touched) {
                <small class="text-danger">El stock es obligatorio</small>
              }
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">Stock Minimo <span class="text-danger">*</span></label>
              <input type="number" class="form-control"
                     [(ngModel)]="inventario.stockMin" name="stockMin" min="0" required #stockMin="ngModel">
              @if (stockMin.invalid && stockMin.touched) {
                <small class="text-danger">El stock minimo es obligatorio</small>
              }
            </div>
          </div>

          @if (inventario.stock <= inventario.stockMin && inventario.stockMin > 0) {
            <div class="alert alert-warning">
              El stock es igual o menor al stock minimo.
            </div>
          }

          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-success" [disabled]="inventarioForm.invalid || guardando">
              @if (guardando) {
                <span class="spinner-border spinner-border-sm me-1"></span> Guardando...
              } @else {
                Guardar
              }
            </button>
            <a routerLink="/admin/inventario" class="btn btn-secondary">Cancelar</a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .btn-back {
      display: inline-flex; align-items: center; gap: 0.4rem;
      padding: 0.5rem 1rem; border-radius: 6px; font-weight: 600;
      color: var(--text-primary, #333); text-decoration: none;
      border: 1px solid var(--border, #e9ecef); transition: all 0.2s;
      font-size: 0.9rem;
    }
    .btn-back:hover { background: var(--bg-hover, #f0f0f0); }
  `]
})
export class AdminInventarioFormComponent implements OnInit {
  inventario: Inventario = { stock: 0, stockMin: 0 };
  productos: Producto[] = [];
  editando = false;
  guardando = false;
  private inventarioId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private inventarioService: InventarioService,
    private productoService: ProductoService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editando = true;
      this.inventarioId = +id;
      this.inventarioService.obtenerPorId(this.inventarioId).subscribe({
        next: (data) => { this.inventario = data; this.cdr.detectChanges(); },
        error: () => { this.toastService.show('Error al cargar el inventario', 'error'); this.router.navigate(['/admin/inventario']); }
      });
    }
  }

  cargarProductos(): void {
    this.productoService.listarTodos().subscribe({
      next: (data) => { this.productos = data; this.cdr.detectChanges(); }
    });
  }

  guardar(): void {
    if (!this.inventario.producto) {
      this.toastService.show('Todos los campos obligatorios deben ser completados', 'error');
      return;
    }
    this.guardando = true;
    const operacion = (this.editando && this.inventarioId)
      ? this.inventarioService.actualizar(this.inventarioId, this.inventario)
      : this.inventarioService.guardar(this.inventario);

    operacion.subscribe({
      next: () => {
        this.toastService.show(this.editando ? 'Inventario actualizado' : 'Inventario guardado', 'exito');
        this.router.navigate(['/admin/inventario']);
      },
      error: () => {
        this.toastService.show('Error al guardar el inventario', 'error');
        this.guardando = false;
        this.cdr.detectChanges();
      }
    });
  }
}
