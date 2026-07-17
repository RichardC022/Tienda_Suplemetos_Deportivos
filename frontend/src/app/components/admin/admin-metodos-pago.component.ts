import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MetodoPagoService, MetodoPagoItem } from '../../core/services/metodo-pago.service';
import { TransferenciaConfigService, TransferenciaConfig } from '../../core/services/transferencia-config.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-admin-metodos-pago',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="d-flex align-items-center justify-content-between mb-4">
      <h2>Gestion de Metodos de Pago</h2>
    </div>

    <div class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          @for (metodo of metodos; track metodo.id) {
            <tr>
              <td>{{ metodo.id }}</td>
              <td>{{ metodo.nombre }}</td>
              <td>
                <span class="badge" [class]="metodo.activo ? 'bg-success' : 'bg-danger'">
                  {{ metodo.activo ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td>
                <button class="btn btn-sm me-1"
                        [class]="metodo.activo ? 'btn-warning' : 'btn-success'"
                        (click)="toggleActivo(metodo.id!)">
                  {{ metodo.activo ? 'Desactivar' : 'Activar' }}
                </button>
                @if (metodo.nombre === 'TRANSFERENCIA') {
                  <button class="btn btn-sm btn-info me-1" (click)="mostrarConfigTransferencia = !mostrarConfigTransferencia">
                    Configurar Cuenta
                  </button>
                }
                <button class="btn btn-sm btn-danger" (click)="eliminar(metodo.id!)">Eliminar</button>
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="4" class="text-center text-muted">No hay metodos de pago registrados</td>
            </tr>
          }
        </tbody>
      </table>
    </div>

    @if (mostrarConfigTransferencia) {
      <div class="config-card mt-4">
        <h4 class="mb-3">Configurar Datos de Cuenta Bancaria (Transferencia)</h4>
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label">Banco <span class="text-danger">*</span></label>
            <input type="text" class="form-control" [(ngModel)]="configTransferencia.banco"
                   placeholder="Ej: Banco Pichincha">
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">Titular de la Cuenta <span class="text-danger">*</span></label>
            <input type="text" class="form-control" [(ngModel)]="configTransferencia.titular"
                   placeholder="Ej: Juan Perez">
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">Numero de Cuenta <span class="text-danger">*</span></label>
            <input type="text" class="form-control" [(ngModel)]="configTransferencia.numeroCuenta"
                   placeholder="Ej: 2201234567">
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">Tipo de Cuenta <span class="text-danger">*</span></label>
            <select class="form-select" [(ngModel)]="configTransferencia.tipoCuenta">
              <option value="">Seleccionar...</option>
              <option value="AHORROS">Ahorros</option>
              <option value="CORRIENTE">Corriente</option>
            </select>
          </div>
          <div class="col-md-12 mb-3">
            <label class="form-label">Imagen del QR de Cobro</label>
            <input type="file" class="form-control" accept="image/*" (change)="onQrSelected($event)">
            @if (configTransferencia.qrImageUrl) {
              <div class="mt-2">
                <img [src]="configTransferencia.qrImageUrl" alt="QR Preview" class="qr-preview">
              </div>
            }
          </div>
        </div>
        <button class="btn btn-primary" (click)="guardarConfigTransferencia()">Guardar Configuracion</button>
      </div>
    }

    <div class="mt-4">
      <h5>Agregar Metodo de Pago</h5>
      <div class="d-flex gap-2 mt-2">
        <select class="form-select" style="max-width:300px;" #selectMetodo>
          <option value="">Seleccionar metodo...</option>
          @for (opt of opcionesDisponibles; track opt) {
            <option [value]="opt">{{ opt }}</option>
          }
        </select>
        <button class="btn btn-primary" (click)="agregar(selectMetodo.value); selectMetodo.value = ''">
          Agregar
        </button>
      </div>
    </div>
  `,
  styles: [`
    .config-card {
      background: var(--card-bg, #fff);
      border: 2px solid var(--primary, #4f46e5);
      border-radius: 10px;
      padding: 1.5rem;
    }
    .qr-preview {
      max-width: 200px;
      max-height: 200px;
      border-radius: 8px;
      border: 1px solid var(--border, #e9ecef);
    }
  `]
})
export class AdminMetodosPagoComponent implements OnInit {
  metodos: MetodoPagoItem[] = [];
  opcionesDisponibles: string[] = [];
  mostrarConfigTransferencia = false;

  configTransferencia: TransferenciaConfig = {
    banco: '',
    titular: '',
    numeroCuenta: '',
    tipoCuenta: '',
    qrImageUrl: ''
  };

  private readonly TODAS_OPCIONES = ['EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'PAYPAL', 'CRYPTO', 'CHEQUE'];

  constructor(
    private metodoPagoService: MetodoPagoService,
    private transferenciaConfigService: TransferenciaConfigService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargar();
    const saved = this.transferenciaConfigService.getConfig();
    if (saved) {
      this.configTransferencia = saved;
    }
  }

  cargar(): void {
    this.metodos = this.metodoPagoService.listarTodos();
    this.opcionesDisponibles = this.TODAS_OPCIONES.filter(
      opt => !this.metodos.some(m => m.nombre === opt)
    );
    this.cdr.detectChanges();
  }

  agregar(nombre: string): void {
    if (!nombre) {
      this.toastService.show('Seleccione un metodo de pago', 'error');
      return;
    }
    this.metodoPagoService.guardar({ nombre, activo: true });
    this.toastService.show('Metodo de pago agregado', 'exito');
    this.cargar();
  }

  toggleActivo(id: number): void {
    this.metodoPagoService.toggleActivo(id);
    this.toastService.show('Estado actualizado', 'exito');
    this.cargar();
  }

  eliminar(id: number): void {
    if (confirm('Eliminar este metodo de pago?')) {
      this.metodoPagoService.eliminar(id);
      this.toastService.show('Metodo de pago eliminado', 'exito');
      this.cargar();
    }
  }

  onQrSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.configTransferencia.qrImageUrl = reader.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  guardarConfigTransferencia(): void {
    if (!this.configTransferencia.banco.trim() || !this.configTransferencia.titular.trim() ||
        !this.configTransferencia.numeroCuenta.trim() || !this.configTransferencia.tipoCuenta) {
      this.toastService.show('Complete todos los campos obligatorios de la cuenta bancaria', 'error');
      return;
    }
    this.transferenciaConfigService.saveConfig(this.configTransferencia);
    this.toastService.show('Configuracion de transferencia guardada', 'exito');
  }
}
