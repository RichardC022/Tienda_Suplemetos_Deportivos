package com.syssupplements.gym.model.entrega;

import com.syssupplements.gym.model.ventas.Compra;
import jakarta.persistence.*;

import java.util.List;

@Entity
public class DireccionEntrega {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String callePrincipal;
    private String callleSecundaria;
    private String nroCasa;
    private String referencia;

    @OneToMany
    private List<Compra> compras;
    @Enumerated(EnumType.STRING)
    private EstadoEntrega estadoEntrega;

    public DireccionEntrega(){
    }

    public DireccionEntrega(int id, String callePrincipal, String callleSecundaria, String nroCasa, String referencia,
                            List<Compra> compras, EstadoEntrega estadoEntrega) {
        this.id = id;
        this.callePrincipal = callePrincipal;
        this.callleSecundaria = callleSecundaria;
        this.nroCasa = nroCasa;
        this.referencia = referencia;
        this.compras = compras;
        this.estadoEntrega = estadoEntrega;
    }

    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }

    public String getCallePrincipal() {
        return callePrincipal;
    }
    public void setCallePrincipal(String callePrincipal) {
        this.callePrincipal = callePrincipal;
    }

    public String getCallleSecundaria() {
        return callleSecundaria;
    }
    public void setCallleSecundaria(String callleSecundaria) {
        this.callleSecundaria = callleSecundaria;
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
