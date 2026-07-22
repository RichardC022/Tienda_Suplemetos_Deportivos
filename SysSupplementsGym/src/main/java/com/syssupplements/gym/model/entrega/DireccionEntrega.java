package com.syssupplements.gym.model.entrega;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.syssupplements.gym.model.ventas.Compra;
import jakarta.persistence.*;

import java.util.List;

@Entity
public class DireccionEntrega {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String callePrincipal;
    private String calleSecundaria;
    private String nroCasa;
    private String referencia;

    /*
     * Se agrega @JsonIgnore para evitar referencia circular
     * DireccionEntrega -> Compra -> DireccionEntrega.
     * Se agrega mappedBy = "direccionEntrega" para indicar que Compra
     * es el lado propietario de la relación @ManyToOne.
     */
    @JsonIgnore
    @OneToMany(mappedBy = "direccionEntrega")
    private List<Compra> compras;

    @Enumerated(EnumType.STRING)
    private EstadoEntrega estadoEntrega;

    public DireccionEntrega(){
    }

    public DireccionEntrega(Integer id, String callePrincipal, String calleSecundaria, String nroCasa, String referencia,
                            List<Compra> compras, EstadoEntrega estadoEntrega) {
        this.id = id;
        this.callePrincipal = callePrincipal;
        this.calleSecundaria = calleSecundaria;
        this.nroCasa = nroCasa;
        this.referencia = referencia;
        this.compras = compras;
        this.estadoEntrega = estadoEntrega;
    }

    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }

    public String getCallePrincipal() {
        return callePrincipal;
    }
    public void setCallePrincipal(String callePrincipal) {
        this.callePrincipal = callePrincipal;
    }

    public String getCalleSecundaria() {
        return calleSecundaria;
    }
    public void setCalleSecundaria(String calleSecundaria) {
        this.calleSecundaria = calleSecundaria;
    }

    public String getNroCasa() {
        return nroCasa;
    }
    public void setNroCasa(String nroCasa) {
        this.nroCasa = nroCasa;
    }

    public String getReferencia() {
        return referencia;
    }
    public void setReferencia(String referencia) {
        this.referencia = referencia;
    }

    public List<Compra> getCompras() {
        return compras;
    }
    public void setCompras(List<Compra> compras) {
        this.compras = compras;
    }

    public EstadoEntrega getEstadoEntrega() {
        return estadoEntrega;
    }
    public void setEstadoEntrega(EstadoEntrega estadoEntrega) {
        this.estadoEntrega = estadoEntrega;
    }
}
