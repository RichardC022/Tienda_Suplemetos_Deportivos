package com.syssupplements.gym.model.catalogo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.syssupplements.gym.model.ventas.DetalleCompra;
import jakarta.persistence.*;

import java.util.List;

@Entity
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String nombre;
    private Integer cod;
    private String detalle;
    private Boolean estado;
    private Float precio;

    @Column(columnDefinition = "TEXT")
    private String imagenUrl;

    /*
     * Se agrega @JsonIgnore en detallesCompras para evitar la referencia circular
     * Producto -> DetalleCompra -> Producto. Esta relación se expone
     * únicamente a través del endpoint de DetalleCompra si se necesita.
     */
    @JsonIgnore
    @OneToMany(mappedBy = "producto")
    private List<DetalleCompra> detallesCompras;

    @ManyToOne
    private Categoria categoria;

    public Producto() {
    }

    public Producto(Integer id, String nombre, Integer cod, String detalle, Boolean estado, Float precio,
                    String imagenUrl, List<DetalleCompra> detallesCompras, Categoria categoria) {
        this.id = id;
        this.nombre = nombre;
        this.cod = cod;
        this.detalle = detalle;
        this.estado = estado;
        this.precio = precio;
        this.imagenUrl = imagenUrl;
        this.detallesCompras = detallesCompras;
        this.categoria = categoria;
    }

    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Integer getCod() {
        return cod;
    }
    public void setCod(Integer cod) {
        this.cod = cod;
    }

    public String getDetalle() {
        return detalle;
    }
    public void setDetalle(String detalle) {
        this.detalle = detalle;
    }

    public Boolean getEstado() {
        return estado;
    }
    public void setEstado(Boolean estado) {
        this.estado = estado;
    }

    public Float getPrecio() {
        return precio;
    }
    public void setPrecio(Float precio) {
        this.precio = precio;
    }

    public String getImagenUrl() {
        return imagenUrl;
    }
    public void setImagenUrl(String imagenUrl) {
        this.imagenUrl = imagenUrl;
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
