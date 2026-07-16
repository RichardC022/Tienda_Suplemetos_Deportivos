import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../core/services/producto.service';
import { CategoriaService } from '../../core/services/categoria.service';
import { ToastService } from '../../core/services/toast.service';
import { Producto, Categoria } from '../../models';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-productos',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Gestion de Productos</h2>
      <button class="btn btn-primary" (click)="mostrarFormulario = true">
        + Nuevo Producto
      </button>
    </div>

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
                <label class="form-label">Codigo</label>
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
                <label class="form-label">Categoria</label>
                <select class="form-select" [(ngModel)]="productoForm.categoria"
                        name="categoriaId">
                  <option [ngValue]="null">Sin categoria</option>
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

            <!-- Imagen del producto -->
            <div class="mb-3">
              <label class="form-label fw-bold">Imagen del Producto</label>
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-2">
                    <label class="form-label small">URL de imagen</label>
                    <input type="url" class="form-control" [(ngModel)]="productoForm.imagenUrl"
                           name="imagenUrl" placeholder="https://ejemplo.com/imagen.jpg"
                           (ngModelChange)="onUrlChange()">
                  </div>
                  <div class="form-check mb-2">
                    <input type="file" class="form-control" #fileInput
                           accept="image/jpeg,image/png,image/webp"
                           (change)="onFileSelected($event)" id="imagenArchivo">
                    <label class="form-label small mt-1">O subir desde el ordenador (JPG, PNG, WebP - Max 5MB)</label>
                  </div>
                </div>
                <div class="col-md-6 text-center">
                  @if (previewUrl) {
                    <img [src]="previewUrl" alt="Preview" class="img-preview">
                  } @else {
                    <div class="img-placeholder">
                      <span>&#128230;</span>
                      <p class="small text-muted mb-0">Sin imagen</p>
                    </div>
                  }
                </div>
              </div>
            </div>

            <div class="d-flex gap-2">
              <button type="submit" class="btn btn-success" [disabled]="subiendoImagen">
                @if (subiendoImagen) {
                  <span class="spinner-border spinner-border-sm me-1"></span> Guardando...
                } @else {
                  Guardar
                }
              </button>
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
                  <span class="text-muted">—</span>
                }
              </td>
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
  `,
  styles: [`
    .img-preview {
      max-width: 200px;
      max-height: 200px;
      border-radius: 8px;
      border: 2px solid var(--border, #e9ecef);
      object-fit: cover;
    }
    .img-placeholder {
      width: 200px;
      height: 200px;
      border: 2px dashed #ccc;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
    }
    .img-placeholder span {
      font-size: 3rem;
    }
    .table-img {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: 6px;
    }
  `]
})
export class AdminProductosComponent implements OnInit {
  productos: Producto[] = [];
  categorias: Categoria[] = [];
  mostrarFormulario = false;
  editando = false;
  productoForm: Producto = this.nuevoProducto();
  previewUrl: string | null = null;
  archivoSeleccionado: File | null = null;
  subiendoImagen = false;

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private toastService: ToastService
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

  onUrlChange(): void {
    this.archivoSeleccionado = null;
    this.previewUrl = this.productoForm.imagenUrl || null;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const archivo = input.files[0];
      if (archivo.size > 5 * 1024 * 1024) {
        this.toastService.show('El archivo no puede superar 5MB', 'error');
        return;
      }
      this.archivoSeleccionado = archivo;
      this.productoForm.imagenUrl = '';
      const reader = new FileReader();
      reader.onload = () => this.previewUrl = reader.result as string;
      reader.readAsDataURL(archivo);
    }
  }

  guardarProducto(): void {
    if (this.editando && this.productoForm.id) {
      this.productoService.actualizar(this.productoForm.id, this.productoForm).subscribe({
        next: (producto) => {
          this.subirArchivoSiExiste(producto.id!);
        }
      });
    } else {
      this.productoService.crear(this.productoForm).subscribe({
        next: (producto) => {
          this.subirArchivoSiExiste(producto.id!);
        }
      });
    }
  }

  private subirArchivoSiExiste(productoId: number): void {
    if (this.archivoSeleccionado) {
      this.subiendoImagen = true;
      this.productoService.subirImagen(productoId, this.archivoSeleccionado).subscribe({
        next: () => {
          this.cargarProductos();
          this.cancelar();
          this.toastService.show('Producto guardado con imagen', 'exito');
        },
        error: () => {
          this.subiendoImagen = false;
          this.cargarProductos();
          this.cancelar();
          this.toastService.show('Producto guardado, pero hubo un error al subir la imagen', 'error');
        }
      });
    } else {
      this.cargarProductos();
      this.cancelar();
      this.toastService.show('Producto guardado correctamente', 'exito');
    }
  }

  editar(producto: Producto): void {
    this.productoForm = { ...producto };
    this.previewUrl = producto.imagenUrl || null;
    this.archivoSeleccionado = null;
    this.editando = true;
    this.mostrarFormulario = true;
  }

  eliminar(id: number): void {
    if (confirm('¿Estas seguro de eliminar este producto?')) {
      this.productoService.eliminar(id).subscribe(() => {
        this.cargarProductos();
      });
    }
  }

  cancelar(): void {
    this.mostrarFormulario = false;
    this.editando = false;
    this.productoForm = this.nuevoProducto();
    this.previewUrl = null;
    this.archivoSeleccionado = null;
    this.subiendoImagen = false;
  }
}
