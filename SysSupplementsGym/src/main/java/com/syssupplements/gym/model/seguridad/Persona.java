package com.syssupplements.gym.model.seguridad;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.syssupplements.gym.model.ventas.Compra;
import jakarta.persistence.*;

import java.util.List;

@Entity
public class Persona {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String nombre;
    private String apellido;
    private String telefono;
    private String tipoDocumento;
    private String documento;

    /*
     * Se agrega @JsonIgnore para evitar la referencia circular Persona -> Compra -> Persona.
     * Se agrega mappedBy = "persona" para establecer que Compra es el lado
     * propietario de la relación @ManyToOne con Persona.
     */
    @JsonIgnore
    @OneToMany(mappedBy = "persona")
    private List<Compra> compras;

    public Persona(){
    }

    public Persona(Integer id, String nombre, String apellido, String telefono, String tipoDocumento, String documento, List<Compra> compras) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.telefono = telefono;
        this.tipoDocumento = tipoDocumento;
        this.documento = documento;
        this.compras = compras;
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

    public String getApellido() {
        return apellido;
    }
    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getTelefono() {
        return telefono;
    }
    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getTipoDocumento() {
        return tipoDocumento;
    }
    public void setTipoDocumento(String tipoDocumento) {
        this.tipoDocumento = tipoDocumento;
    }

    public String getDocumento() {
        return documento;
    }
    public void setDocumento(String documento) {
        this.documento = documento;
    }

    public List<Compra> getCompras() {
        return compras;
    }
    public void setCompras(List<Compra> compras) {
        this.compras = compras;
    }
}
