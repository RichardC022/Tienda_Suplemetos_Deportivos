package com.syssupplements.gym.controller;

import com.syssupplements.gym.dto.CompraOnlineRequest;
import com.syssupplements.gym.dto.PagoSimularRequest;
import com.syssupplements.gym.dto.PagoSimularResponse;
import com.syssupplements.gym.dto.VentaManualResponse;
import com.syssupplements.gym.service.PurchaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/pagos")
@RequiredArgsConstructor
public class PagoController {

    private final PurchaseService purchaseService;

    private static final Pattern TARJETA_PATTERN = Pattern.compile("^\\d{16}$");
    private static final Pattern EXPIRACION_PATTERN = Pattern.compile("^(0[1-9]|1[0-2])/\\d{2}$");
    private static final Pattern CVV_PATTERN = Pattern.compile("^\\d{3}$");

    @PostMapping("/simular")
    public ResponseEntity<?> simularPago(@RequestBody PagoSimularRequest request) {
        if (request.getNumeroTarjeta() == null || !TARJETA_PATTERN.matcher(request.getNumeroTarjeta()).matches()) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", "Numero de tarjeta invalido. Debe tener 16 digitos."));
        }
        if (request.getFechaExpiracion() == null || !EXPIRACION_PATTERN.matcher(request.getFechaExpiracion()).matches()) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", "Fecha de expiracion invalida. Use MM/AA."));
        }
        if (request.getCvv() == null || !CVV_PATTERN.matcher(request.getCvv()).matches()) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", "CVV invalido. Debe tener 3 digitos."));
        }
        if (request.getNombreTitular() == null || request.getNombreTitular().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", "El nombre del titular es obligatorio."));
        }

        String mockTransactionId = "MOCK-" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();

        CompraOnlineRequest compraReq = new CompraOnlineRequest();
        compraReq.setPersonaId(request.getPersonaId());
        compraReq.setTipoDocumento(request.getTipoDocumento());
        compraReq.setDocumento(request.getDocumento());
        compraReq.setMetodoPago("TARJETA");
        compraReq.setDireccionCallePrincipal(request.getDireccionCallePrincipal());
        compraReq.setDireccionCalleSecundaria(request.getDireccionCalleSecundaria());
        compraReq.setDireccionNumeroCasa(request.getDireccionNumeroCasa());
        compraReq.setDireccionReferencia(request.getDireccionReferencia());

        if (request.getItems() != null) {
            java.util.List<CompraOnlineRequest.CompraOnlineItem> items = new java.util.ArrayList<>();
            for (PagoSimularRequest.CompraOnlineItem src : request.getItems()) {
                CompraOnlineRequest.CompraOnlineItem item = new CompraOnlineRequest.CompraOnlineItem();
                item.setProductoId(src.getProductoId());
                item.setCantidad(src.getCantidad());
                items.add(item);
            }
            compraReq.setItems(items);
        }

        try {
            VentaManualResponse ventaResponse = purchaseService.registrarCompraOnline(compraReq);

            PagoSimularResponse pagoResponse = new PagoSimularResponse(
                    true,
                    mockTransactionId,
                    ventaResponse.getCompraId(),
                    ventaResponse.getNumeroFactura(),
                    ventaResponse.getTotal(),
                    ventaResponse.getFecha(),
                    "Pago simulado aprobado correctamente"
            );

            return ResponseEntity.ok(pagoResponse);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", e.getMessage()));
        }
    }
}
