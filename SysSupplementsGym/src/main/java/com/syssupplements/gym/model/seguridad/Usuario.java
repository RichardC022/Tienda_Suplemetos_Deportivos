package com.syssupplements.gym.model.seguridad;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(indexes = @Index(name = "idx_usuario_correo", columnList = "correo", unique = true))
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String correo;

    private String clave;
    private Integer intentoFallido;

    @JsonIgnore
    @Column(nullable = true)
    private String pinHash;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
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

    public String getPinHash() {
        return pinHash;
    }
    public void setPinHash(String pinHash) {
        this.pinHash = pinHash;
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
