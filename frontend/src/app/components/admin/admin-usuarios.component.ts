import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [],
  template: `
    <h2 class="mb-4">Gestion de Usuarios</h2>

    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Correo</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Telefono</th>
            <th>Rol</th>
            <th>Intentos Fallidos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          @for (user of usuarios; track user.id) {
            <tr>
              <td>{{ user.id }}</td>
              <td>{{ user.correo }}</td>
              <td>{{ user.persona?.nombre || '-' }}</td>
              <td>{{ user.persona?.apellido || '-' }}</td>
              <td>{{ user.persona?.telefono || '-' }}</td>
              <td>
                <span class="badge"
                      [class]="user.rol?.nombre === 'ADMIN' ? 'bg-danger' : 'bg-primary'">
                  {{ user.rol?.nombre || 'Sin rol' }}
                </span>
              </td>
              <td>{{ user.intentoFallido || 0 }}</td>
              <td>
                <button class="btn btn-sm btn-danger"
                        (click)="eliminar(user.id!)">Eliminar</button>
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="8" class="text-center text-muted">No hay usuarios registrados</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: []
})
export class AdminUsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];

  constructor(private usuarioService: UsuarioService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuarioService.listarTodos().subscribe({
      next: (data) => { this.usuarios = data; this.cdr.detectChanges(); }
    });
  }

  eliminar(id: number): void {
    if (confirm('Esta seguro de eliminar este usuario?')) {
      this.usuarioService.eliminar(id).subscribe({
        next: () => { this.cargarUsuarios(); }
      });
    }
  }
}
