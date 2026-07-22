package com.syssupplements.gym.syssumplemtens.dto;

import java.util.Date;

public class VentaManualResponse {
    private Integer compraId;
    private String numeroFactura;
    private Float total;
    private Date fecha;

    public VentaManualResponse() {}

    public VentaManualResponse(Integer compraId, String numeroFactura, Float total, Date fecha) {
        this.compraId = compraId;
        this.numeroFactura = numeroFactura;
        this.total = total;
        this.fecha = fecha;
    }

    public Integer getCompraId() { return compraId; }
    public void setCompraId(Integer compraId) { this.compraId = compraId; }
    public String getNumeroFactura() { return numeroFactura; }
    public void setNumeroFactura(String numeroFactura) { this.numeroFactura = numeroFactura; }
    public Float getTotal() { return total; }
    public void setTotal(Float total) { this.total = total; }
    public Date getFecha() { return fecha; }
    public void setFecha(Date fecha) { this.fecha = fecha; }
}
