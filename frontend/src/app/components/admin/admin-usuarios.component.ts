import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../core/services/usuario.service';
import { Usuario } from '../../models';

/*
 * Componente admin para gestionar los usuarios del sistema.
 * Permite ver la lista de usuarios, su rol y eliminar usuarios.
 * No permite editar porque el backend no tiene endpoint de edición de usuarios
 * desde el módulo de administración (solo desde AuthService).
 */
@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  template: `
    <h2 class="mb-4">Gestión de Usuarios</h2>

    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Correo</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Teléfono</th>
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
              <td>{{ user.persona?.nombre || '—' }}</td>
              <td>{{ user.persona?.apellido || '—' }}</td>
              <td>{{ user.persona?.telefono || '—' }}</td>
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
              <td colspan="8" class="text-center">No hay usuarios registrados</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `
})
export class AdminUsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuarioService.listarTodos().subscribe({
      next: (data) => this.usuarios = data
    });
  }

  eliminar(id: number): void {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.usuarioService.eliminar(id).subscribe(() => {
        this.cargarUsuarios();
      });
    }
  }
}
