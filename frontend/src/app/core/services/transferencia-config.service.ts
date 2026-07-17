import { Injectable } from '@angular/core';

export interface TransferenciaConfig {
  banco: string;
  titular: string;
  numeroCuenta: string;
  tipoCuenta: string;
  qrImageUrl: string;
}

@Injectable({ providedIn: 'root' })
export class TransferenciaConfigService {
  private readonly STORAGE_KEY = 'transferencia_config';

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
}
