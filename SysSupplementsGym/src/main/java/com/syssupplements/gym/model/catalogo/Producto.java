package com.syssupplements.gym.model.catalogo;

import com.syssupplements.gym.model.ventas.DetalleCompra;
import jakarta.persistence.*;

import java.util.List;

@Entity
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String nombre;
    private int cod;
    private String detalle;
    private boolean estado;

    @OneToMany
    private List<DetalleCompra> detallesCompras;
    @ManyToOne
    private Categoria categoria;

    public Producto() {
    }

    public Producto(int id, String nombre, int cod, String detalle, boolean estado,
                    List<DetalleCompra> detallesCompras, Categoria categoria) {
        this.id = id;
        this.nombre = nombre;
        this.cod = cod;
        this.detalle = detalle;
        this.estado = estado;
        this.detallesCompras = detallesCompras;
        this.categoria = categoria;
    }

    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public int getCod() {
        return cod;
    }
    public void setCod(int cod) {
        this.cod = cod;
    }

    public String getDetalle() {
        return detalle;
    }
    public void setDetalle(String detalle) {
        this.detalle = detalle;
    }

    public boolean isEstado() {
        return estado;
    }
    public void setEstado(boolean estado) {
        this.estado = estado;
    }

    public List<DetalleCompra> getDetallesCompras() {
        return detallesCompras;
    }
    public void setDetallesCompras(List<DetalleCompra> detallesCompras) {
        this.detallesCompras = detallesCompras;
    }

    public Categoria getCategoria() {
        return categoria;
    }
    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }
}
