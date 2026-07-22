import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { EnvioService } from '../../core/services/envio.service';
import { DireccionEntrega, EstadoEntrega } from '../../models';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-envios',
  standalone: true,
  imports: [FormsModule],
  template: `
    <h2 class="mb-4">Gestion de Envios</h2>

    <div class="row mb-4">
      <div class="col-md-4">
        <label class="form-label">Filtrar por estado</label>
        <select class="form-select" [(ngModel)]="filtroEstado"
                (change)="filtrarPorEstado()">
          <option value="">Todos</option>
          @for (estado of estados; track estado) {
            <option [value]="estado">{{ estado }}</option>
          }
        </select>
      </div>
    </div>

    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Calle Principal</th>
            <th>Calle Secundaria</th>
            <th>Nro Casa</th>
            <th>Referencia</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          @for (envio of envios; track envio.id) {
            <tr>
              <td>{{ envio.id }}</td>
              <td>{{ envio.callePrincipal }}</td>
              <td>{{ envio.calleSecundaria }}</td>
              <td>{{ envio.nroCasa }}</td>
              <td>{{ envio.referencia }}</td>
              <td>
                <span class="badge" [class]="obtenerClaseEstado(envio.estadoEntrega)">
                  {{ envio.estadoEntrega || 'PENDIENTE' }}
                </span>
              </td>
              <td>
                <select class="form-select form-select-sm"
                        [ngModel]="envio.estadoEntrega"
                        (ngModelChange)="actualizarEstado(envio.id!, $event)">
                  @for (estado of estados; track estado) {
                    <option [value]="estado">{{ estado }}</option>
                  }
                </select>
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="7" class="text-center text-muted">No hay envios registrados</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: []
})
export class AdminEnviosComponent implements OnInit {
  envios: DireccionEntrega[] = [];
  filtroEstado = '';
  estados = Object.values(EstadoEntrega);

  constructor(private envioService: EnvioService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.cargarEnvios();
  }

  cargarEnvios(): void {
    this.envioService.listarTodos().subscribe({
      next: (data) => { this.envios = data; this.cdr.detectChanges(); }
    });
  }

  filtrarPorEstado(): void {
    if (!this.filtroEstado) {
      this.cargarEnvios();
    } else {
      this.envioService.obtenerPorEstado(this.filtroEstado as EstadoEntrega)
        .subscribe({
          next: (data) => { this.envios = data; this.cdr.detectChanges(); }
        });
    }
  }

  actualizarEstado(id: number, nuevoEstado: string): void {
    this.envioService.actualizarEstado(id, nuevoEstado as EstadoEntrega)
      .subscribe(() => { this.cargarEnvios(); });
  }

  obtenerClaseEstado(estado?: string): string {
    switch (estado) {
      case 'ENVIADO': return 'bg-info';
      case 'EN_PROCESO': return 'bg-warning';
      case 'ENTREGADO': return 'bg-success';
      default: return 'bg-secondary';
    }
  }
}
