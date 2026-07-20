import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CarritoService, CarritoItem } from '../../core/services/carrito.service';
import { AuthService } from '../../core/services/auth.service';
import { EnvioService } from '../../core/services/envio.service';
import { MetodoPagoService } from '../../core/services/metodo-pago.service';
import {
  TransferenciaConfigService,
  CuentaTransferencia
} from '../../core/services/transferencia-config.service';
import { ToastService } from '../../core/services/toast.service';
import { DireccionEntrega } from '../../models';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="section">
      <h2 class="mb-4">Finalizar Compra</h2>

      @if (items.length === 0) {
        <div class="text-center py-5">
          <h4 class="text-muted">No tienes productos en el carrito</h4>
          <a routerLink="/catalogo" class="btn-carrito mt-3" style="display:inline-block;">Ir al Catalogo</a>
        </div>
      } @else {
        <div class="row">
          <div class="col-md-7">
            <!-- Datos de Facturacion -->
            <div class="checkout-card mb-4">
              <h4 class="mb-3">Datos de Facturacion</h4>
              <div class="mb-3">
                <label class="form-label">Tipo de Documento <span class="text-danger">*</span></label>
                <div class="d-flex gap-3">
                  <label class="doc-type-option" [class.selected]="tipoDocumento === 'CEDULA'">
                    <input type="radio" name="tipoDoc" value="CEDULA"
                           [(ngModel)]="tipoDocumento" (ngModelChange)="onTipoDocumentoChange()" class="d-none">
                    <span>Cedula</span>
                  </label>
                  <label class="doc-type-option" [class.selected]="tipoDocumento === 'PASAPORTE'">
                    <input type="radio" name="tipoDoc" value="PASAPORTE"
                           [(ngModel)]="tipoDocumento" (ngModelChange)="onTipoDocumentoChange()" class="d-none">
                    <span>Pasaporte</span>
                  </label>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">
                  {{ tipoDocumento === 'CEDULA' ? 'Cedula' : 'Pasaporte' }}
                  <span class="text-danger">*</span>
                </label>
                <input [type]="tipoDocumento === 'CEDULA' ? 'tel' : 'text'"
                       class="form-control"
                       [class.is-invalid]="documentoError"
                       [class.is-valid]="documento && !documentoError"
                       [(ngModel)]="documento"
                       (ngModelChange)="validarDocumento()"
                       [placeholder]="tipoDocumento === 'CEDULA' ? 'Ej: 1234567890' : 'Ej: ABC123456'"
                       [maxlength]="tipoDocumento === 'CEDULA' ? 10 : 20" autocomplete="off" required>
                @if (documentoError) {
                  <div class="invalid-feedback">{{ documentoError }}</div>
                }
                @if (documento && !documentoError && !verificandoDoc) {
                  <div class="valid-feedback">Documento valido</div>
                }
              </div>
            </div>

            <!-- Direccion de Entrega -->
            <div class="checkout-card mb-4">
              <h4 class="mb-3">Direccion de Entrega</h4>
              <div class="mb-3">
                <label class="form-label">Calle Principal <span class="text-danger">*</span></label>
                <input type="text" class="form-control" [(ngModel)]="direccion.callePrincipal"
                       placeholder="Ej: Av. Principal" autocomplete="off" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Calle Secundaria <span class="text-danger">*</span></label>
                <input type="text" class="form-control" [(ngModel)]="direccion.callleSecundaria"
                       placeholder="Ej: Calle 5" autocomplete="off" required>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Numero de Casa <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" [(ngModel)]="direccion.nroCasa"
                         placeholder="Ej: 1234" autocomplete="off" required>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Referencia <span class="text-danger">*</span></label>
                <input type="text" class="form-control" [(ngModel)]="direccion.referencia"
                       placeholder="Ej: Frente al parque" autocomplete="off" required>
              </div>
            </div>

            <!-- Metodo de Pago -->
            <div class="checkout-card mb-4">
              <h4 class="mb-3">Metodo de Pago <span class="text-danger">*</span></h4>
              <div class="d-flex flex-wrap gap-3">
                @for (metodo of metodosDisponibles; track metodo.id) {
                  <label class="metodo-pago-option" [class.selected]="metodoSeleccionado === metodo.nombre">
                    <input type="radio" name="metodoPago" [value]="metodo.nombre"
                           [(ngModel)]="metodoSeleccionado" class="d-none">
                    <span class="metodo-pago-label">{{ metodo.nombre }}</span>
                  </label>
                }
              </div>

              <!-- EFECTIVO -->
              @if (metodoSeleccionado === 'EFECTIVO') {
                <div class="pago-info mt-3">
                  <div class="pago-mensaje efectivo">
                    <span class="pago-icono">&#128176;</span>
                    <div>
                      <strong>Pago en Efectivo</strong>
                      <p class="mb-0">Pagaras en efectivo al momento de retirar el pedido.</p>
                    </div>
                  </div>
                </div>
              }

              <!-- TARJETA -->
              @if (metodoSeleccionado === 'TARJETA') {
                <div class="pago-info mt-3">
                  <div class="pago-mensaje tarjeta">
                    <span class="pago-icono">&#128179;</span>
                    <div>
                      <strong>Pago con Tarjeta</strong>
                      <p class="mb-0">Funcionalidad proximamente.</p>
                    </div>
                  </div>
                </div>
              }

              <!-- TRANSFERENCIA -->
              @if (metodoSeleccionado === 'TRANSFERENCIA') {
                <div class="pago-info mt-3">
                  @if (cuentasTransferencia.length > 0) {
                    <!-- Selector de entidad financiera -->
                    <div class="mb-3">
                      <label class="form-label"><strong>Selecciona la entidad financiera <span class="text-danger">*</span></strong></label>
                      <select class="form-select" [(ngModel)]="cuentaSeleccionadaId" (ngModelChange)="onCuentaSeleccionada()">
                        <option value="">-- Seleccionar banco o cooperativa --</option>
                        @if (bancos.length > 0) {
                          <optgroup label="Bancos">
                            @for (b of bancos; track b.id) {
                              <option [value]="b.id">{{ b.nombreEntidad }} - {{ b.numeroCuenta }}</option>
                            }
                          </optgroup>
                        }
                        @if (cooperativas.length > 0) {
                          <optgroup label="Cooperativas">
                            @for (c of cooperativas; track c.id) {
                              <option [value]="c.id">{{ c.nombreEntidad }} - {{ c.numeroCuenta }}</option>
                            }
                          </optgroup>
                        }
                      </select>
                    </div>

                    <!-- Datos de la cuenta seleccionada -->
                    @if (cuentaSeleccionada) {
                      <div class="transferencia-datos">
                        <div class="entidad-badge mb-2">
                          <span class="badge-tipo" [class.badge-banco]="cuentaSeleccionada.tipoEntidad === 'BANCO'"
                                [class.badge-cooperativa]="cuentaSeleccionada.tipoEntidad === 'COOPERATIVA'">
                            {{ cuentaSeleccionada.tipoEntidad === 'BANCO' ? 'Banco' : 'Cooperativa' }}
                          </span>
                          <strong class="ms-2">{{ cuentaSeleccionada.nombreEntidad }}</strong>
                        </div>
                        <h5>Datos de la Cuenta</h5>
                        <div class="datos-bancarios">
                          <div class="dato-item">
                            <span class="dato-label">Titular:</span>
                            <span class="dato-valor">{{ cuentaSeleccionada.titular }}</span>
                          </div>
                          @if (cuentaSeleccionada.cedula) {
                            <div class="dato-item">
                              <span class="dato-label">Cedula:</span>
                              <span class="dato-valor">{{ cuentaSeleccionada.cedula }}</span>
                            </div>
                          }
                          <div class="dato-item">
                            <span class="dato-label">Cuenta:</span>
                            <span class="dato-valor">{{ cuentaSeleccionada.numeroCuenta }}</span>
                          </div>
                          <div class="dato-item">
                            <span class="dato-label">Tipo:</span>
                            <span class="dato-valor">{{ cuentaSeleccionada.tipoCuenta }}</span>
                          </div>
                        </div>
                        @if (cuentaSeleccionada.qrImageUrl) {
                          <div class="qr-section mt-3">
                            <p class="mb-2"><strong>Escanea el QR para transferir:</strong></p>
                            <img [src]="cuentaSeleccionada.qrImageUrl" alt="QR de cobro" class="qr-image">
                          </div>
                        }
                        <hr>
                        <div class="mt-3">
                          <label class="form-label"><strong>Subir comprobante de transferencia <span class="text-danger">*</span></strong></label>
                          <input type="file" class="form-control" accept="image/*" (change)="onComprobanteSelected($event)">
                          @if (comprobantePreview) {
                            <div class="mt-2">
                              <img [src]="comprobantePreview" alt="Comprobante" class="comprobante-preview">
                            </div>
                          }
                        </div>
                      </div>
                    }
                  } @else {
                    <div class="pago-mensaje">
                      <p class="mb-0 text-muted">No hay cuentas de transferencia configuradas. Contacte al administrador.</p>
                    </div>
                  }
                </div>
              }

              <!-- PAYPAL -->
              @if (metodoSeleccionado === 'PAYPAL') {
                <div class="pago-info mt-3">
                  <div class="pago-mensaje paypal">
                    <span class="pago-icono">&#127760;</span>
                    <div>
                      <strong>Pago con PayPal</strong>
                      <p class="mb-0">Seras redirigido a PayPal para completar el pago de forma segura.</p>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Resumen -->
          <div class="col-md-5">
            <div class="checkout-card sticky-top" style="top: 100px;">
              <h4 class="mb-3">Resumen del Pedido</h4>
              @for (item of items; track item.producto.id) {
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <div>
                    <span>{{ item.producto.nombre }}</span>
                    <small class="text-muted"> x{{ item.cantidad }}</small>
                  </div>
                  <span>\${{ (item.producto.precio * item.cantidad).toFixed(2) }}</span>
                </div>
              }
              <hr>
              <div class="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <span>\${{ total.toFixed(2) }}</span>
              </div>
              <div class="d-flex justify-content-between mb-3" style="font-size:1.2rem; font-weight:700;">
                <span>Total</span>
                <span style="color:var(--primary-dark);">\${{ total.toFixed(2) }}</span>
              </div>

              @if (metodoSeleccionado === 'PAYPAL') {
                <button class="btn-paypal w-100" style="padding:0.9rem;" (click)="pagarPayPal()"
                        [disabled]="procesando">
                  Pagar con PayPal
                </button>
              } @else {
                <button class="btn-checkout w-100" style="padding:0.9rem;" (click)="confirmarCompra()"
                        [disabled]="procesando || !puedeConfirmar()">
                  {{ procesando ? 'Procesando...' : 'Confirmar Pedido' }}
                </button>
              }
              <a routerLink="/carrito" class="btn btn-outline-secondary w-100 mt-2">Volver al Carrito</a>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .checkout-card {
      background: var(--card-bg, #fff);
      border: 1px solid var(--border, #e9ecef);
      border-radius: 10px;
      padding: 1.5rem;
    }
    .doc-type-option {
      display: inline-flex; align-items: center; justify-content: center;
      padding: 0.7rem 1.5rem; border: 2px solid var(--border, #e9ecef);
      border-radius: 8px; cursor: pointer; transition: all 0.2s;
      min-width: 120px; font-weight: 600;
    }
    .doc-type-option:hover { border-color: var(--primary, #4f46e5); }
    .doc-type-option.selected { border-color: var(--primary, #4f46e5); background: var(--primary-light, #eef2ff); }
    .metodo-pago-option {
      display: inline-flex; align-items: center; justify-content: center;
      padding: 0.8rem 1.5rem; border: 2px solid var(--border, #e9ecef);
      border-radius: 8px; cursor: pointer; transition: all 0.2s;
      min-width: 130px; text-align: center;
    }
    .metodo-pago-option:hover { border-color: var(--primary, #4f46e5); }
    .metodo-pago-option.selected { border-color: var(--primary, #4f46e5); background: var(--primary-light, #eef2ff); }
    .metodo-pago-label { font-weight: 600; font-size: 0.9rem; }
    .valid-feedback { color: #198754; font-size: 0.85rem; margin-top: 0.25rem; }

    .pago-info { margin-top: 0.5rem; }
    .pago-mensaje {
      display: flex; align-items: flex-start; gap: 0.8rem;
      padding: 1rem; border-radius: 8px;
      background: var(--bg-secondary, #f8f9fa);
      border: 1px solid var(--border, #e9ecef);
    }
    .pago-mensaje.efectivo { border-left: 4px solid #198754; }
    .pago-mensaje.tarjeta { border-left: 4px solid #6c757d; }
    .pago-mensaje.paypal { border-left: 4px solid #003087; }
    .pago-icono { font-size: 1.8rem; line-height: 1; }
    .pago-mensaje p { font-size: 0.9rem; color: var(--text-secondary, #666); margin-top: 0.25rem; }

    .entidad-badge {
      display: flex;
      align-items: center;
      padding: 0.5rem 0.8rem;
      background: var(--bg-secondary, #f8f9fa);
      border-radius: 8px;
      border: 1px solid var(--border, #e9ecef);
    }
    .badge-tipo {
      padding: 0.2rem 0.5rem;
      border-radius: 15px;
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .badge-banco { background: #0d6efd; color: #fff; }
    .badge-cooperativa { background: #198754; color: #fff; }

    .transferencia-datos { padding: 0.5rem 0; }
    .transferencia-datos h5 { color: var(--primary-dark, #3730a3); margin-bottom: 1rem; }
    .datos-bancarios { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem 1rem; }
    .dato-item { display: flex; gap: 0.5rem; }
    .dato-label { font-weight: 600; color: var(--text-secondary, #666); }
    .dato-valor { color: var(--text-primary, #333); }
    .qr-image { max-width: 220px; border-radius: 8px; border: 1px solid var(--border, #e9ecef); }
    .comprobante-preview { max-width: 300px; max-height: 200px; border-radius: 8px; border: 1px solid var(--border, #e9ecef); }
    .btn-paypal {
      background: #ffc439; color: #003087; border: none; border-radius: 8px;
      font-weight: 700; font-size: 1rem; cursor: pointer; transition: background 0.2s;
    }
    .btn-paypal:hover { background: #f0b72a; }
    .btn-paypal:disabled { opacity: 0.6; cursor: not-allowed; }
  `]
})
export class CheckoutComponent implements OnInit {
  items: CarritoItem[] = [];
  total = 0;
  procesando = false;

  tipoDocumento = 'CEDULA';
  documento = '';
  documentoError = '';
  verificandoDoc = false;

  direccion: DireccionEntrega = {
    callePrincipal: '',
    callleSecundaria: '',
    nroCasa: '',
    referencia: ''
  };
  metodoSeleccionado = '';
  metodosDisponibles: { id?: number; nombre: string; activo: boolean }[] = [];

  cuentasTransferencia: CuentaTransferencia[] = [];
  bancos: CuentaTransferencia[] = [];
  cooperativas: CuentaTransferencia[] = [];
  cuentaSeleccionadaId = '';
  cuentaSeleccionada: CuentaTransferencia | null = null;

  comprobanteFile: File | null = null;
  comprobantePreview: string | null = null;

  constructor(
    private carritoService: CarritoService,
    private authService: AuthService,
    private envioService: EnvioService,
    private metodoPagoService: MetodoPagoService,
    private transferenciaConfigService: TransferenciaConfigService,
    private toastService: ToastService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carritoService.carrito$.subscribe(items => {
      this.items = items;
      this.total = this.carritoService.calcularTotal();
      this.cdr.detectChanges();
    });
    this.metodosDisponibles = this.metodoPagoService.listarActivos();
    if (this.metodosDisponibles.length && !this.metodoSeleccionado) {
      this.metodoSeleccionado = this.metodosDisponibles[0].nombre;
    }
    this.cargarCuentasTransferencia();
  }

  cargarCuentasTransferencia(): void {
    this.cuentasTransferencia = this.transferenciaConfigService.listarCuentas();
    this.bancos = this.cuentasTransferencia.filter(c => c.tipoEntidad === 'BANCO');
    this.cooperativas = this.cuentasTransferencia.filter(c => c.tipoEntidad === 'COOPERATIVA');
  }

  onCuentaSeleccionada(): void {
    if (this.cuentaSeleccionadaId) {
      this.cuentaSeleccionada = this.cuentasTransferencia.find(c => c.id === this.cuentaSeleccionadaId) || null;
    } else {
      this.cuentaSeleccionada = null;
    }
    this.cdr.detectChanges();
  }

  onTipoDocumentoChange(): void {
    this.documento = '';
    this.documentoError = '';
  }

  puedeConfirmar(): boolean {
    if (!this.tipoDocumento) return false;
    if (!this.documento || this.documentoError || this.verificandoDoc) return false;
    if (!this.direccion.callePrincipal.trim() || !this.direccion.callleSecundaria.trim() ||
        !this.direccion.nroCasa.trim() || !this.direccion.referencia.trim()) return false;
    if (!this.metodoSeleccionado) return false;
    if (this.metodoSeleccionado === 'TRANSFERENCIA') {
      if (!this.cuentaSeleccionadaId || !this.comprobanteFile) return false;
    }
    return true;
  }

  onComprobanteSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.comprobanteFile = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.comprobantePreview = reader.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(this.comprobanteFile);
  }

  validarDocumento(): void {
    this.documentoError = '';
    if (!this.documento.trim()) {
      this.documentoError = 'El documento es obligatorio';
      return;
    }
    if (this.tipoDocumento === 'CEDULA') {
      this.validarCedula();
    } else {
      this.validarPasaporte();
    }
  }

  private validarCedula(): void {
    const cedula = this.documento.trim();
    if (!/^\d+$/.test(cedula)) { this.documentoError = 'Solo debe contener numeros'; return; }
    if (cedula.length !== 10) { this.documentoError = 'Debe tener exactamente 10 digitos'; return; }
    const prov = parseInt(cedula.substring(0, 2), 10);
    if ((prov < 1 || prov > 24) && prov !== 30) { this.documentoError = 'Provincia invalida (01-24, 30)'; return; }
    if (parseInt(cedula.charAt(2), 10) > 6) { this.documentoError = 'Tercer digito debe ser 0-6'; return; }
    if (!this.algoritmoModulo10(cedula)) { this.documentoError = 'Digito verificador incorrecto'; return; }
    this.verificarDocumentoExistente(cedula);
  }

  private algoritmoModulo10(cedula: string): boolean {
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

  private validarPasaporte(): void {
    const pas = this.documento.trim();
    if (pas.length < 6 || pas.length > 20) { this.documentoError = 'Entre 6 y 20 caracteres'; return; }
    if (!/^[A-Za-z0-9]+$/.test(pas)) { this.documentoError = 'Solo letras y numeros'; return; }
    this.documento = pas.toUpperCase();
    this.verificarDocumentoExistente(this.documento);
  }

  private verificarDocumentoExistente(doc: string): void {
    this.verificandoDoc = true;
    this.authService.verificarDocumento(doc).subscribe({
      next: (res) => {
        this.verificandoDoc = false;
        if (res.existe) this.documentoError = 'Este documento ya esta registrado';
        this.cdr.detectChanges();
      },
      error: () => { this.verificandoDoc = false; this.cdr.detectChanges(); }
    });
  }

  confirmarCompra(): void {
    const usuario = this.authService.getUsuarioStorage();
    if (!usuario) { this.toastService.show('Debes iniciar sesion', 'error'); this.router.navigate(['/login']); return; }

    if (!this.tipoDocumento || !this.documento.trim() || this.documentoError || this.verificandoDoc ||
        !this.direccion.callePrincipal.trim() || !this.direccion.callleSecundaria.trim() ||
        !this.direccion.nroCasa.trim() || !this.direccion.referencia.trim() ||
        !this.metodoSeleccionado) {
      this.toastService.show('Complete todos los campos', 'error'); return;
    }

    if (this.metodoSeleccionado === 'TRANSFERENCIA') {
      if (!this.cuentaSeleccionadaId || !this.comprobanteFile) {
        this.toastService.show('Complete todos los campos', 'error'); return;
      }
    }

    this.procesando = true;

    this.envioService.guardar({ ...this.direccion, estadoEntrega: 'EN_PROCESO' as any }).subscribe({
      next: (dirGuardada) => {
        const compra: any = {
          fecha: new Date().toISOString(),
          total: this.total,
          metodoPago: this.metodoSeleccionado,
          persona: { id: usuario.persona!.id!, tipoDocumento: this.tipoDocumento, documento: this.documento },
          direccionEntrega: { id: dirGuardada.id }
        };

        this.carritoService.registrarCompraConDatos(compra).subscribe({
          next: () => {
            this.carritoService.limpiarCarrito();
            this.toastService.show('Compra registrada correctamente', 'exito');
            this.router.navigate(['/mis-compras']);
          },
          error: () => { this.procesando = false; this.toastService.show('Error al registrar la compra', 'error'); }
        });
      },
      error: () => { this.procesando = false; this.toastService.show('Error al registrar la direccion', 'error'); }
    });
  }

  pagarPayPal(): void {
    const usuario = this.authService.getUsuarioStorage();
    if (!usuario) { this.toastService.show('Debes iniciar sesion', 'error'); this.router.navigate(['/login']); return; }

    if (!this.tipoDocumento || !this.documento.trim() || this.documentoError || this.verificandoDoc) {
      this.toastService.show('Complete todos los campos', 'error'); return;
    }

    this.validarDocumento();
    if (this.documentoError) { this.toastService.show('Complete todos los campos', 'error'); return; }

    const paypalUrl = 'https://www.paypal.com/paypalme/?amount=' + this.total.toFixed(2);
    window.open(paypalUrl, '_blank');

    this.toastService.show('Redirigiendo a PayPal...', 'exito');
  }
}
