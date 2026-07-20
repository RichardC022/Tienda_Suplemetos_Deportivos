import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProductoService } from '../../core/services/producto.service';
import { CategoriaService } from '../../core/services/categoria.service';
import { CarritoService } from '../../core/services/carrito.service';
import { ToastService } from '../../core/services/toast.service';
import { Producto, Categoria } from '../../models';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  template: `
    <!-- Hero Section -->
    <section class="hero">
      <h2>Suplementos de <span>Calidad</span></h2>
      <p>Encuentra las mejores proteinas, creatinas, vitaminas y mas para potenciar tu entrenamiento.</p>
      <a class="hero-btn" (click)="scrollToProducts()">Ver Productos</a>
    </section>

    <!-- Categorias -->
    <section class="section">
      <div class="section-title">
        <h3>Categorias</h3>
        <p>Filtra productos por categoria</p>
      </div>
      <div class="filtros">
        <button class="filtro-btn" [class.active]="categoriaSeleccionada === 0"
                (click)="seleccionarCategoria(0)">Todos</button>
        @for (cat of categorias; track cat.id) {
          <button class="filtro-btn" [class.active]="categoriaSeleccionada === cat.id!"
                  (click)="seleccionarCategoria(cat.id!)">{{ cat.nombre }}</button>
        }
      </div>
    </section>

    <!-- Productos -->
    <section class="section" id="productos">
      <div class="section-title">
        <h3>Nuestros <span>Productos</span></h3>
        <p>Los mejores suplementos deportivos</p>
      </div>

      @if (cargando) {
        <div class="text-center py-5">
          <div class="spinner-border text-primary"></div>
          <p class="mt-2">Cargando productos...</p>
        </div>
      }

      @if (!cargando) {
        <div class="productos-grid">
          @for (producto of productos; track producto.id) {
            <div class="producto-card">
              @if (producto.imagenUrl) {
                <img [src]="producto.imagenUrl" [alt]="producto.nombre" class="producto-img">
              } @else {
                <div class="producto-img-placeholder">&#128230;</div>
              }
              <div class="producto-body">
                <h4>{{ producto.nombre }}</h4>
                <div class="producto-cat">{{ producto.categoria?.nombre || 'Sin categoria' }}</div>
                <div class="producto-desc">{{ producto.detalle || 'Sin descripcion' }}</div>
              </div>
              <div class="producto-footer">
                <span class="producto-precio">\${{ producto.precio?.toFixed(2) || '0.00' }}</span>
                @if (producto.estado) {
                  <button class="btn-carrito" (click)="agregarAlCarrito(producto)">Agregar</button>
                } @else {
                  <span class="badge bg-danger">No Disponible</span>
                }
              </div>
            </div>
          } @empty {
            <p class="text-center text-muted" style="grid-column:1/-1;">No hay productos disponibles</p>
          }
        </div>
      }
    </section>

    <!-- WhatsApp Flotante -->
    <a href="https://wa.me/593982764788" target="_blank" class="whatsapp-fab" title="Preguntas frecuentes">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#fff">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </a>
  `,
  styles: [`
    :host { display: block; }
    .whatsapp-fab {
      position: fixed; bottom: 24px; right: 24px; z-index: 1000;
      width: 60px; height: 60px; border-radius: 50%;
      background: #25d366; display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.25); transition: transform 0.2s;
      text-decoration: none;
    }
    .whatsapp-fab:hover { transform: scale(1.1); }
  `]
})
export class CatalogoComponent implements OnInit {
  productos: Producto[] = [];
  categorias: Categoria[] = [];
  categoriaSeleccionada = 0;
  cargando = true;

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private carritoService: CarritoService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarCategorias();
  }

  cargarProductos(): void {
    this.cargando = true;
    this.productoService.listarTodos().subscribe({
      next: (data) => { this.productos = data; this.cargando = false; this.cdr.detectChanges(); },
      error: () => { this.cargando = false; this.cdr.detectChanges(); }
    });
  }

  cargarCategorias(): void {
    this.categoriaService.listarTodas().subscribe({
      next: (data) => { this.categorias = data; this.cdr.detectChanges(); }
    });
  }

  seleccionarCategoria(id: number): void {
    this.categoriaSeleccionada = id;
    if (id === 0) {
      this.cargarProductos();
    } else {
      this.productoService.obtenerPorCategoria(id).subscribe({
        next: (data) => { this.productos = data; this.cdr.detectChanges(); }
      });
    }
  }

  agregarAlCarrito(producto: Producto): void {
    this.carritoService.agregarProducto(producto);
    this.toastService.show(`${producto.nombre} agregado al carrito`, 'exito');
  }

  scrollToProducts(): void {
    document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' });
  }
}
