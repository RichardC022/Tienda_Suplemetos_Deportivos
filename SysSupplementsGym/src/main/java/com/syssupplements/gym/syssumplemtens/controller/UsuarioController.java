package com.syssupplements.gym.syssumplemtens.controller;

import com.syssupplements.gym.model.seguridad.Usuario;
import com.syssupplements.gym.syssumplemtens.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/*
 * Controller para la administracion de usuarios.
 * Se separa de AutenticacionController porque este maneja operaciones CRUD
 * administrativas (listar, editar, eliminar), mientras que AutenticacionController
 * maneja login y registro.
 */
@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping
    public List<Usuario> listarTodos() {
        return usuarioService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Integer id) {
        Usuario usuario = usuarioService.obtenerPorId(id);
        if (usuario != null) {
            return ResponseEntity.ok(usuario);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Integer id, @RequestBody Usuario usuario) {
        Usuario existente = usuarioService.obtenerPorId(id);
        if (existente != null) {
            usuario.setId(id);
            return ResponseEntity.ok(usuarioService.actualizar(usuario));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        Usuario existente = usuarioService.obtenerPorId(id);
        if (existente != null) {
            usuarioService.eliminar(id);
            return ResponseEntity.ok(Map.of("mensaje", "Usuario eliminado correctamente"));
        }
        return ResponseEntity.notFound().build();
    }
}
