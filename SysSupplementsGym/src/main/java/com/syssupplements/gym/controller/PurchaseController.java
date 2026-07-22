package com.syssupplements.gym.controller;

import com.syssupplements.gym.model.ventas.Compra;
import com.syssupplements.gym.model.ventas.TipoVenta;
import com.syssupplements.gym.dto.CompraOnlineRequest;
import com.syssupplements.gym.dto.VentaManualResponse;
import com.syssupplements.gym.service.PurchaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/compras")
@RequiredArgsConstructor
public class PurchaseController {

    private final PurchaseService purchaseService;

    @GetMapping
    public List<Compra> listarTodas() {
        return purchaseService.listarTodas();
    }

    @GetMapping("/tipo/{tipo}")
    public List<Compra> listarPorTipo(@PathVariable String tipo) {
        try {
            TipoVenta tipoVenta = TipoVenta.valueOf(tipo.toUpperCase());
            return purchaseService.listarPorTipo(tipoVenta);
        } catch (IllegalArgumentException e) {
            return List.of();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Integer id) {
        Compra compra = purchaseService.obtenerPorId(id);
        if (compra != null) {
            return ResponseEntity.ok(compra);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/persona/{personaId}")
    public List<Compra> obtenerHistorialPorPersona(@PathVariable int personaId) {
        return purchaseService.obtenerHistorialPorPersona(personaId);
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody CompraOnlineRequest request) {
        try {
            VentaManualResponse response = purchaseService.registrarCompraOnline(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Integer id, @RequestBody Compra compra) {
        Compra existente = purchaseService.obtenerPorId(id);
        if (existente != null) {
            compra.setId(id);
            return ResponseEntity.ok(purchaseService.actualizar(compra));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        Compra existente = purchaseService.obtenerPorId(id);
        if (existente != null) {
            purchaseService.eliminar(id);
            return ResponseEntity.ok(Map.of("mensaje", "Compra eliminada correctamente"));
        }
        return ResponseEntity.notFound().build();
    }
}
