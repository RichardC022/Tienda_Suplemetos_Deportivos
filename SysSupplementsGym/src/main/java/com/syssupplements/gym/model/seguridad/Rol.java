package com.syssupplements.gym.model.seguridad;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class Rol {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idRol;
    private String nombre;

    @OneToMany
    private List<Usuario> usuarios;

    public Rol(){
    }

    public Rol(int idRol, String nombre, List<Usuario> usuarios) {
        this.idRol = idRol;
        this.nombre = nombre;
        this.usuarios = usuarios;
    }

    public int getIdRol() {
        return idRol;
    }
    public void setIdRol(int idRol) {
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
