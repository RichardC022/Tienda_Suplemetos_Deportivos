import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoriaService } from '../../core/services/categoria.service';
import { ToastService } from '../../core/services/toast.service';
import { Categoria } from '../../models';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-categoria-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="d-flex align-items-center gap-3 mb-4">
      <a routerLink="/admin/categorias" class="btn-back">&#8592; Volver</a>
      <h2>{{ editando ? 'Editar Categoria' : 'Nueva Categoria' }}</h2>
    </div>

    <div class="card">
      <div class="card-body">
        <form (ngSubmit)="guardar()" #categoriaForm="ngForm">
          <div class="mb-3">
            <label class="form-label">Nombre <span class="text-danger">*</span></label>
            <input type="text" class="form-control" [(ngModel)]="form.nombre"
                   name="nombre" required #nombre="ngModel">
            @if (nombre.invalid && nombre.touched) {
              <small class="text-danger">El nombre es obligatorio</small>
            }
          </div>
          <div class="mb-3">
            <label class="form-label">Descripcion <span class="text-danger">*</span></label>
            <textarea class="form-control" [(ngModel)]="form.descripcion"
                      name="descripcion" rows="3" required #descripcion="ngModel"></textarea>
            @if (descripcion.invalid && descripcion.touched) {
              <small class="text-danger">La descripcion es obligatoria</small>
            }
          </div>
          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-success" [disabled]="categoriaForm.invalid || guardando">
              @if (guardando) {
                <span class="spinner-border spinner-border-sm me-1"></span> Guardando...
              } @else {
                Guardar
              }
            </button>
            <a routerLink="/admin/categorias" class="btn btn-secondary">Cancelar</a>
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
export class AdminCategoriaFormComponent implements OnInit {
  form: Categoria = { nombre: '', descripcion: '' };
  editando = false;
  guardando = false;
  private categoriaId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoriaService: CategoriaService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editando = true;
      this.categoriaId = +id;
      this.categoriaService.obtenerPorId(this.categoriaId).subscribe({
        next: (data) => { this.form = data; this.cdr.detectChanges(); },
        error: () => { this.toastService.show('Error al cargar la categoria', 'error'); this.router.navigate(['/admin/categorias']); }
      });
    }
  }

  guardar(): void {
    if (!this.form.nombre || !this.form.descripcion) {
      this.toastService.show('Todos los campos obligatorios deben ser completados', 'error');
      return;
    }
    this.guardando = true;
    const operacion = (this.editando && this.categoriaId)
      ? this.categoriaService.actualizar(this.categoriaId, this.form)
      : this.categoriaService.crear(this.form);

    operacion.subscribe({
      next: () => {
        this.toastService.show(this.editando ? 'Categoria actualizada' : 'Categoria guardada', 'exito');
        this.router.navigate(['/admin/categorias']);
      },
      error: () => {
        this.toastService.show('Error al guardar la categoria', 'error');
        this.guardando = false;
        this.cdr.detectChanges();
      }
    });
  }
}
