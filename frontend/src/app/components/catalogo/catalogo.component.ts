import { Component, OnInit } from '@angular/core';
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
              <div class="producto-img">&#128230;</div>
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
  `
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
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarCategorias();
  }

  cargarProductos(): void {
    this.cargando = true;
    this.productoService.listarTodos().subscribe({
      next: (data) => { this.productos = data; this.cargando = false; },
      error: () => { this.cargando = false; }
    });
  }

  cargarCategorias(): void {
    this.categoriaService.listarTodas().subscribe({
      next: (data) => this.categorias = data
    });
  }

  seleccionarCategoria(id: number): void {
    this.categoriaSeleccionada = id;
    if (id === 0) {
      this.cargarProductos();
    } else {
      this.productoService.obtenerPorCategoria(id).subscribe({
        next: (data) => this.productos = data
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
