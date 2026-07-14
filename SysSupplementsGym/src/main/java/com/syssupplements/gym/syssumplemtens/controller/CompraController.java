package com.syssupplements.gym.syssumplemtens.controller;

import com.syssupplements.gym.model.ventas.Compra;
import com.syssupplements.gym.syssumplemtens.service.CompraService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/compras")
@RequiredArgsConstructor
public class CompraController {

    private final CompraService compraService;

    @GetMapping
    public List<Compra> listarTodas() {
        return compraService.listarTodas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Integer id) {
        Compra compra = compraService.obtenerPorId(id);
        if (compra != null) {
            return ResponseEntity.ok(compra);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/persona/{personaId}")
    public List<Compra> obtenerHistorialPorPersona(@PathVariable int personaId) {
        return compraService.obtenerHistorialPorPersona(personaId);
    }

    @PostMapping
    public ResponseEntity<Compra> crear(@RequestBody Compra compra) {
        return ResponseEntity.ok(compraService.registrarCompra(compra));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Integer id, @RequestBody Compra compra) {
        Compra existente = compraService.obtenerPorId(id);
        if (existente != null) {
            compra.setId(id);
            return ResponseEntity.ok(compraService.actualizar(compra));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        Compra existente = compraService.obtenerPorId(id);
        if (existente != null) {
            compraService.eliminar(id);
            return ResponseEntity.ok(Map.of("mensaje", "Compra eliminada correctamente"));
        }
        return ResponseEntity.notFound().build();
    }
}
