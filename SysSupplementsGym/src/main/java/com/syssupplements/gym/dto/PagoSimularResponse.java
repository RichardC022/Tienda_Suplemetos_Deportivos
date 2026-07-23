package com.syssupplements.gym.dto;

import java.util.Date;

public class PagoSimularResponse {

    private boolean aprobado;
    private String mockTransactionId;
    private Integer compraId;
    private String numeroFactura;
    private Float total;
    private Date fecha;
    private String mensaje;

    public PagoSimularResponse() {}

    public PagoSimularResponse(boolean aprobado, String mockTransactionId, Integer compraId,
                                String numeroFactura, Float total, Date fecha, String mensaje) {
        this.aprobado = aprobado;
        this.mockTransactionId = mockTransactionId;
        this.compraId = compraId;
        this.numeroFactura = numeroFactura;
        this.total = total;
        this.fecha = fecha;
        this.mensaje = mensaje;
    }

    public boolean isAprobado() { return aprobado; }
    public void setAprobado(boolean aprobado) { this.aprobado = aprobado; }
    public String getMockTransactionId() { return mockTransactionId; }
    public void setMockTransactionId(String mockTransactionId) { this.mockTransactionId = mockTransactionId; }
    public Integer getCompraId() { return compraId; }
    public void setCompraId(Integer compraId) { this.compraId = compraId; }
    public String getNumeroFactura() { return numeroFactura; }
    public void setNumeroFactura(String numeroFactura) { this.numeroFactura = numeroFactura; }
    public Float getTotal() { return total; }
    public void setTotal(Float total) { this.total = total; }
    public Date getFecha() { return fecha; }
    public void setFecha(Date fecha) { this.fecha = fecha; }
    public String getMensaje() { return mensaje; }
    public void setMensaje(String mensaje) { this.mensaje = mensaje; }
}
