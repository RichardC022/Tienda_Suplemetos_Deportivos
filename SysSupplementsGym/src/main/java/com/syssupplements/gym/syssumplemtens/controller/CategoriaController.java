package com.syssupplements.gym.syssumplemtens.controller;

import com.syssupplements.gym.model.catalogo.Categoria;
import com.syssupplements.gym.syssumplemtens.service.CategoriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/*
 * Controller para gestionar las categorías de productos.
 * Se crea porque el frontend necesita un endpoint para obtener
 * las categorías y usarlas como filtro en el catálogo y en el
 * formulario de productos del admin.
 */
@RestController
@RequestMapping("/api/categorias")
@RequiredArgsConstructor
public class CategoriaController {

    private final CategoriaService categoriaService;

    @GetMapping
    public List<Categoria> listarTodas() {
        return categoriaService.listarTodas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Integer id) {
        Categoria categoria = categoriaService.obtenerPorId(id);
        if (categoria != null) {
            return ResponseEntity.ok(categoria);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Categoria> crear(@RequestBody Categoria categoria) {
        return ResponseEntity.ok(categoriaService.guardar(categoria));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Integer id, @RequestBody Categoria categoria) {
        Categoria existente = categoriaService.obtenerPorId(id);
        if (existente != null) {
            categoria.setId(id);
            return ResponseEntity.ok(categoriaService.actualizar(categoria));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        Categoria existente = categoriaService.obtenerPorId(id);
        if (existente != null) {
            categoriaService.eliminar(id);
            return ResponseEntity.ok(Map.of("mensaje", "Categoría eliminada correctamente"));
        }
        return ResponseEntity.notFound().build();
    }
}
