import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MetodoPagoService, MetodoPagoItem } from '../../core/services/metodo-pago.service';
import {
  TransferenciaConfigService,
  CuentaTransferencia,
  TipoEntidad,
  BANCOS_ECUADOR,
  COOPERATIVAS_ECUADOR
} from '../../core/services/transferencia-config.service';
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
                    Configurar Cuentas
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
        <h4 class="mb-3">Configurar Cuentas de Transferencia</h4>

        @if (cuentas.length > 0) {
          <div class="mb-4">
            <h6 class="mb-3">Cuentas Configuradas</h6>
            <div class="row">
              @for (cuenta of cuentas; track cuenta.id) {
                <div class="col-md-6 mb-3">
                  <div class="cuenta-card" [class.banco]="cuenta.tipoEntidad === 'BANCO'"
                       [class.cooperativa]="cuenta.tipoEntidad === 'COOPERATIVA'">
                    <div class="cuenta-header">
                      <span class="badge-tipo" [class.badge-banco]="cuenta.tipoEntidad === 'BANCO'"
                            [class.badge-cooperativa]="cuenta.tipoEntidad === 'COOPERATIVA'">
                        {{ cuenta.tipoEntidad === 'BANCO' ? 'Banco' : 'Cooperativa' }}
                      </span>
                      <div class="cuenta-acciones">
                        <button class="btn btn-sm btn-outline-primary" (click)="editarCuenta(cuenta)">Editar</button>
                        <button class="btn btn-sm btn-outline-danger" (click)="eliminarCuenta(cuenta.id)">Eliminar</button>
                      </div>
                    </div>
                    <div class="cuenta-body">
                      <div class="dato-linea">
                        <span class="dato-label">Entidad:</span>
                        <span class="dato-valor">{{ cuenta.nombreEntidad }}</span>
                      </div>
                      <div class="dato-linea">
                        <span class="dato-label">Cedula:</span>
                        <span class="dato-valor">{{ cuenta.cedula }}</span>
                      </div>
                      <div class="dato-linea">
                        <span class="dato-label">Titular:</span>
                        <span class="dato-valor">{{ cuenta.titular }}</span>
                      </div>
                      <div class="dato-linea">
                        <span class="dato-label">Cuenta:</span>
                        <span class="dato-valor">{{ cuenta.numeroCuenta }}</span>
                      </div>
                      <div class="dato-linea">
                        <span class="dato-label">Tipo:</span>
                        <span class="dato-valor">{{ cuenta.tipoCuenta }}</span>
                      </div>
                      @if (cuenta.qrImageUrl) {
                        <div class="mt-2">
                          <img [src]="cuenta.qrImageUrl" alt="QR" class="qr-mini">
                        </div>
                      }
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
          <hr>
        }

        <div class="mt-3">
          <h5>{{ cuentaEditandoId ? 'Editar Cuenta' : 'Agregar Nueva Cuenta' }}</h5>
          <div class="row mt-3">
            <div class="col-md-6 mb-3">
              <label class="form-label">Tipo de Entidad <span class="text-danger">*</span></label>
              <select class="form-select" [(ngModel)]="nuevaCuenta.tipoEntidad"
                      (ngModelChange)="onTipoEntidadChange()" autocomplete="off">
                <option value="">Seleccionar...</option>
                <option value="BANCO">Banco</option>
                <option value="COOPERATIVA">Cooperativa</option>
              </select>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Nombre de la Entidad <span class="text-danger">*</span></label>
              <input type="text" class="form-control" [(ngModel)]="nuevaCuenta.nombreEntidad"
                     [placeholder]="nuevaCuenta.tipoEntidad === 'BANCO' ? 'Ej: Banco Pichincha' : nuevaCuenta.tipoEntidad === 'COOPERATIVA' ? 'Ej: Cooperativa JEP' : 'Primero seleccione el tipo'"
                     [disabled]="!nuevaCuenta.tipoEntidad"
                     [attr.list]="nuevaCuenta.tipoEntidad ? 'entidadesList' : null"
                     autocomplete="off">
              <datalist id="entidadesList">
                @for (ent of entidadesDisponibles; track ent) {
                  <option [value]="ent">{{ ent }}</option>
                }
              </datalist>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Cedula del Titular <span class="text-danger">*</span></label>
              <input type="text" class="form-control"
                     [class.is-invalid]="cedulaCuentaError"
                     [class.is-valid]="nuevaCuenta.cedula && !cedulaCuentaError"
                     [(ngModel)]="nuevaCuenta.cedula"
                     (ngModelChange)="validarCedulaCuenta()"
                     placeholder="Ej: 1234567890" maxlength="10" autocomplete="off">
              @if (cedulaCuentaError) {
                <div class="invalid-feedback">{{ cedulaCuentaError }}</div>
              }
              @if (nuevaCuenta.cedula && !cedulaCuentaError) {
                <div class="valid-feedback">Cedula valida</div>
              }
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Titular de la Cuenta <span class="text-danger">*</span></label>
              <input type="text" class="form-control" [(ngModel)]="nuevaCuenta.titular"
                     placeholder="Ej: Juan Perez" autocomplete="off">
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Numero de Cuenta <span class="text-danger">*</span></label>
              <input type="text" class="form-control" [(ngModel)]="nuevaCuenta.numeroCuenta"
                     placeholder="Ej: 2201234567" autocomplete="off">
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Tipo de Cuenta <span class="text-danger">*</span></label>
              <select class="form-select" [(ngModel)]="nuevaCuenta.tipoCuenta" autocomplete="off">
                <option value="">Seleccionar...</option>
                <option value="AHORROS">Ahorros</option>
                <option value="CORRIENTE">Corriente</option>
              </select>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Imagen del QR de Cobro</label>
              <input type="file" class="form-control" accept="image/*" (change)="onQrSelected($event)" autocomplete="off">
              @if (nuevaCuenta.qrImageUrl) {
                <div class="mt-2">
                  <img [src]="nuevaCuenta.qrImageUrl" alt="QR Preview" class="qr-preview">
                </div>
              }
            </div>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-primary" (click)="guardarCuenta()">
              {{ cuentaEditandoId ? 'Actualizar Cuenta' : 'Agregar Cuenta' }}
            </button>
            @if (cuentaEditandoId) {
              <button class="btn btn-outline-secondary" (click)="cancelarEdicion()">Cancelar Edicion</button>
            }
          </div>
        </div>
      </div>
    }

    <div class="mt-4">
      <h5>Agregar Metodo de Pago</h5>
      <div class="d-flex gap-2 mt-2">
        <select class="form-select" style="max-width:300px;" #selectMetodo autocomplete="off">
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
    .cuenta-card {
      border: 1px solid var(--border, #e9ecef);
      border-radius: 10px;
      padding: 1rem;
      background: var(--bg-secondary, #f8f9fa);
      transition: box-shadow 0.2s;
    }
    .cuenta-card:hover {
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .cuenta-card.banco {
      border-left: 4px solid #0d6efd;
    }
    .cuenta-card.cooperativa {
      border-left: 4px solid #198754;
    }
    .cuenta-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    .badge-tipo {
      padding: 0.25rem 0.6rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .badge-banco {
      background: #0d6efd;
      color: #fff;
    }
    .badge-cooperativa {
      background: #198754;
      color: #fff;
    }
    .cuenta-acciones {
      display: flex;
      gap: 0.3rem;
    }
    .cuenta-body {
      font-size: 0.9rem;
    }
    .dato-linea {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 0.2rem;
    }
    .dato-label {
      font-weight: 600;
      color: var(--text-secondary, #666);
      min-width: 70px;
    }
    .dato-valor {
      color: var(--text-primary, #333);
    }
    .qr-preview {
      max-width: 150px;
      max-height: 150px;
      border-radius: 8px;
      border: 1px solid var(--border, #e9ecef);
    }
    .qr-mini {
      max-width: 100px;
      max-height: 100px;
      border-radius: 6px;
      border: 1px solid var(--border, #e9ecef);
    }
    .valid-feedback { color: #198754; font-size: 0.85rem; margin-top: 0.25rem; }
  `]
})
export class AdminMetodosPagoComponent implements OnInit {
  metodos: MetodoPagoItem[] = [];
  opcionesDisponibles: string[] = [];
  mostrarConfigTransferencia = false;
  cuentas: CuentaTransferencia[] = [];
  cuentaEditandoId: string | null = null;
  cedulaCuentaError = '';

  nuevaCuenta: CuentaTransferencia = this.crearCuentaVacia();

  entidadesDisponibles: string[] = [];

  private readonly TODAS_OPCIONES = ['EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'PAYPAL', 'CRYPTO', 'CHEQUE'];

  constructor(
    private metodoPagoService: MetodoPagoService,
    private transferenciaConfigService: TransferenciaConfigService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargar();
    this.cargarCuentas();
  }

  cargar(): void {
    this.metodos = this.metodoPagoService.listarTodos();
    this.opcionesDisponibles = this.TODAS_OPCIONES.filter(
      opt => !this.metodos.some(m => m.nombre === opt)
    );
    this.cdr.detectChanges();
  }

  cargarCuentas(): void {
    this.cuentas = this.transferenciaConfigService.listarCuentas();
    this.cdr.detectChanges();
  }

  onTipoEntidadChange(): void {
    if (this.nuevaCuenta.tipoEntidad === 'BANCO') {
      this.entidadesDisponibles = BANCOS_ECUADOR;
    } else if (this.nuevaCuenta.tipoEntidad === 'COOPERATIVA') {
      this.entidadesDisponibles = COOPERATIVAS_ECUADOR;
    } else {
      this.entidadesDisponibles = [];
    }
  }

  guardarCuenta(): void {
    if (!this.nuevaCuenta.tipoEntidad) {
      this.toastService.show('Seleccione el tipo de entidad (Banco o Cooperativa)', 'error');
      return;
    }
    if (!this.nuevaCuenta.nombreEntidad.trim()) {
      this.toastService.show('Ingrese el nombre de la entidad', 'error');
      return;
    }
    this.validarCedulaCuenta();
    if (this.cedulaCuentaError) {
      this.toastService.show('Ingrese una cedula valida', 'error');
      return;
    }
    if (!this.nuevaCuenta.titular.trim()) {
      this.toastService.show('Ingrese el titular de la cuenta', 'error');
      return;
    }
    if (!this.nuevaCuenta.numeroCuenta.trim()) {
      this.toastService.show('Ingrese el numero de cuenta', 'error');
      return;
    }
    if (!this.nuevaCuenta.tipoCuenta) {
      this.toastService.show('Seleccione el tipo de cuenta', 'error');
      return;
    }

    if (this.cuentaEditandoId) {
      this.nuevaCuenta.id = this.cuentaEditandoId;
    }

    this.transferenciaConfigService.guardarCuenta({ ...this.nuevaCuenta });
    this.toastService.show(
      this.cuentaEditandoId ? 'Cuenta actualizada correctamente' : 'Cuenta agregada correctamente',
      'exito'
    );
    this.cancelarEdicion();
    this.cargarCuentas();
  }

  editarCuenta(cuenta: CuentaTransferencia): void {
    this.cuentaEditandoId = cuenta.id;
    this.nuevaCuenta = {
      id: cuenta.id,
      tipoEntidad: cuenta.tipoEntidad,
      nombreEntidad: cuenta.nombreEntidad,
      cedula: cuenta.cedula || '',
      titular: cuenta.titular,
      numeroCuenta: cuenta.numeroCuenta,
      tipoCuenta: cuenta.tipoCuenta,
      qrImageUrl: cuenta.qrImageUrl
    };
    this.cedulaCuentaError = '';
    this.onTipoEntidadChange();
    this.cdr.detectChanges();
  }

  cancelarEdicion(): void {
    this.cuentaEditandoId = null;
    this.nuevaCuenta = this.crearCuentaVacia();
    this.cedulaCuentaError = '';
    this.entidadesDisponibles = [];
  }

  eliminarCuenta(id: string): void {
    if (confirm('Eliminar esta cuenta de transferencia?')) {
      this.transferenciaConfigService.eliminarCuenta(id);
      this.toastService.show('Cuenta eliminada', 'exito');
      if (this.cuentaEditandoId === id) {
        this.cancelarEdicion();
      }
      this.cargarCuentas();
    }
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
      this.nuevaCuenta.qrImageUrl = reader.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  validarCedulaCuenta(): void {
    this.cedulaCuentaError = '';
    const cedula = this.nuevaCuenta.cedula.trim();
    if (!cedula) {
      this.cedulaCuentaError = 'La cedula es obligatoria';
      return;
    }
    if (!/^\d+$/.test(cedula)) {
      this.cedulaCuentaError = 'Solo debe contener numeros';
      return;
    }
    if (cedula.length !== 10) {
      this.cedulaCuentaError = 'Debe tener exactamente 10 digitos';
      return;
    }
    const prov = parseInt(cedula.substring(0, 2), 10);
    if ((prov < 1 || prov > 24) && prov !== 30) {
      this.cedulaCuentaError = 'Provincia invalida (01-24, 30)';
      return;
    }
    if (parseInt(cedula.charAt(2), 10) > 6) {
      this.cedulaCuentaError = 'Tercer digito debe ser 0-6';
      return;
    }
    if (!this.algoritmoModulo10Cuenta(cedula)) {
      this.cedulaCuentaError = 'Digito verificador incorrecto';
      return;
    }
  }

  private algoritmoModulo10Cuenta(cedula: string): boolean {
    const coef = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    let suma = 0;
    for (let i = 0; i < 9; i++) {
      let d = parseInt(cedula.charAt(i), 10) * coef[i];
      if (d > 9) d -= 9;
      suma += d;
    }
    const residuo = suma % 10;
    const verificador = residuo === 0 ? 0 : 10 - residuo;
    return verificador === parseInt(cedula.charAt(9), 10);
  }

  private crearCuentaVacia(): CuentaTransferencia {
    return {
      id: '',
      tipoEntidad: '' as TipoEntidad,
      nombreEntidad: '',
      cedula: '',
      titular: '',
      numeroCuenta: '',
      tipoCuenta: '',
      qrImageUrl: ''
    };
  }
}
