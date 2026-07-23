import { Injectable } from '@angular/core';

export type TipoEntidad = 'BANCO' | 'COOPERATIVA';

export interface CuentaTransferencia {
  id: string;
  tipoEntidad: TipoEntidad;
  nombreEntidad: string;
  cedula: string;
  titular: string;
  numeroCuenta: string;
  tipoCuenta: string;
  qrImageUrl: string;
}

export interface TransferenciaConfig {
  banco: string;
  titular: string;
  numeroCuenta: string;
  tipoCuenta: string;
  qrImageUrl: string;
}

export const BANCOS_ECUADOR: string[] = [
  'Banco Pichincha',
  'Banco de Guayaquil',
  'Banco del Austro',
  'Banco Bolivariano',
  'Banco Internacional',
  'Banco del Pacífico',
  'Banco Procredit',
  'Banco General Rumiñahui',
  'Banco Solidario',
  'Banco Amazonas',
  'Banco Machala',
  'Banco Loja',
  'Banco Promerica',
  'Banco Comercial de Manabí',
  'Banco del Instituto Ecuadoriano de Seguridad Social',
  'Banco Nacional de Fomento',
  'Citibank',
];

export const COOPERATIVAS_ECUADOR: string[] = [
  'Cooperativa de Ahorro y Crédito JEP',
  'Cooperativa de Ahorro y Crédito Cosmos',
  'Cooperativa de Ahorro y Crédito Andahuasi',
  'Cooperativa de Ahorro y Crédito Saituna',
  'Cooperativa de Ahorro y Crédito Pyme',
  'Cooperativa de Ahorro y Crédito Zamaco',
  'Cooperativa San Francisco',
  'Cooperativa de Ahorro y Crédito Coopemi',
  'Cooperativa de Ahorro y Crédito Coodinilla',
  'Cooperativa de Ahorro y Crédito Coodunión',
  'Cooperativa de Ahorro y Crédito Cosmocel',
  'Cooperativa de Ahorro y Crédito 23 de Julio',
  'Cooperativa de Ahorro y Crédito Cosecha Limón',
  'Cooperativa de Ahorro y Crédito Naciones Unidas',
  'Cooperativa de Ahorro y Crédito El Comercio',
  'Cooperativa de Ahorro y Crédito La Merced',
  'Cooperativa de Ahorro y Crédito Vicentina "Manuel Esteban Godoy Ortega" Ltda.',
  'Cooperativa de Ahorro y Crédito Jaramillo',
  'Cooperativa de Ahorro y Crédito Alto Magdalena',
  'Cooperativa de Ahorro y Crédito 9 de Octubre',
  'Cooperativa de Ahorro y Crédito Salinas',
  'Cooperativa de Ahorro y Crédito Los Andes',
  'Cooperativa de Ahorro y Crédito Coodenacional',
  'Cooperativa de Ahorro y Crédito COACPM',
  'Cooperativa de Ahorro y Crédito La Preventiva',
  'Cooperativa de Ahorro y Crédito San Martín de Porres',
];

@Injectable({ providedIn: 'root' })
export class TransferenciaConfigService {
  private readonly STORAGE_KEY = 'transferencia_config';
  private readonly CUENTAS_KEY = 'transferencia_cuentas';

  constructor() {
    this.migrarSiEsNecesario();
  }

  getConfig(): TransferenciaConfig | null {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }

  saveConfig(config: TransferenciaConfig): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(config));
  }

  hasConfig(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) !== null;
  }

  listarCuentas(): CuentaTransferencia[] {
    const data = localStorage.getItem(this.CUENTAS_KEY);
    return data ? JSON.parse(data) : [];
  }

  listarCuentasPorTipo(tipo: TipoEntidad): CuentaTransferencia[] {
    return this.listarCuentas().filter(c => c.tipoEntidad === tipo);
  }

  guardarCuenta(cuenta: CuentaTransferencia): void {
    const cuentas = this.listarCuentas();
    const idx = cuentas.findIndex(c => c.id === cuenta.id);
    if (idx >= 0) {
      cuentas[idx] = cuenta;
    } else {
      cuenta.id = this.generarId();
      cuentas.push(cuenta);
    }
    localStorage.setItem(this.CUENTAS_KEY, JSON.stringify(cuentas));
  }

  eliminarCuenta(id: string): void {
    const cuentas = this.listarCuentas().filter(c => c.id !== id);
    localStorage.setItem(this.CUENTAS_KEY, JSON.stringify(cuentas));
  }

  tieneCuentas(): boolean {
    return this.listarCuentas().length > 0;
  }

  private generarId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
  }

  private migrarSiEsNecesario(): void {
    const cuentas = this.listarCuentas();
    if (cuentas.length > 0) return;

    const configVieja = this.getConfig();
    if (configVieja && configVieja.banco) {
      const cuentaMigrada: CuentaTransferencia = {
        id: this.generarId(),
        tipoEntidad: 'BANCO',
        nombreEntidad: configVieja.banco,
        cedula: '',
        titular: configVieja.titular,
        numeroCuenta: configVieja.numeroCuenta,
        tipoCuenta: configVieja.tipoCuenta,
        qrImageUrl: configVieja.qrImageUrl,
      };
      this.guardarCuenta(cuentaMigrada);
    }
  }
}
