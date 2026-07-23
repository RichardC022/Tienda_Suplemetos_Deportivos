package com.syssupplements.gym.dto;

import java.util.List;

public class PagoSimularRequest {

    private Integer personaId;
    private String tipoDocumento;
    private String documento;
    private String metodoPago;
    private String direccionCallePrincipal;
    private String direccionCalleSecundaria;
    private String direccionNumeroCasa;
    private String direccionReferencia;

    private String numeroTarjeta;
    private String fechaExpiracion;
    private String cvv;
    private String nombreTitular;

    private List<CompraOnlineItem> items;

    public Integer getPersonaId() { return personaId; }
    public void setPersonaId(Integer personaId) { this.personaId = personaId; }
    public String getTipoDocumento() { return tipoDocumento; }
    public void setTipoDocumento(String tipoDocumento) { this.tipoDocumento = tipoDocumento; }
    public String getDocumento() { return documento; }
    public void setDocumento(String documento) { this.documento = documento; }
    public String getMetodoPago() { return metodoPago; }
    public void setMetodoPago(String metodoPago) { this.metodoPago = metodoPago; }
    public String getDireccionCallePrincipal() { return direccionCallePrincipal; }
    public void setDireccionCallePrincipal(String direccionCallePrincipal) { this.direccionCallePrincipal = direccionCallePrincipal; }
    public String getDireccionCalleSecundaria() { return direccionCalleSecundaria; }
    public void setDireccionCalleSecundaria(String direccionCalleSecundaria) { this.direccionCalleSecundaria = direccionCalleSecundaria; }
    public String getDireccionNumeroCasa() { return direccionNumeroCasa; }
    public void setDireccionNumeroCasa(String direccionNumeroCasa) { this.direccionNumeroCasa = direccionNumeroCasa; }
    public String getDireccionReferencia() { return direccionReferencia; }
    public void setDireccionReferencia(String direccionReferencia) { this.direccionReferencia = direccionReferencia; }

    public String getNumeroTarjeta() { return numeroTarjeta; }
    public void setNumeroTarjeta(String numeroTarjeta) { this.numeroTarjeta = numeroTarjeta; }
    public String getFechaExpiracion() { return fechaExpiracion; }
    public void setFechaExpiracion(String fechaExpiracion) { this.fechaExpiracion = fechaExpiracion; }
    public String getCvv() { return cvv; }
    public void setCvv(String cvv) { this.cvv = cvv; }
    public String getNombreTitular() { return nombreTitular; }
    public void setNombreTitular(String nombreTitular) { this.nombreTitular = nombreTitular; }

    public List<CompraOnlineItem> getItems() { return items; }
    public void setItems(List<CompraOnlineItem> items) { this.items = items; }

    public static class CompraOnlineItem {
        private Integer productoId;
        private Integer cantidad;

        public Integer getProductoId() { return productoId; }
        public void setProductoId(Integer productoId) { this.productoId = productoId; }
        public Integer getCantidad() { return cantidad; }
        public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
    }
}
