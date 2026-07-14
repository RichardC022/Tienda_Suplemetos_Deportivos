package com.syssupplements.gym.model.ventas;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.Date;

@Entity
public class Factura {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private Date fecha;
    private Float total;
    private String numero;

    /*
     * Se agrega @JsonIgnore para evitar la referencia circular bidireccional
     * con Compra. Como Compra también tiene un campo @OneToOne Factura,
     * al serializar ambos lados se produce un bucle infinito.
     */
    @JsonIgnore
    @OneToOne
    private Compra compra;

    public Factura(){
    }

    public Factura(Integer id, Date fecha, Float total, String numero, Compra compra) {
        this.id = id;
        this.fecha = fecha;
        this.total = total;
        this.numero = numero;
        this.compra = compra;
    }

    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }

    public Date getFecha() {
        return fecha;
    }
    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }

    public Float getTotal() {
        return total;
    }
    public void setTotal(Float total) {
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
