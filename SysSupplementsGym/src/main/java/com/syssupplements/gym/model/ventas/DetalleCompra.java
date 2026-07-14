package com.syssupplements.gym.model.ventas;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.syssupplements.gym.model.catalogo.Producto;
import jakarta.persistence.*;

@Entity
public class DetalleCompra {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private Integer cantidad;
    private Float precioU;
    private Float subtotal;

    /*
     * Se agrega @JsonIgnore en Compra para evitar serialización circular:
     * DetalleCompra -> Compra -> Factura/Carrito -> Compra -> etc.
     * Solo se expone el ID de la compra a través de un DTO si es necesario.
     */
    @JsonIgnore
    @ManyToOne
    private Compra compra;

    @ManyToOne
    private Producto producto;

    public DetalleCompra(){
    }

    public DetalleCompra(Integer id, Integer cantidad, Float precioU, Float subtotal, Compra compra, Producto producto) {
        this.id = id;
        this.cantidad = cantidad;
        this.precioU = precioU;
        this.subtotal = subtotal;
        this.compra = compra;
        this.producto = producto;
    }

    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getCantidad() {
        return cantidad;
    }
    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public Float getPrecioU() {
        return precioU;
    }
    public void setPrecioU(Float precioU) {
        this.precioU = precioU;
    }

    public Float getSubtotal() {
        return subtotal;
    }
    public void setSubtotal(Float subtotal) {
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
