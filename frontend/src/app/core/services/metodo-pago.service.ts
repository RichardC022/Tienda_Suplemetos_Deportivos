import { Injectable } from '@angular/core';
import { MetodoPago } from '../../models';

@Injectable({ providedIn: 'root' })
export class MetodoPagoService {
  private readonly STORAGE_KEY = 'metodos_pago';

  constructor() {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify([
        { id: 1, nombre: 'EFECTIVO', activo: true },
        { id: 2, nombre: 'TARJETA', activo: true },
        { id: 3, nombre: 'TRANSFERENCIA', activo: true },
        { id: 4, nombre: 'PAYPAL', activo: true }
      ]));
    }
  }

  listarTodos(): MetodoPagoItem[] {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
  }

  listarActivos(): MetodoPagoItem[] {
    return this.listarTodos().filter(m => m.activo);
  }

  guardar(item: MetodoPagoItem): void {
    const items = this.listarTodos();
    if (item.id) {
      const idx = items.findIndex(i => i.id === item.id);
      if (idx >= 0) items[idx] = item;
    } else {
      item.id = items.length ? Math.max(...items.map(i => i.id!)) + 1 : 1;
      items.push(item);
    }
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  }

  eliminar(id: number): void {
    const items = this.listarTodos().filter(i => i.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  }

  toggleActivo(id: number): void {
    const items = this.listarTodos();
    const item = items.find(i => i.id === id);
    if (item) {
      item.activo = !item.activo;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    }
  }
}

export interface MetodoPagoItem {
  id?: number;
  nombre: string;
  activo: boolean;
}
