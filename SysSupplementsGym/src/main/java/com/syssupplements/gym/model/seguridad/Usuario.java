package com.syssupplements.gym.model.seguridad;

import jakarta.persistence.*;

@Entity
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String correo;
    private String clave;
    private Integer intentoFallido;

    @OneToOne
    private Persona persona;
    @ManyToOne
    private Rol rol;

    public Usuario(){
    }

    public Usuario(Integer id, String correo, String clave, Integer intentoFallido, Persona persona, Rol rol) {
        this.id = id;
        this.correo = correo;
        this.clave = clave;
        this.intentoFallido = intentoFallido;
        this.persona = persona;
        this.rol = rol;
    }

    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }

    public String getCorreo() {
        return correo;
    }
    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getClave() {
        return clave;
    }
    public void setClave(String clave) {
        this.clave = clave;
    }

    public Integer getIntentoFallido() {
        return intentoFallido;
    }
    public void setIntentoFallido(Integer intentoFallido) {
        this.intentoFallido = intentoFallido;
    }

    public Persona getPersona() {
        return persona;
    }
    public void setPersona(Persona persona) {
        this.persona = persona;
    }

    public Rol getRol() {
        return rol;
    }
    public void setRol(Rol rol) {
        this.rol = rol;
    }
}
