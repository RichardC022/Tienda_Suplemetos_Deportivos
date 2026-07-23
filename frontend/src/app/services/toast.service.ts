import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  mensaje: string;
  tipo: 'exito' | 'error';
  id: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastsSubject.asObservable();
  private counter = 0;

  show(mensaje: string, tipo: 'exito' | 'error' = 'exito'): void {
    const toast: Toast = { mensaje, tipo, id: ++this.counter };
    const current = this.toastsSubject.value;
    this.toastsSubject.next([...current, toast]);
    setTimeout(() => this.dismiss(toast.id), 3000);
  }

  dismiss(id: number): void {
    this.toastsSubject.next(this.toastsSubject.value.filter(t => t.id !== id));
  }
}
