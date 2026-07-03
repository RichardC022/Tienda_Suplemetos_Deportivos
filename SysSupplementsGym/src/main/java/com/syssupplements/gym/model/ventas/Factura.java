package com.syssupplements.gym.model.ventas;

import jakarta.persistence.*;
import java.util.Date;

@Entity
public class Factura {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private Date fecha;
    private float total;
    private String numero;

    @OneToOne
    private Compra compra;

    public Factura(){
    }

    public Factura(int id, Date fecha, float total, String numero, Compra compra) {
        this.id = id;
        this.fecha = fecha;
        this.total = total;
        this.numero = numero;
        this.compra = compra;
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

    public String getNumero() {
        return numero;
    }
    public void setNumero(String numero) {
        this.numero = numero;
    }

    public Compra getCompra() {
        return compra;
    }
    public void setCompra(Compra compra) {
        this.compra = compra;
    }
}
