package com.syssupplements.gym.controller;

import com.syssupplements.gym.model.ventas.Carrito;
import com.syssupplements.gym.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/carrito")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public List<Carrito> listarTodos() {
        return cartService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Integer id) {
        Carrito carrito = cartService.obtenerPorId(id);
        if (carrito != null) {
            return ResponseEntity.ok(carrito);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Carrito> crear(@RequestBody Carrito carrito) {
        return ResponseEntity.ok(cartService.guardar(carrito));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Integer id, @RequestBody Carrito carrito) {
        Carrito existente = cartService.obtenerPorId(id);
        if (existente != null) {
            carrito.setFechaCreacion(existente.getFechaCreacion());
            return ResponseEntity.ok(cartService.guardar(carrito));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        Carrito existente = cartService.obtenerPorId(id);
        if (existente != null) {
            cartService.eliminar(id);
            return ResponseEntity.ok(Map.of("mensaje", "Carrito eliminado correctamente"));
        }
        return ResponseEntity.notFound().build();
    }
}
