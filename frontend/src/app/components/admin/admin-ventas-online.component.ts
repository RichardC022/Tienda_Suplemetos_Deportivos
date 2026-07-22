import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CompraService } from '../../core/services/compra.service';
import { ToastService } from '../../core/services/toast.service';
import { PdfService } from '../../core/services/pdf.service';
import { Compra } from '../../models';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-ventas-online',
  standalone: true,
  imports: [FormsModule, DatePipe],
  template: `
    <div class="vm-page">
      <div class="vm-page-header">
        <h2>Ventas en Linea</h2>
        <button class="vm-btn-pdf" (click)="generarPdf()">&#128196; Informe PDF</button>
      </div>

      <div class="vm-filters">
        <input type="text" class="vm-search" placeholder="Buscar por nombre o cedula..."
               [(ngModel)]="terminoBusqueda" (input)="onBuscar()">
        <span class="vm-count">{{ filtradas.length }} registros</span>
      </div>

      <div class="vm-table-wrap">
        <table class="vm-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Metodo Pago</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            @for (c of paginadas; track c.id) {
              <tr>
                <td>{{ c.id }}</td>
                <td>{{ c.fecha | date:'dd/MM/yyyy HH:mm' }}</td>
                <td>{{ c.persona?.nombre || 'Cliente' }}</td>
                <td><span class="vm-badge">{{ c.metodoPago }}</span></td>
                <td class="vm-total-cell">\${{ c.total?.toFixed(2) }}</td>
                <td>
                  <button class="vm-btn-sm vm-btn-danger" (click)="eliminar(c.id!)">Eliminar</button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="6" class="vm-empty-row">No hay ventas en linea registradas</td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      @if (totalPaginas > 1) {
        <div class="vm-pagination">
          <button [disabled]="paginaActual === 1" (click)="irAPagina(paginaActual - 1)">&laquo;</button>
          @for (p of paginasVisibles; track p) {
            <button [class.active]="p === paginaActual" (click)="irAPagina(p)">{{ p }}</button>
          }
          <button [disabled]="paginaActual === totalPaginas" (click)="irAPagina(paginaActual + 1)">&raquo;</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .vm-page { max-width: 1100px; margin: 0 auto; }
    .vm-page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
    .vm-page-header h2 { margin: 0; font-size: 1.4rem; color: var(--text); }
    .vm-btn-pdf { padding: 0.5rem 1rem; background: var(--success, #22c55e); color: #fff; border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem; font-weight: 500; }
    .vm-btn-pdf:hover { opacity: 0.9; }
    .vm-filters { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
    .vm-search { flex: 1; max-width: 360px; padding: 0.55rem 0.75rem; border: 1px solid var(--border, #e0e0e0); border-radius: 6px; font-size: 0.9rem; background: var(--input-bg, #fff); color: var(--text); }
    .vm-search:focus { outline: none; border-color: var(--primary, #2563eb); }
    .vm-count { color: var(--text-secondary); font-size: 0.85rem; }
    .vm-table-wrap { overflow-x: auto; }
    .vm-table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
    .vm-table th { text-align: left; padding: 0.6rem 0.75rem; background: var(--bg-secondary, #f9fafb); color: var(--text-secondary); font-weight: 600; border-bottom: 2px solid var(--border, #e0e0e0); white-space: nowrap; }
    .vm-table td { padding: 0.6rem 0.75rem; border-bottom: 1px solid var(--border, #f0f0f0); color: var(--text); }
    .vm-table tr:hover td { background: var(--hover-bg, #f9fafb); }
    .vm-total-cell { font-weight: 600; color: var(--primary, #2563eb); white-space: nowrap; }
    .vm-badge { display: inline-block; padding: 0.15rem 0.5rem; border-radius: 4px; font-size: 0.8rem; font-weight: 500; background: var(--bg-secondary, #f3f4f6); color: var(--text-secondary); }
    .vm-btn-sm { padding: 0.3rem 0.6rem; border: none; border-radius: 4px; cursor: pointer; font-size: 0.8rem; }
    .vm-btn-danger { background: var(--danger, #ef4444); color: #fff; }
    .vm-btn-danger:hover { opacity: 0.85; }
    .vm-empty-row { text-align: center; padding: 2rem !important; color: var(--text-secondary); }
    .vm-pagination { display: flex; justify-content: center; gap: 0.3rem; margin-top: 1rem; }
    .vm-pagination button { padding: 0.4rem 0.7rem; border: 1px solid var(--border, #e0e0e0); border-radius: 4px; background: var(--card-bg, #fff); color: var(--text); cursor: pointer; font-size: 0.85rem; }
    .vm-pagination button:hover:not(:disabled) { background: var(--bg-secondary, #f3f4f6); }
    .vm-pagination button.active { background: var(--primary, #2563eb); color: #fff; border-color: var(--primary, #2563eb); }
    .vm-pagination button:disabled { opacity: 0.4; cursor: not-allowed; }
  `]
})
export class AdminVentasOnlineComponent implements OnInit {
  todas: Compra[] = [];
  filtradas: Compra[] = [];
  paginadas: Compra[] = [];
  terminoBusqueda = '';
  paginaActual = 1;
  porPagina = 10;
  totalPaginas = 1;
  paginasVisibles: number[] = [];

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
    this.compraService.listarPorTipo('ONLINE').subscribe({
      next: (data) => {
        this.todas = data;
        this.filtradas = [...data];
        this.paginaActual = 1;
        this.actualizarPaginacion();
        this.cdr.detectChanges();
      }
    });
  }

  onBuscar(): void {
    const t = this.terminoBusqueda.toLowerCase().trim();
    if (!t) {
      this.filtradas = [...this.todas];
    } else {
      this.filtradas = this.todas.filter(c =>
        (c.persona?.nombre || '').toLowerCase().includes(t) ||
        (c.persona?.apellido || '').toLowerCase().includes(t) ||
        String(c.id).includes(t)
      );
    }
    this.paginaActual = 1;
    this.actualizarPaginacion();
  }

  actualizarPaginacion(): void {
    this.totalPaginas = Math.max(1, Math.ceil(this.filtradas.length / this.porPagina));
    if (this.paginaActual > this.totalPaginas) this.paginaActual = this.totalPaginas;
    const inicio = (this.paginaActual - 1) * this.porPagina;
    this.paginadas = this.filtradas.slice(inicio, inicio + this.porPagina);
    this.paginasVisibles = [];
    for (let i = Math.max(1, this.paginaActual - 2); i <= Math.min(this.totalPaginas, this.paginaActual + 2); i++) {
      this.paginasVisibles.push(i);
    }
  }

  irAPagina(p: number): void {
    this.paginaActual = p;
    this.actualizarPaginacion();
  }

  generarPdf(): void {
    if (!this.filtradas.length) {
      this.toastService.show('No hay ventas en linea para generar informe', 'error');
      return;
    }
    this.pdfService.informeVentasOnline(this.filtradas);
    this.toastService.show('Informe PDF generado', 'exito');
  }

  eliminar(id: number): void {
    if (confirm('Seguro que desea eliminar esta venta en linea?')) {
      this.compraService.eliminar(id).subscribe({
        next: () => { this.toastService.show('Venta eliminada', 'exito'); this.cargar(); },
        error: () => { this.toastService.show('Error al eliminar', 'error'); }
      });
    }
  }
}
