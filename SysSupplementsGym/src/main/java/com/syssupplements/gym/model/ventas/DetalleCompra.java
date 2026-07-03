package com.syssupplements.gym.model.ventas;

import com.syssupplements.gym.model.catalogo.Producto;
import jakarta.persistence.*;

@Entity
public class DetalleCompra {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private int cantidad;
    private float precioU;
    private float subtotal;

    @ManyToOne
    private Compra compra;
    @ManyToOne
    private Producto producto;
    public DetalleCompra(){
    }

    public DetalleCompra(int id, int cantidad, float precioU, float subtotal, Compra compra, Producto producto) {
        this.id = id;
        this.cantidad = cantidad;
        this.precioU = precioU;
        this.subtotal = subtotal;
        this.compra = compra;
        this.producto = producto;
    }

    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }

    public int getCantidad() {
        return cantidad;
    }
    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }

    public float getPrecioU() {
        return precioU;
    }
    public void setPrecioU(float precioU) {
        this.precioU = precioU;
    }

    public float getSubtotal() {
        return subtotal;
    }
    public void setSubtotal(float subtotal) {
        this.subtotal = subtotal;
    }

    public Compra getCompra() {
        return compra;
    }
    public void setCompra(Compra compra) {
        this.compra = compra;
    }

    public Producto getProducto() {
        return producto;
    }
    public void setProducto(Producto producto) {
        this.producto = producto;
    }
}
