package model;

import java.util.Date;

public class Carrito {
    private Date fechaCreacion;
    private float subtotal;

    public Carrito(){
    }

    public Carrito(Date fechaCreacion, float subtotal){
        this.fechaCreacion = fechaCreacion;
        this.subtotal = subtotal;
    }

    public Date getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(Date fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public float getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(float subtotal) {
        this.subtotal = subtotal;
    }
}
