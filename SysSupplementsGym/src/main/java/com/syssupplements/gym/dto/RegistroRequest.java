package com.syssupplements.gym.dto;

public class RegistroRequest {
    private String correo;
    private String clave;
    private String pin;
    private RegistroRequestPersona persona;

    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }
    public String getClave() { return clave; }
    public void setClave(String clave) { this.clave = clave; }
    public String getPin() { return pin; }
    public void setPin(String pin) { this.pin = pin; }
    public RegistroRequestPersona getPersona() { return persona; }
    public void setPersona(RegistroRequestPersona persona) { this.persona = persona; }

    public static class RegistroRequestPersona {
        private String nombre;
        private String apellido;
        private String telefono;

        public String getNombre() { return nombre; }
        public void setNombre(String nombre) { this.nombre = nombre; }
        public String getApellido() { return apellido; }
        public void setApellido(String apellido) { this.apellido = apellido; }
        public String getTelefono() { return telefono; }
        public void setTelefono(String telefono) { this.telefono = telefono; }
    }
}
