package com.syssupplements.gym.model.ventas;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.syssupplements.gym.model.entrega.DireccionEntrega;
import com.syssupplements.gym.model.seguridad.Persona;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
public class Compra {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private Date fecha;
    private Float total;

    @ManyToOne
    private Persona persona;
    @Enumerated(EnumType.STRING)
    private MetodoPago metodoPago;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoVenta tipoVenta = TipoVenta.ONLINE;
    @ManyToOne
    private DireccionEntrega direccionEntrega;

    /*
     * Se agrega @JsonIgnore para evitar la serialización circular bidireccional
     * entre Compra -> Factura -> Compra, lo que causaría un StackOverflowError
     * al momento de convertir el objeto a JSON.
     */
    @JsonIgnore
    @OneToOne
    private Factura factura;

    /*
     * Se agrega @JsonIgnore por la misma razón que Factura: Compra y Carrito
     * tienen una relación bidireccional @OneToOne que genera un bucle infinito
     * en la serialización JSON.
     */
    @JsonIgnore
    @OneToOne
    private Carrito carrito;

    /*
     * Relación inversa (bidireccional) con DetalleCompra, tal como especifica
     * el diagrama de dominio: Compra "1" -- "*" DetalleCompra.
     * DetalleCompra es el lado propietario (@ManyToOne compra), por eso se usa
     * mappedBy = "compra". Se agrega @JsonIgnore siguiendo la misma convención
     * del resto de relaciones inversas de esta clase para evitar referencias
     * circulares en la serialización JSON.
     */
    @JsonIgnore
    @OneToMany(mappedBy = "compra", cascade = CascadeType.ALL)
    private List<DetalleCompra> detallesCompra;

    public Compra(Integer id, Date fecha, Float total, Persona persona, MetodoPago metodoPago, DireccionEntrega direccionEntrega, Factura factura, Carrito carrito) {
        this.id = id;
        this.fecha = fecha;
        this.total = total;
        this.persona = persona;
        this.metodoPago = metodoPago;
        this.direccionEntrega = direccionEntrega;
        this.factura = factura;
        this.carrito = carrito;
    }

    public Compra() {
    }

    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }

    public Date getFecha() {
        return fecha;
    }
    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }

    public Float getTotal() {
        return total;
    }
    public void setTotal(Float total) {
        this.total = total;
    }

    public Persona getPersona() {
        return persona;
    }
    public void setPersona(Persona persona) {
        this.persona = persona;
    }

    public MetodoPago getMetodoPago() {
        return metodoPago;
    }
    public void setMetodoPago(MetodoPago metodoPago) {
        this.metodoPago = metodoPago;
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

    public Carrito getCarrito() {
        return carrito;
    }
    public void setCarrito(Carrito carrito) {
        this.carrito = carrito;
    }

    public TipoVenta getTipoVenta() {
        return tipoVenta;
    }
    public void setTipoVenta(TipoVenta tipoVenta) {
        this.tipoVenta = tipoVenta;
    }

    public List<DetalleCompra> getDetallesCompra() {
        return detallesCompra;
    }
    public void setDetallesCompra(List<DetalleCompra> detallesCompra) {
        this.detallesCompra = detallesCompra;
    }
}
