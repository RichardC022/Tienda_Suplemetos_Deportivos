import { Component, OnInit } from '@angular/core';
import { CompraService } from '../../core/services/compra.service';
import { AuthService } from '../../core/services/auth.service';
import { Compra } from '../../models';
import { DatePipe } from '@angular/common';

/*
 * Componente que muestra el historial de compras del usuario autenticado.
 * Se conecta al endpoint GET /api/compras/persona/{id} del backend.
 */
@Component({
  selector: 'app-mis-compras',
  standalone: true,
  imports: [DatePipe],
  template: `
    <h2 class="mb-4">Mis Compras</h2>

    @if (cargando) {
      <div class="text-center py-5">
        <div class="spinner-border text-primary"></div>
      </div>
    }

    @if (!cargando && compras.length === 0) {
      <div class="text-center py-5">
        <h4 class="text-muted">Aún no has realizado ninguna compra</h4>
      </div>
    }

    @if (!cargando && compras.length > 0) {
      <div class="row">
        @for (compra of compras; track compra.id) {
          <div class="col-12 mb-3">
            <div class="card">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <div>
                    <h5 class="card-title">Compra #{{ compra.id }}</h5>
                    <p class="text-muted mb-0">
                      Fecha: {{ compra.fecha | date:'dd/MM/yyyy HH:mm' }}
                    </p>
                    <p class="text-muted mb-0">
                      Método de pago: {{ compra.metodoPago }}
                    </p>
                  </div>
                  <div class="text-end">
                    <h4 class="text-success">\${{ compra.total }}</h4>
                    @if (compra.direccionEntrega) {
                      <span class="badge bg-info">
                        {{ compra.direccionEntrega.estadoEntrega || 'Pendiente' }}
                      </span>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    }
  `
})
export class MisComprasComponent implements OnInit {
  compras: Compra[] = [];
  cargando = true;

  constructor(
    private compraService: CompraService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const usuario = this.authService.getUsuarioStorage();
    if (usuario?.persona?.id) {
      this.compraService.obtenerHistorialPorPersona(usuario.persona.id)
        .subscribe({
          next: (data) => {
            this.compras = data;
            this.cargando = false;
          },
          error: () => {
            this.cargando = false;
          }
        });
    } else {
      this.cargando = false;
    }
  }
}
