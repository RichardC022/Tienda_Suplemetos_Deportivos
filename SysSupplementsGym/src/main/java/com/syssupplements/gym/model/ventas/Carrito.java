package com.syssupplements.gym.model.ventas;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.Date;

@Entity
public class Carrito {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private Date fechaCreacion;
    private Float subtotal;

    @JsonIgnore
    @OneToOne
    private Compra compra;

    public Carrito(){
    }

    public Carrito(Integer id, Date fechaCreacion, Float subtotal){
        this.id = id;
        this.fechaCreacion = fechaCreacion;
        this.subtotal = subtotal;
    }

    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }

    public Date getFechaCreacion() {
        return fechaCreacion;
    }
    public void setFechaCreacion(Date fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
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
}
