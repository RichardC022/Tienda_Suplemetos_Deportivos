import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../core/services/producto.service';
import { CategoriaService } from '../../core/services/categoria.service';
import { Producto, Categoria } from '../../models';
import { FormsModule } from '@angular/forms';

/*
 * Componente admin para gestionar productos del catálogo.
 * Permite crear, editar, activar/desactivar y eliminar productos.
 */
@Component({
  selector: 'app-admin-productos',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Gestión de Productos</h2>
      <button class="btn btn-primary" (click)="mostrarFormulario = true">
        + Nuevo Producto
      </button>
    </div>

    <!-- Formulario de producto (se muestra al hacer clic en Nuevo) -->
    @if (mostrarFormulario) {
      <div class="card mb-4">
        <div class="card-body">
          <h5>{{ editando ? 'Editar Producto' : 'Nuevo Producto' }}</h5>
          <form (ngSubmit)="guardarProducto()">
            <div class="row">
              <div class="col-md-4 mb-3">
                <label class="form-label">Nombre</label>
                <input type="text" class="form-control" [(ngModel)]="productoForm.nombre"
                       name="nombre" required>
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Código</label>
                <input type="number" class="form-control" [(ngModel)]="productoForm.cod"
                       name="cod" required>
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Precio</label>
                <input type="number" class="form-control" [(ngModel)]="productoForm.precio"
                       name="precio" min="0" step="0.01" required>
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Detalle</label>
              <textarea class="form-control" [(ngModel)]="productoForm.detalle"
                        name="detalle" rows="3"></textarea>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Categoría</label>
                <select class="form-select" [(ngModel)]="productoForm.categoria"
                        name="categoriaId">
                  <option [ngValue]="null">Sin categoría</option>
                  @for (cat of categorias; track cat.id) {
                    <option [ngValue]="cat">{{ cat.nombre }}</option>
                  }
                </select>
              </div>
              <div class="col-md-6 mb-3 d-flex align-items-end">
                <div class="form-check">
                  <input type="checkbox" class="form-check-input"
                         [(ngModel)]="productoForm.estado" name="estado">
                  <label class="form-check-label">Activo</label>
                </div>
              </div>
            </div>
            <div class="d-flex gap-2">
              <button type="submit" class="btn btn-success">Guardar</button>
              <button type="button" class="btn btn-secondary"
                      (click)="cancelar()">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    }

    <!-- Tabla de productos -->
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Código</th>
            <th>Precio</th>
            <th>Categoría</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          @for (prod of productos; track prod.id) {
            <tr>
              <td>{{ prod.id }}</td>
              <td>{{ prod.nombre }}</td>
              <td>{{ prod.cod }}</td>
              <td>\${{ prod.precio }}</td>
              <td>{{ prod.categoria?.nombre || '—' }}</td>
              <td>
                <span class="badge" [class]="prod.estado ? 'bg-success' : 'bg-danger'">
                  {{ prod.estado ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td>
                <button class="btn btn-sm btn-warning me-1"
                        (click)="editar(prod)">Editar</button>
                <button class="btn btn-sm btn-danger"
                        (click)="eliminar(prod.id!)">Eliminar</button>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `
})
export class AdminProductosComponent implements OnInit {
  productos: Producto[] = [];
  categorias: Categoria[] = [];
  mostrarFormulario = false;
  editando = false;
  productoForm: Producto = this.nuevoProducto();

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarCategorias();
  }

  cargarProductos(): void {
    this.productoService.listarTodos().subscribe({
      next: (data) => this.productos = data
    });
  }

  cargarCategorias(): void {
    this.categoriaService.listarTodas().subscribe({
      next: (data) => this.categorias = data
    });
  }

  nuevoProducto(): Producto {
    return { nombre: '', cod: 0, detalle: '', estado: true, precio: 0 };
  }

  guardarProducto(): void {
    if (this.editando && this.productoForm.id) {
      this.productoService.actualizar(this.productoForm.id, this.productoForm)
        .subscribe(() => {
          this.cargarProductos();
          this.cancelar();
        });
    } else {
      this.productoService.crear(this.productoForm).subscribe(() => {
        this.cargarProductos();
        this.cancelar();
      });
    }
  }

  editar(producto: Producto): void {
    this.productoForm = { ...producto };
    this.editando = true;
    this.mostrarFormulario = true;
  }

  eliminar(id: number): void {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.productoService.eliminar(id).subscribe(() => {
        this.cargarProductos();
      });
    }
  }

  cancelar(): void {
    this.mostrarFormulario = false;
    this.editando = false;
    this.productoForm = this.nuevoProducto();
  }
}
