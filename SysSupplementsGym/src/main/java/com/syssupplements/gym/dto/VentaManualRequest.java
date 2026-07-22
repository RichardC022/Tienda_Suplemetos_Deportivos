package com.syssupplements.gym.dto;

import java.util.List;

public class VentaManualRequest {

    private String clienteNombre;
    private String clienteApellido;
    private String clienteDocumento;
    private String clienteTelefono;
    private String direccionCallePrincipal;
    private String direccionCalleSecundaria;
    private String direccionReferencia;
    private String metodoPago;
    private List<VentaManualItem> items;

    public String getClienteNombre() { return clienteNombre; }
    public void setClienteNombre(String clienteNombre) { this.clienteNombre = clienteNombre; }
    public String getClienteApellido() { return clienteApellido; }
    public void setClienteApellido(String clienteApellido) { this.clienteApellido = clienteApellido; }
    public String getClienteDocumento() { return clienteDocumento; }
    public void setClienteDocumento(String clienteDocumento) { this.clienteDocumento = clienteDocumento; }
    public String getClienteTelefono() { return clienteTelefono; }
    public void setClienteTelefono(String clienteTelefono) { this.clienteTelefono = clienteTelefono; }
    public String getDireccionCallePrincipal() { return direccionCallePrincipal; }
    public void setDireccionCallePrincipal(String direccionCallePrincipal) { this.direccionCallePrincipal = direccionCallePrincipal; }
    public String getDireccionCalleSecundaria() { return direccionCalleSecundaria; }
    public void setDireccionCalleSecundaria(String direccionCalleSecundaria) { this.direccionCalleSecundaria = direccionCalleSecundaria; }
    public String getDireccionReferencia() { return direccionReferencia; }
    public void setDireccionReferencia(String direccionReferencia) { this.direccionReferencia = direccionReferencia; }
    public String getMetodoPago() { return metodoPago; }
    public void setMetodoPago(String metodoPago) { this.metodoPago = metodoPago; }
    public List<VentaManualItem> getItems() { return items; }
    public void setItems(List<VentaManualItem> items) { this.items = items; }

    public static class VentaManualItem {
        private Integer productoId;
        private Integer cantidad;
        private Float precioUnitario;

        public Integer getProductoId() { return productoId; }
        public void setProductoId(Integer productoId) { this.productoId = productoId; }
        public Integer getCantidad() { return cantidad; }
        public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
        public Float getPrecioUnitario() { return precioUnitario; }
        public void setPrecioUnitario(Float precioUnitario) { this.precioUnitario = precioUnitario; }
    }
}
