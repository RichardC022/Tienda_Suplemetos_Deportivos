package com.syssupplements.gym.syssumplemtens.controller;

import com.syssupplements.gym.model.catalogo.Producto;
import com.syssupplements.gym.syssumplemtens.service.ProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoService productoService;

    @GetMapping
    public List<Producto> listarTodos() {
        return productoService.listarTodos();
    }

    @GetMapping("/buscar")
    public List<Producto> buscar(@RequestParam String q) {
        return productoService.buscar(q);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Integer id) {
        Producto producto = productoService.obtenerPorId(id);
        if (producto != null) {
            return ResponseEntity.ok(producto);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/categoria/{categoriaId}")
    public List<Producto> obtenerPorCategoria(@PathVariable int categoriaId) {
        return productoService.obtenerPorCategoria(categoriaId);
    }

    @PostMapping
    public ResponseEntity<Producto> crear(@RequestBody Producto producto) {
        return ResponseEntity.ok(productoService.guardar(producto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Integer id, @RequestBody Producto producto) {
        Producto existente = productoService.obtenerPorId(id);
        if (existente != null) {
            producto.setId(id);
            return ResponseEntity.ok(productoService.actualizar(producto));
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/imagen")
    public ResponseEntity<?> subirImagen(@PathVariable Integer id,
                                          @RequestParam("archivo") MultipartFile archivo) {
        Producto producto = productoService.obtenerPorId(id);
        if (producto == null) {
            return ResponseEntity.notFound().build();
        }

        String imagenUrl = productoService.subirImagen(producto, archivo);
        if (imagenUrl == null) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", "Formato de imagen no valido. Use JPG, PNG o WebP."));
        }

        return ResponseEntity.ok(Map.of("imagenUrl", imagenUrl));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        Producto existente = productoService.obtenerPorId(id);
        if (existente != null) {
            productoService.eliminar(id);
            return ResponseEntity.ok(Map.of("mensaje", "Producto eliminado correctamente"));
        }
        return ResponseEntity.notFound().build();
    }
}
