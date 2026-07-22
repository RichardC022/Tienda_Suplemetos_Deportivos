package com.syssupplements.gym.model.seguridad;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(indexes = @Index(name = "idx_rol_nombre", columnList = "nombre", unique = true))
public class Rol {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idRol;
    private String nombre;

    /*
     * Se agrega @JsonIgnore para evitar referencia circular Rol -> Usuario -> Rol.
     * Se usa mappedBy = "rol" porque Usuario es el lado propietario de la
     * relación @ManyToOne, y Rol tiene el lado inverso @OneToMany.
     */
    @JsonIgnore
    @OneToMany(mappedBy = "rol")
    private List<Usuario> usuarios;

    public Rol(){
    }

    public Rol(Integer idRol, String nombre, List<Usuario> usuarios) {
        this.idRol = idRol;
        this.nombre = nombre;
        this.usuarios = usuarios;
    }

    public Integer getIdRol() {
        return idRol;
    }
    public void setIdRol(Integer idRol) {
        this.idRol = idRol;
    }

    public String getNombre() {
        return nombre;
    }
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public List<Usuario> getUsuarios() {
        return usuarios;
    }
    public void setUsuarios(List<Usuario> usuarios) {
        this.usuarios = usuarios;
    }
}
