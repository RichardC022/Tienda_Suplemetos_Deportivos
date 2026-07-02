package model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class Compra {
    private Date fecha;
    private float total;

    private Persona persona;
    private MetodoPago metodoPago;
    private Carrito carrito;
    private DireccionEntrega direccionEntrega;
    private Factura factura;

    private List<DetalleCompra> detalles;

    public Compra(){
        this.detalles = new ArrayList<>();
    }

    public Compra(Date fecha, float total, Persona persona, MetodoPago metodoPago, Carrito carrito, DireccionEntrega direccionEntrega, Factura factura){
        this.fecha = fecha;
        this.total = total;
        this.persona = persona;
        this.metodoPago = metodoPago;
        this.carrito = carrito;
        this.direccionEntrega = direccionEntrega;
        this.factura = factura;
        this.detalles = new ArrayList<>();
    }

    public void agregarDetalle(DetalleCompra detalle){
        detalles.add(detalle);
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

    public MetodoPago getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(MetodoPago metodoPago) {
        this.metodoPago = metodoPago;
    }

    public Persona getPersona() {
        return persona;
    }

    public void setPersona(Persona persona) {
        this.persona = persona;
    }

    public Carrito getCarrito() {
        return carrito;
    }

    public void setCarrito(Carrito carrito) {
        this.carrito = carrito;
    }

    public DireccionEntrega getDireccionEntrega() {
        return direccionEntrega;
    }

    public void setDireccionEntrega(DireccionEntrega direccionEntrega) {
        this.direccionEntrega = direccionEntrega;
    }

    public Factura getFactura() {
        return factura;
    }

    public void setFactura(Factura factura) {
        this.factura = factura;
    }

    public List<DetalleCompra> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<DetalleCompra> detalles) {
        this.detalles = detalles;
    }
}
