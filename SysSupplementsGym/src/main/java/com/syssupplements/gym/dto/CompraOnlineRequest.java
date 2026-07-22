package com.syssupplements.gym.dto;

import java.util.List;

public class CompraOnlineRequest {

    private Integer personaId;
    private String tipoDocumento;
    private String documento;
    private String metodoPago;
    private String direccionCallePrincipal;
    private String direccionCalleSecundaria;
    private String direccionNumeroCasa;
    private String direccionReferencia;
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
