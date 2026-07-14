package com.syssupplements.gym.model.catalogo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.List;

@Entity
public class Categoria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String nombre;
    private String descripcion;

    /*
     * Se agrega @JsonIgnore para evitar referencia circular Categoria -> Producto -> Categoria.
     * Se usa mappedBy = "categoria" para indicar que Producto es el lado
     * propietario de la relación @ManyToOne, y Categoria tiene el lado inverso.
     */
    @JsonIgnore
    @OneToMany(mappedBy = "categoria")
    private List<Producto> productos;

    public Categoria(){
    }

    public Categoria(Integer id, String nombre, String descripcion, List<Producto> productos) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.productos = productos;
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

    public String getDescripcion() {
        return descripcion;
    }
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public List<Producto> getProductos() {
        return productos;
    }
    public void setProductos(List<Producto> productos) {
        this.productos = productos;
    }
}
