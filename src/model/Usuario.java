package model;

public class Usuario {
    private String correo;
    private String clave;
    private int intentoFallido;

    private Persona persona;
    private Rol rol;

    public Usuario(){
    }

    public Usuario(String correo, String clave, int intentoFallido, Persona persona, Rol rol){
        this.correo = correo;
        this.clave = clave;
        this.intentoFallido = intentoFallido;
        this.persona = persona;
        this.rol = rol;
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

    public int getIntentoFallido() {
        return intentoFallido;
    }

    public void setIntentoFallido(int intentoFallido) {
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
