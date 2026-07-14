package com.syssupplements.gym.syssumplemtens.controller;

import com.syssupplements.gym.model.ventas.Carrito;
import com.syssupplements.gym.syssumplemtens.service.CarritoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/carrito")
@RequiredArgsConstructor
public class CarritoController {

    private final CarritoService carritoService;

    @GetMapping
    public List<Carrito> listarTodos() {
        return carritoService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Integer id) {
        Carrito carrito = carritoService.obtenerPorId(id);
        if (carrito != null) {
            return ResponseEntity.ok(carrito);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Carrito> crear(@RequestBody Carrito carrito) {
        return ResponseEntity.ok(carritoService.guardar(carrito));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Integer id, @RequestBody Carrito carrito) {
        Carrito existente = carritoService.obtenerPorId(id);
        if (existente != null) {
            carrito.setFechaCreacion(existente.getFechaCreacion());
            return ResponseEntity.ok(carritoService.guardar(carrito));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        Carrito existente = carritoService.obtenerPorId(id);
        if (existente != null) {
            carritoService.eliminar(id);
            return ResponseEntity.ok(Map.of("mensaje", "Carrito eliminado correctamente"));
        }
        return ResponseEntity.notFound().build();
    }
}
