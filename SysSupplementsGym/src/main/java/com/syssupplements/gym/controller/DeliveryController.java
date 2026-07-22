package com.syssupplements.gym.controller;

import com.syssupplements.gym.model.entrega.DireccionEntrega;
import com.syssupplements.gym.model.entrega.EstadoEntrega;
import com.syssupplements.gym.service.DeliveryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/envios")
@RequiredArgsConstructor
public class DeliveryController {

    private final DeliveryService deliveryService;

    @GetMapping
    public List<DireccionEntrega> listarTodas() {
        return deliveryService.listarTodas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Integer id) {
        DireccionEntrega direccion = deliveryService.obtenerPorId(id);
        if (direccion != null) {
            return ResponseEntity.ok(direccion);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/estado/{estado}")
    public List<DireccionEntrega> obtenerPorEstado(@PathVariable EstadoEntrega estado) {
        return deliveryService.obtenerPorEstado(estado);
    }

    @PostMapping
    public ResponseEntity<DireccionEntrega> crear(@RequestBody DireccionEntrega direccion) {
        return ResponseEntity.ok(deliveryService.guardar(direccion));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Integer id, @RequestBody DireccionEntrega direccion) {
        DireccionEntrega existente = deliveryService.obtenerPorId(id);
        if (existente != null) {
            direccion.setId(id);
            return ResponseEntity.ok(deliveryService.actualizar(direccion));
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<?> actualizarEstado(@PathVariable Integer id,
                                              @RequestBody Map<String, String> body) {
        String estadoStr = body.get("estado");
        if (estadoStr == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "El campo 'estado' es obligatorio"));
        }

        try {
            EstadoEntrega nuevoEstado = EstadoEntrega.valueOf(estadoStr);
            DireccionEntrega actualizada = deliveryService.actualizarEstado(id, nuevoEstado);
            if (actualizada != null) {
                return ResponseEntity.ok(actualizada);
            }
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Estado no valido. Use: ENVIADO, EN_PROCESO, ENTREGADO"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        DireccionEntrega existente = deliveryService.obtenerPorId(id);
        if (existente != null) {
            deliveryService.eliminar(id);
            return ResponseEntity.ok(Map.of("mensaje", "Direccion de entrega eliminada"));
        }
        return ResponseEntity.notFound().build();
    }
}
