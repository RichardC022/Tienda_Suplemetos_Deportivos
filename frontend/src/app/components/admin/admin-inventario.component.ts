import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InventarioService } from '../../core/services/inventario.service';
import { ToastService } from '../../core/services/toast.service';
import { PdfService } from '../../core/services/pdf.service';
import { Inventario } from '../../models';

@Component({
  selector: 'app-admin-inventario',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="d-flex align-items-center justify-content-between mb-4">
      <h2>Gestion de Inventario</h2>
      <div class="d-flex gap-2">
        <button class="btn btn-success" (click)="generarPdf()">Informe PDF</button>
        <a routerLink="/admin/inventario/nuevo" class="btn btn-primary">+ Nuevo Registro</a>
      </div>
    </div>

    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Producto</th>
            <th>Stock</th>
            <th>Stock Minimo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          @for (inv of inventarios; track inv.id) {
            <tr>
              <td>{{ inv.id }}</td>
              <td>{{ inv.producto?.nombre || '-' }}</td>
              <td>{{ inv.stock }}</td>
              <td>{{ inv.stockMin }}</td>
              <td>
                @if (inv.stock === 0) {
                  <span class="badge bg-danger">Agotado</span>
                } @else if (inv.stock <= inv.stockMin) {
                  <span class="badge bg-warning">Stock Bajo</span>
                } @else {
                  <span class="badge bg-success">OK</span>
                }
              </td>
              <td>
                <a [routerLink]="['/admin/inventario/editar', inv.id]" class="btn btn-sm btn-warning me-1">
                  Editar
                </a>
                <button class="btn btn-sm btn-danger"
                        (click)="eliminar(inv.id!)">Eliminar</button>
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="6" class="text-center text-muted">No hay registros de inventario</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: []
})
export class AdminInventarioComponent implements OnInit {
  inventarios: Inventario[] = [];

  constructor(
    private inventarioService: InventarioService,
    private toastService: ToastService,
    private pdfService: PdfService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarInventarios();
  }

  cargarInventarios(): void {
    this.inventarioService.listarTodos().subscribe({
      next: (data) => { this.inventarios = data; this.cdr.detectChanges(); }
    });
  }

  generarPdf(): void {
    if (!this.inventarios.length) {
      this.toastService.show('No hay registros para generar informe', 'error');
      return;
    }
    this.pdfService.informeInventario(this.inventarios);
    this.toastService.show('Informe PDF generado', 'exito');
  }

  eliminar(id: number): void {
    if (confirm('Eliminar este registro de inventario?')) {
      this.inventarioService.eliminar(id).subscribe({
        next: () => { this.toastService.show('Registro eliminado', 'exito'); this.cargarInventarios(); },
        error: () => { this.toastService.show('Error al eliminar', 'error'); }
      });
    }
  }
}
