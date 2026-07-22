package com.syssupplements.gym.syssumplemtens.controller;

import com.syssupplements.gym.model.inventario.Inventario;
import com.syssupplements.gym.syssumplemtens.service.InventarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/inventario")
@RequiredArgsConstructor
public class InventarioController {

    private final InventarioService inventarioService;

    @GetMapping
    public List<Inventario> listarTodos() {
        return inventarioService.listarTodos();
    }

    @GetMapping("/stock")
    public Map<Integer, Integer> obtenerStockPorProducto() {
        return inventarioService.listarTodos().stream()
                .filter(inv -> inv.getProducto() != null)
                .collect(Collectors.toMap(
                        inv -> inv.getProducto().getId(),
                        Inventario::getStock,
                        (a, b) -> a
                ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Integer id) {
        Inventario inventario = inventarioService.obtenerPorId(id);
        if (inventario != null) {
            return ResponseEntity.ok(inventario);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/producto/{productoId}")
    public ResponseEntity<?> obtenerPorProducto(@PathVariable int productoId) {
        Inventario inventario = inventarioService.obtenerPorProducto(productoId);
        if (inventario != null) {
            return ResponseEntity.ok(inventario);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Inventario> crear(@RequestBody Inventario inventario) {
        return ResponseEntity.ok(inventarioService.guardar(inventario));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Integer id, @RequestBody Inventario inventario) {
        Inventario existente = inventarioService.obtenerPorId(id);
        if (existente != null) {
            inventario.setId(id);
            return ResponseEntity.ok(inventarioService.actualizar(inventario));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        Inventario existente = inventarioService.obtenerPorId(id);
        if (existente != null) {
            inventarioService.eliminar(id);
            return ResponseEntity.ok(Map.of("mensaje", "Registro de inventario eliminado"));
        }
        return ResponseEntity.notFound().build();
    }
}
