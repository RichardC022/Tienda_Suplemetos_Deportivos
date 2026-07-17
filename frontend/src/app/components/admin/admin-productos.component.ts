import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ProductoService } from '../../core/services/producto.service';
import { ToastService } from '../../core/services/toast.service';
import { Producto } from '../../models';

@Component({
  selector: 'app-admin-productos',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h2 class="mb-4">Gestion de Productos</h2>

    <div class="d-flex justify-content-end mb-3">
      <a routerLink="/admin/productos/nuevo" class="btn btn-primary">+ Nuevo Producto</a>
    </div>

    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th>Imagen</th>
            <th>ID</th>
            <th>Nombre</th>
            <th>Codigo</th>
            <th>Precio</th>
            <th>Categoria</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          @for (prod of productos; track prod.id) {
            <tr>
              <td>
                @if (prod.imagenUrl) {
                  <img [src]="prod.imagenUrl" [alt]="prod.nombre" class="table-img">
                } @else {
                  <span class="text-muted">-</span>
                }
              </td>
              <td>{{ prod.id }}</td>
              <td>{{ prod.nombre }}</td>
              <td>{{ prod.cod }}</td>
              <td>\${{ prod.precio }}</td>
              <td>{{ prod.categoria?.nombre || '-' }}</td>
              <td>
                <span class="badge" [class]="prod.estado ? 'bg-success' : 'bg-danger'">
                  {{ prod.estado ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td>
                <a [routerLink]="['/admin/productos/editar', prod.id]" class="btn btn-sm btn-warning me-1">
                  Editar
                </a>
                <button class="btn btn-sm btn-danger"
                        (click)="eliminar(prod.id!)">Eliminar</button>
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="8" class="text-center text-muted">No hay productos registrados</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .table-img { width: 50px; height: 50px; object-fit: cover; border-radius: 6px; }
  `]
})
export class AdminProductosComponent implements OnInit {
  productos: Producto[] = [];

  constructor(
    private productoService: ProductoService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productoService.listarTodos().subscribe({
      next: (data) => { this.productos = [...data]; this.cdr.detectChanges(); },
      error: () => { this.toastService.show('Error al cargar productos', 'error'); }
    });
  }

  eliminar(id: number): void {
    if (confirm('Esta seguro de eliminar este producto?')) {
      this.productoService.eliminar(id).subscribe({
        next: () => { this.toastService.show('Producto eliminado', 'exito'); this.cargarProductos(); },
        error: () => { this.toastService.show('Error al eliminar', 'error'); }
      });
    }
  }
}
