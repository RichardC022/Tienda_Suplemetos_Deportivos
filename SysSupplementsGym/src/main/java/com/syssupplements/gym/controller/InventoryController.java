package com.syssupplements.gym.controller;

import com.syssupplements.gym.model.inventario.Inventario;
import com.syssupplements.gym.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/inventario")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping
    public List<Inventario> listarTodos() {
        return inventoryService.listarTodos();
    }

    @GetMapping("/stock")
    public Map<Integer, Integer> obtenerStockPorProducto() {
        return inventoryService.listarTodos().stream()
                .filter(inv -> inv.getProducto() != null)
                .collect(Collectors.toMap(
                        inv -> inv.getProducto().getId(),
                        Inventario::getStock,
                        (a, b) -> a
                ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Integer id) {
        Inventario inventario = inventoryService.obtenerPorId(id);
        if (inventario != null) {
            return ResponseEntity.ok(inventario);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/producto/{productoId}")
    public ResponseEntity<?> obtenerPorProducto(@PathVariable int productoId) {
        Inventario inventario = inventoryService.obtenerPorProducto(productoId);
        if (inventario != null) {
            return ResponseEntity.ok(inventario);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Inventario> crear(@RequestBody Inventario inventario) {
        return ResponseEntity.ok(inventoryService.guardar(inventario));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Integer id, @RequestBody Inventario inventario) {
        Inventario existente = inventoryService.obtenerPorId(id);
        if (existente != null) {
            inventario.setId(id);
            return ResponseEntity.ok(inventoryService.actualizar(inventario));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        Inventario existente = inventoryService.obtenerPorId(id);
        if (existente != null) {
            inventoryService.eliminar(id);
            return ResponseEntity.ok(Map.of("mensaje", "Registro de inventario eliminado"));
        }
        return ResponseEntity.notFound().build();
    }
}
