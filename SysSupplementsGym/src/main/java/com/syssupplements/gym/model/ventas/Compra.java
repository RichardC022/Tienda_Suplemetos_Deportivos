package com.syssupplements.gym.model.ventas;

import com.syssupplements.gym.model.entrega.DireccionEntrega;
import com.syssupplements.gym.model.seguridad.Persona;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
public class Compra {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private Date fecha;
    private float total;

    @ManyToOne
    private Persona persona;
    @Enumerated(EnumType.STRING)
    private MetodoPago metodoPago;
    @ManyToOne
    private DireccionEntrega direccionEntrega;
    @OneToOne
    private Factura factura;
    @OneToOne
    private Carrito carrito;

    public Compra(int id, Date fecha, float total, Persona persona, MetodoPago metodoPago, DireccionEntrega direccionEntrega, Factura factura, Carrito carrito) {
        this.id = id;
        this.fecha = fecha;
        this.total = total;
        this.persona = persona;
        this.metodoPago = metodoPago;
        this.direccionEntrega = direccionEntrega;
        this.factura = factura;
        this.carrito = carrito;
    }

    public Compra() {
    }

    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }

    public Date getFecha() {
        return fecha;
    }
    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }

    public float getTotal() {
        return total;
    }
    public void setTotal(float total) {
        this.total = total;
    }

    public Persona getPersona() {
        return persona;
    }
    public void setPersona(Persona persona) {
        this.persona = persona;
    }

    public MetodoPago getMetodoPago() {
        return metodoPago;
    }
    public void setMetodoPago(MetodoPago metodoPago) {
        this.metodoPago = metodoPago;
    }

    public DireccionEntrega getDireccionEntrega() {
        return direccionEntrega;
    }
    public void setDireccionEntrega(DireccionEntrega direccionEntrega) {
        this.direccionEntrega = direccionEntrega;
    }

    public Factura getFactura() {
        return factura;
    }
    public void setFactura(Factura factura) {
        this.factura = factura;
    }

    public Carrito getCarrito() {
        return carrito;
    }
    public void setCarrito(Carrito carrito) {
        this.carrito = carrito;
    }
}
