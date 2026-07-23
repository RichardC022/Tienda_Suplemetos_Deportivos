import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Producto } from '../models';

export interface CarritoItem {
  producto: Producto;
  cantidad: number;
}

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private readonly API_URL = '/api/compras';
  private readonly CARRITO_KEY = 'carrito_items';

  private carritoSubject = new BehaviorSubject<CarritoItem[]>(this.obtenerCarritoLocal());
  carrito$ = this.carritoSubject.asObservable();

  constructor(private http: HttpClient) {}

  agregarProducto(producto: Producto): void {
    const items = this.obtenerCarritoLocal();
    const existente = items.find(i => i.producto.id === producto.id);
    if (existente) {
      existente.cantidad += 1;
    } else {
      items.push({ producto, cantidad: 1 });
    }
    this.guardar(items);
  }

  eliminarProducto(productoId: number): void {
    const items = this.obtenerCarritoLocal().filter(i => i.producto.id !== productoId);
    this.guardar(items);
  }

  cambiarCantidad(productoId: number, delta: number): void {
    const items = this.obtenerCarritoLocal();
    const item = items.find(i => i.producto.id === productoId);
    if (!item) return;
    item.cantidad += delta;
    const filtered = items.filter(i => i.cantidad > 0);
    this.guardar(filtered);
  }

  limpiarCarrito(): void {
    localStorage.removeItem(this.CARRITO_KEY);
    this.carritoSubject.next([]);
  }

  calcularTotal(): number {
    return this.obtenerCarritoLocal().reduce(
      (total, item) => total + (item.producto.precio * item.cantidad), 0
    );
  }

  getCantidadItems(): number {
    return this.obtenerCarritoLocal().reduce((sum, item) => sum + item.cantidad, 0);
  }

  getCantidadEnCarrito(productoId: number): number {
    const item = this.obtenerCarritoLocal().find(i => i.producto.id === productoId);
    return item ? item.cantidad : 0;
  }

  obtenerCarritoLocal(): CarritoItem[] {
    const items = localStorage.getItem(this.CARRITO_KEY);
    return items ? JSON.parse(items) : [];
  }

  private guardar(items: CarritoItem[]): void {
    localStorage.setItem(this.CARRITO_KEY, JSON.stringify(items));
    this.carritoSubject.next(items);
  }

  registrarCompraConDatos(compra: any): Observable<any> {
    const items = this.obtenerCarritoLocal().map(item => ({
      productoId: item.producto.id,
      cantidad: item.cantidad
    }));
    return this.http.post(this.API_URL, { ...compra, items });
  }

  simularPagoTarjeta(pagoData: any): Observable<any> {
    const items = this.obtenerCarritoLocal().map(item => ({
      productoId: item.producto.id,
      cantidad: item.cantidad
    }));
    return this.http.post('/api/pagos/simular', { ...pagoData, items });
  }
}
