import { Component, OnInit } from '@angular/core';
import { InventarioService } from '../../core/services/inventario.service';
import { ProductoService } from '../../core/services/producto.service';
import { Inventario, Producto } from '../../models';
import { FormsModule } from '@angular/forms';

/*
 * Componente admin para gestionar el inventario.
 * Permite ver el stock de todos los productos, actualizar stock
 * y crear nuevos registros de inventario.
 */
@Component({
  selector: 'app-admin-inventario',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Gestión de Inventario</h2>
      <button class="btn btn-primary" (click)="mostrarFormulario = true">
        + Nuevo Registro
      </button>
    </div>

    @if (mostrarFormulario) {
      <div class="card mb-4">
        <div class="card-body">
          <h5>{{ editando ? 'Editar Inventario' : 'Nuevo Registro de Inventario' }}</h5>
          <form (ngSubmit)="guardar()">
            <div class="row">
              <div class="col-md-4 mb-3">
                <label class="form-label">Producto</label>
                <select class="form-select" [(ngModel)]="inventarioForm.producto"
                        name="productoId" [disabled]="editando">
                  @for (prod of productos; track prod.id) {
                    <option [ngValue]="prod">{{ prod.nombre }}</option>
                  }
                </select>
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Stock Actual</label>
                <input type="number" class="form-control"
                       [(ngModel)]="inventarioForm.stock" name="stock" min="0">
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Stock Mínimo</label>
                <input type="number" class="form-control"
                       [(ngModel)]="inventarioForm.stockMin" name="stockMin" min="0">
              </div>
            </div>

            <!-- Alerta de stock bajo -->
            @if (inventarioForm.stock <= inventarioForm.stockMin && inventarioForm.stockMin > 0) {
              <div class="alert alert-warning">
                ⚠️ El stock es igual o menor al stock mínimo.
              </div>
            }

            <div class="d-flex gap-2">
              <button type="submit" class="btn btn-success">Guardar</button>
              <button type="button" class="btn btn-secondary"
                      (click)="cancelar()">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    }

    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Producto</th>
            <th>Stock</th>
            <th>Stock Mínimo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          @for (inv of inventarios; track inv.id) {
            <tr>
              <td>{{ inv.id }}</td>
              <td>{{ inv.producto?.nombre || '—' }}</td>
              <td>{{ inv.stock }}</td>
              <td>{{ inv.stockMin }}</td>
              <td>
                @if (inv.stock === 0) {
                  <span class="badge bg-danger">Agotado</span>
                } @else if (inv.stock <= inv.stockMin) {
                  <span class="badge bg-warning">Stock Bajo</span>
                } @else {
                  <span class="badge bg-success">OK</span>
                }
              </td>
              <td>
                <button class="btn btn-sm btn-warning me-1"
                        (click)="editar(inv)">Editar</button>
                <button class="btn btn-sm btn-danger"
                        (click)="eliminar(inv.id!)">Eliminar</button>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `
})
export class AdminInventarioComponent implements OnInit {
  inventarios: Inventario[] = [];
  productos: Producto[] = [];
  mostrarFormulario = false;
  editando = false;
  inventarioForm: Inventario = { stock: 0, stockMin: 0 };

  constructor(
    private inventarioService: InventarioService,
    private productoService: ProductoService
  ) {}

  ngOnInit(): void {
    this.cargarInventarios();
    this.cargarProductos();
  }

  cargarInventarios(): void {
    this.inventarioService.listarTodos().subscribe({
      next: (data) => this.inventarios = data
    });
  }

  cargarProductos(): void {
    this.productoService.listarTodos().subscribe({
      next: (data) => this.productos = data
    });
  }

  guardar(): void {
    if (this.editando && this.inventarioForm.id) {
      this.inventarioService.actualizar(this.inventarioForm.id, this.inventarioForm)
        .subscribe(() => {
          this.cargarInventarios();
          this.cancelar();
        });
    } else {
      this.inventarioService.guardar(this.inventarioForm).subscribe(() => {
        this.cargarInventarios();
        this.cancelar();
      });
    }
  }

  editar(inventario: Inventario): void {
    this.inventarioForm = { ...inventario };
    this.editando = true;
    this.mostrarFormulario = true;
  }

  eliminar(id: number): void {
    if (confirm('¿Eliminar este registro de inventario?')) {
      this.inventarioService.eliminar(id).subscribe(() => {
        this.cargarInventarios();
      });
    }
  }

  cancelar(): void {
    this.mostrarFormulario = false;
    this.editando = false;
    this.inventarioForm = { stock: 0, stockMin: 0 };
  }
}
