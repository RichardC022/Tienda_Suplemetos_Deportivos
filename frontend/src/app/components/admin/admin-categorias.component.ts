import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoriaService } from '../../core/services/categoria.service';
import { ToastService } from '../../core/services/toast.service';
import { Categoria } from '../../models';

@Component({
  selector: 'app-admin-categorias',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h2 class="mb-4">Gestion de Categorias</h2>

    <div class="d-flex justify-content-end mb-3">
      <a routerLink="/admin/categorias/nueva" class="btn btn-primary">+ Nueva Categoria</a>
    </div>

    <div class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripcion</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          @for (cat of categorias; track cat.id) {
            <tr>
              <td>{{ cat.id }}</td>
              <td>{{ cat.nombre }}</td>
              <td>{{ cat.descripcion || '-' }}</td>
              <td class="table-actions">
                <a [routerLink]="['/admin/categorias/editar', cat.id]" class="btn-edit">Editar</a>
                <button class="btn-delete" (click)="eliminar(cat.id!)">Eliminar</button>
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="4" class="text-center text-muted">No hay categorias</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: []
})
export class AdminCategoriasComponent implements OnInit {
  categorias: Categoria[] = [];

  constructor(
    private categoriaService: CategoriaService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.categoriaService.listarTodas().subscribe({
      next: (data) => { this.categorias = data; this.cdr.detectChanges(); }
    });
  }

  eliminar(id: number): void {
    if (confirm('Seguro que desea eliminar esta categoria?')) {
      this.categoriaService.eliminar(id).subscribe({
        next: () => { this.toastService.show('Categoria eliminada', 'exito'); this.cargar(); },
        error: () => { this.toastService.show('Error al eliminar', 'error'); }
      });
    }
  }
}
