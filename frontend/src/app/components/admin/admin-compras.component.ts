import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CompraService } from '../../core/services/compra.service';
import { ToastService } from '../../core/services/toast.service';
import { PdfService } from '../../core/services/pdf.service';
import { Compra } from '../../models';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-compras',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="d-flex align-items-center justify-content-between mb-4">
      <h2>Gestion de Compras</h2>
      <button class="btn btn-success" (click)="generarPdf()">Informe PDF</button>
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
              <td>
                <button class="btn btn-sm btn-danger" (click)="eliminar(compra.id!)">Eliminar</button>
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="6" class="text-center text-muted">No hay compras registradas</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: []
})
export class AdminComprasComponent implements OnInit {
  compras: Compra[] = [];

  constructor(
    private compraService: CompraService,
    private toastService: ToastService,
    private pdfService: PdfService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.compraService.listarTodas().subscribe({
      next: (data) => { this.compras = data; this.cdr.detectChanges(); }
    });
  }

  generarPdf(): void {
    if (!this.compras.length) {
      this.toastService.show('No hay compras para generar informe', 'error');
      return;
    }
    this.pdfService.informeCompras(this.compras);
    this.toastService.show('Informe PDF generado', 'exito');
  }

  eliminar(id: number): void {
    if (confirm('Seguro que desea eliminar esta compra?')) {
      this.compraService.actualizar(id, { total: 0, metodoPago: '' }).subscribe({
        next: () => { this.toastService.show('Compra eliminada', 'exito'); this.cargar(); },
        error: () => { this.toastService.show('Error al eliminar', 'error'); }
      });
    }
  }
}
