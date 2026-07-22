package com.syssupplements.gym.syssumplemtens.dto;

public class LoginResponse {
    private String tempToken;
    private Integer usuarioId;
    private Integer personaId;
    private String correo;
    private String nombre;
    private String rol;
    private boolean tienePin;

    public LoginResponse() {}

    public LoginResponse(String tempToken, Integer usuarioId, Integer personaId, String correo, String nombre, String rol, boolean tienePin) {
        this.tempToken = tempToken;
        this.usuarioId = usuarioId;
        this.personaId = personaId;
        this.correo = correo;
        this.nombre = nombre;
        this.rol = rol;
        this.tienePin = tienePin;
    }

    public String getTempToken() { return tempToken; }
    public void setTempToken(String tempToken) { this.tempToken = tempToken; }
    public Integer getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Integer usuarioId) { this.usuarioId = usuarioId; }
    public Integer getPersonaId() { return personaId; }
    public void setPersonaId(Integer personaId) { this.personaId = personaId; }
    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }
    public boolean isTienePin() { return tienePin; }
    public void setTienePin(boolean tienePin) { this.tienePin = tienePin; }
}
