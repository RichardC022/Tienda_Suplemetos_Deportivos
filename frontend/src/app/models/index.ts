/*
 * Interfaces que representan las entidades del backend Spring Boot.
 * Se mantienen los mismos nombres de campos que en el backend Java
 * para que la serialización JSON funcione sin transformaciones.
 */

export interface Persona {
  id?: number;
  nombre: string;
  apellido: string;
  telefono: string;
}

export interface Rol {
  idRol?: number;
  nombre: string;
}

export interface Usuario {
  id?: number;
  correo: string;
  clave?: string;
  intentoFallido?: number;
  persona?: Persona;
  rol?: Rol;
}

export interface Categoria {
  id?: number;
  nombre: string;
  descripcion: string;
}

export interface Producto {
  id?: number;
  nombre: string;
  cod: number;
  detalle: string;
  estado: boolean;
  precio: number;
  categoria?: Categoria;
}

export interface Inventario {
  id?: number;
  stock: number;
  stockMin: number;
  producto?: Producto;
}

export interface Carrito {
  fechaCreacion?: Date;
  subtotal: number;
  compra?: Compra;
}

export interface DetalleCompra {
  id?: number;
  cantidad: number;
  precioU: number;
  subtotal: number;
  producto?: Producto;
}

export interface Compra {
  id?: number;
  fecha?: Date;
  total: number;
  persona?: Persona;
  metodoPago: string;
  direccionEntrega?: DireccionEntrega;
}

export interface Factura {
  id?: number;
  fecha?: Date;
  total: number;
  numero: string;
}

export enum MetodoPago {
  EFECTIVO = 'EFECTIVO',
  TARJETA = 'TARJETA',
  TRANSFERENCIA = 'TRANSFERENCIA',
  PAYPAL = 'PAYPAL'
}

export enum EstadoEntrega {
  ENVIADO = 'ENVIADO',
  EN_PROCESO = 'EN_PROCESO',
  ENTREGADO = 'ENTREGADO'
}

export interface DireccionEntrega {
  id?: number;
  callePrincipal: string;
  callleSecundaria: string;
  nroCasa: string;
  referencia: string;
  estadoEntrega?: EstadoEntrega;
}
