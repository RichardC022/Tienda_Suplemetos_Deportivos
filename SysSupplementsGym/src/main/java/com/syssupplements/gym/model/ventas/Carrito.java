package com.syssupplements.gym.model.ventas;

import jakarta.persistence.*;

import java.util.Date;

@Entity
public class Carrito {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Date fechaCreacion;
    private float subtotal;

    @OneToOne
    private Compra compra;

    public Carrito(){
    }

    public Carrito(Date fechaCreacion, float subtotal){
        this.fechaCreacion = fechaCreacion;
        this.subtotal = subtotal;
    }

    public Date getFechaCreacion() {
        return fechaCreacion;
    }
    public void setFechaCreacion(Date fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
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
}
