package com.syssupplements.gym.syssumplemtens.dto;

public class LoginUsuarioProjection {
    private Integer id;
    private Integer personaId;
    private String clave;
    private String pinHash;
    private Integer intentoFallido;
    private String personaNombre;
    private String rolNombre;

    public LoginUsuarioProjection(Integer id, Integer personaId, String clave, String pinHash,
                                   Integer intentoFallido, String personaNombre, String rolNombre) {
        this.id = id;
        this.personaId = personaId;
        this.clave = clave;
        this.pinHash = pinHash;
        this.intentoFallido = intentoFallido;
        this.personaNombre = personaNombre;
        this.rolNombre = rolNombre;
    }

    public Integer getId() { return id; }
    public Integer getPersonaId() { return personaId; }
    public String getClave() { return clave; }
    public String getPinHash() { return pinHash; }
    public Integer getIntentoFallido() { return intentoFallido; }
    public void setIntentoFallido(Integer intentoFallido) { this.intentoFallido = intentoFallido; }
    public String getPersonaNombre() { return personaNombre; }
    public String getRolNombre() { return rolNombre; }
}
