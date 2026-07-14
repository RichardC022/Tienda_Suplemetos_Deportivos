import { Component, OnInit } from '@angular/core';
import { CategoriaService } from '../../core/services/categoria.service';
import { ToastService } from '../../core/services/toast.service';
import { Categoria } from '../../models';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-categorias',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="admin-header">
      <h3>Categorias</h3>
      <button class="btn-add" (click)="mostrarFormulario = true">+ Nueva Categoria</button>
    </div>

    @if (mostrarFormulario) {
      <div class="card-form">
        <h5>{{ editando ? 'Editar Categoria' : 'Nueva Categoria' }}</h5>
        <form (ngSubmit)="guardar()">
          <div class="form-group">
            <label>Nombre</label>
            <input type="text" class="form-control" [(ngModel)]="form.nombre" name="nombre" required>
          </div>
          <div class="form-group">
            <label>Descripcion</label>
            <textarea class="form-control" [(ngModel)]="form.descripcion" name="descripcion" rows="2"></textarea>
          </div>
          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-success">Guardar</button>
            <button type="button" class="btn btn-secondary" (click)="cancelar()">Cancelar</button>
          </div>
        </form>
      </div>
    }

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
                <button class="btn-edit" (click)="editar(cat)">Editar</button>
                <button class="btn-delete" (click)="eliminar(cat.id!)">Eliminar</button>
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="4" style="text-align:center;">No hay categorias</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `
})
export class AdminCategoriasComponent implements OnInit {
  categorias: Categoria[] = [];
  mostrarFormulario = false;
  editando = false;
  form: Categoria = { nombre: '', descripcion: '' };

  constructor(
    private categoriaService: CategoriaService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.categoriaService.listarTodas().subscribe({
      next: (data) => this.categorias = data
    });
  }

  guardar(): void {
    if (this.editando && this.form.id) {
      this.categoriaService.actualizar(this.form.id, this.form).subscribe({
        next: () => { this.toastService.show('Categoria actualizada', 'exito'); this.cargar(); this.cancelar(); },
        error: () => this.toastService.show('Error al guardar', 'error')
      });
    } else {
      this.categoriaService.crear(this.form).subscribe({
        next: () => { this.toastService.show('Categoria guardada', 'exito'); this.cargar(); this.cancelar(); },
        error: () => this.toastService.show('Error al guardar', 'error')
      });
    }
  }

  editar(cat: Categoria): void {
    this.form = { ...cat };
    this.editando = true;
    this.mostrarFormulario = true;
  }

  eliminar(id: number): void {
    if (confirm('Seguro que deseas eliminar?')) {
      this.categoriaService.eliminar(id).subscribe({
        next: () => { this.toastService.show('Eliminado correctamente', 'exito'); this.cargar(); },
        error: () => this.toastService.show('Error al eliminar', 'error')
      });
    }
  }

  cancelar(): void {
    this.mostrarFormulario = false;
    this.editando = false;
    this.form = { nombre: '', descripcion: '' };
  }
}
