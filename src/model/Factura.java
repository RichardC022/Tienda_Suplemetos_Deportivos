package model;

import java.util.Date;

public class Factura {
    private Date fecha;
    private float total;
    private String numero;

    public Factura(){
    }

    public Factura(Date fecha, float total, String numero){
        this.fecha = fecha;
        this.total = total;
        this.numero = numero;
    }

    public Date getFecha() {
        return fecha;
    }

    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }

    public float getTotal() {
        return total;
    }

    public void setTotal(float total) {
        this.total = total;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }
}
