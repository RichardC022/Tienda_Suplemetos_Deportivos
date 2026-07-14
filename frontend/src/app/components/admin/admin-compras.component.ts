import { Component, OnInit } from '@angular/core';
import { CompraService } from '../../core/services/compra.service';
import { ToastService } from '../../core/services/toast.service';
import { Compra } from '../../models';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-compras',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="admin-header">
      <h3>Compras</h3>
    </div>

    <div class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Metodo Pago</th>
            <th>Persona</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          @for (compra of compras; track compra.id) {
            <tr>
              <td>{{ compra.id }}</td>
              <td>{{ compra.fecha | date:'dd/MM/yyyy HH:mm' }}</td>
              <td>\${{ compra.total?.toFixed(2) }}</td>
              <td>{{ compra.metodoPago }}</td>
              <td>{{ compra.persona?.nombre || '-' }}</td>
              <td class="table-actions">
                <button class="btn-delete" (click)="eliminar(compra.id!)">Eliminar</button>
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="6" style="text-align:center;">No hay compras</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `
})
export class AdminComprasComponent implements OnInit {
  compras: Compra[] = [];

  constructor(
    private compraService: CompraService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.compraService.listarTodas().subscribe({
      next: (data) => this.compras = data
    });
  }

  eliminar(id: number): void {
    if (confirm('Seguro que deseas eliminar esta compra?')) {
      this.compraService.actualizar(id, { total: 0, metodoPago: '' }).subscribe({
        next: () => { this.toastService.show('Compra eliminada', 'exito'); this.cargar(); },
        error: () => this.toastService.show('Error al eliminar', 'error')
      });
    }
  }
}
