import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductoService } from '../../core/services/producto.service';
import { CategoriaService } from '../../core/services/categoria.service';
import { ToastService } from '../../core/services/toast.service';
import { Producto, Categoria } from '../../models';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-producto-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="d-flex align-items-center gap-3 mb-4">
      <a routerLink="/admin/productos" class="btn-back">&#8592; Volver</a>
      <h2>{{ editando ? 'Editar Producto' : 'Nuevo Producto' }}</h2>
    </div>

    <div class="card">
      <div class="card-body">
        <form (ngSubmit)="guardar()" #productoForm="ngForm">
          <div class="row">
            <div class="col-md-4 mb-3">
              <label class="form-label">Nombre <span class="text-danger">*</span></label>
              <input type="text" class="form-control" [(ngModel)]="producto.nombre"
                     name="nombre" required #nombre="ngModel">
              @if (nombre.invalid && nombre.touched) {
                <small class="text-danger">El nombre es obligatorio</small>
              }
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">Codigo <span class="text-danger">*</span></label>
              <input type="number" class="form-control" [(ngModel)]="producto.cod"
                     name="cod" required #cod="ngModel" min="1">
              @if (cod.invalid && cod.touched) {
                <small class="text-danger">El codigo es obligatorio</small>
              }
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">Precio <span class="text-danger">*</span></label>
              <input type="number" class="form-control" [(ngModel)]="producto.precio"
                     name="precio" required #precio="ngModel" min="0.01" step="0.01">
              @if (precio.invalid && precio.touched) {
                <small class="text-danger">El precio es obligatorio</small>
              }
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">Detalle <span class="text-danger">*</span></label>
            <textarea class="form-control" [(ngModel)]="producto.detalle"
                      name="detalle" rows="3" required #detalle="ngModel"></textarea>
            @if (detalle.invalid && detalle.touched) {
              <small class="text-danger">El detalle es obligatorio</small>
            }
          </div>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Categoria <span class="text-danger">*</span></label>
              <select class="form-select" [(ngModel)]="producto.categoria"
                      name="categoriaId" required #categoria="ngModel">
                <option [ngValue]="null" disabled>Seleccione una categoria</option>
                @for (cat of categorias; track cat.id) {
                  <option [ngValue]="cat">{{ cat.nombre }}</option>
                }
              </select>
              @if (categoria.invalid && categoria.touched) {
                <small class="text-danger">La categoria es obligatoria</small>
              }
            </div>
            <div class="col-md-6 mb-3 d-flex align-items-end">
              <div class="form-check">
                <input type="checkbox" class="form-check-input"
                       [(ngModel)]="producto.estado" name="estado">
                <label class="form-check-label">Activo</label>
              </div>
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold">Imagen del Producto</label>
            <div class="row">
              <div class="col-md-6">
                <div class="mb-2">
                  <input type="file" class="form-control" #fileInput
                         accept="image/jpeg,image/png,image/webp"
                         (change)="onFileSelected($event)" id="imagenArchivo">
                  <label class="form-label small mt-1">Subir desde el ordenador (JPG, PNG, WebP - Max 5MB)</label>
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
            <button type="submit" class="btn btn-success" [disabled]="productoForm.invalid || guardando">
              @if (guardando) {
                <span class="spinner-border spinner-border-sm me-1"></span> Guardando...
              } @else {
                Guardar
              }
            </button>
            <a routerLink="/admin/productos" class="btn btn-secondary">Cancelar</a>
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
    .img-preview { max-width: 200px; max-height: 200px; border-radius: 8px; border: 2px solid #e9ecef; object-fit: cover; }
    .img-placeholder {
      width: 200px; height: 200px; border: 2px dashed #ccc; border-radius: 8px;
      display: flex; flex-direction: column; align-items: center; justify-content: center; margin: 0 auto;
    }
    .img-placeholder span { font-size: 3rem; }
  `]
})
export class AdminProductoFormComponent implements OnInit {
  producto: Producto = { nombre: '', cod: 0, detalle: '', estado: true, precio: 0 };
  categorias: Categoria[] = [];
  editando = false;
  guardando = false;
  previewUrl: string | null = null;
  archivoSeleccionado: File | null = null;
  private productoId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editando = true;
      this.productoId = +id;
      this.productoService.obtenerPorId(this.productoId).subscribe({
        next: (data) => { this.producto = data; this.previewUrl = data.imagenUrl || null; this.cdr.detectChanges(); },
        error: () => { this.toastService.show('Error al cargar el producto', 'error'); this.router.navigate(['/admin/productos']); }
      });
    }
  }

  cargarCategorias(): void {
    this.categoriaService.listarTodas().subscribe({
      next: (data) => { this.categorias = data; this.cdr.detectChanges(); }
    });
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
      const reader = new FileReader();
      reader.onload = () => this.previewUrl = reader.result as string;
      reader.readAsDataURL(archivo);
    }
  }

  guardar(): void {
    if (!this.producto.nombre || !this.producto.detalle || !this.producto.categoria) {
      this.toastService.show('Todos los campos obligatorios deben ser completados', 'error');
      return;
    }
    this.guardando = true;
    const operacion = (this.editando && this.productoId)
      ? this.productoService.actualizar(this.productoId, this.producto)
      : this.productoService.crear(this.producto);

    operacion.subscribe({
      next: (producto) => {
        if (producto?.id == null) {
          this.toastService.show('Error: el producto no devolvio un ID valido', 'error');
          this.guardando = false;
          this.cdr.detectChanges();
          return;
        }
        this.subirArchivoSiExiste(producto.id);
      },
      error: () => {
        this.toastService.show('Error al guardar el producto', 'error');
        this.guardando = false;
        this.cdr.detectChanges();
      }
    });
  }

  private subirArchivoSiExiste(productoId: number): void {
    if (this.archivoSeleccionado) {
      this.productoService.subirImagen(productoId, this.archivoSeleccionado).subscribe({
        next: () => {
          this.toastService.show('Producto guardado con imagen', 'exito');
          this.router.navigate(['/admin/productos']);
        },
        error: () => {
          this.toastService.show('Producto guardado, pero error al subir imagen', 'error');
          this.router.navigate(['/admin/productos']);
        }
      });
    } else {
      this.toastService.show('Producto guardado correctamente', 'exito');
      this.router.navigate(['/admin/productos']);
    }
  }
}
