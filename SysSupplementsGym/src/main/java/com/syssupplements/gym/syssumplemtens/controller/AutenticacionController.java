package com.syssupplements.gym.syssumplemtens.controller;

import com.syssupplements.gym.model.seguridad.Usuario;
import com.syssupplements.gym.syssumplemtens.service.AutenticacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AutenticacionController {

    private final AutenticacionService autenticacionService;

    @GetMapping("/login")
    public ResponseEntity<?> loginInfo() {
        return ResponseEntity.ok(Map.of(
                "mensaje", "Endpoint de login - Usa POST con JSON {correo, clave}",
                "metodo", "POST",
                "body_ejemplo", Map.of("correo", "ejemplo@mail.com", "clave", "1234")
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credenciales) {
        String correo = credenciales.get("correo");
        String clave = credenciales.get("clave");

        if (correo == null || clave == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "El correo y la clave son obligatorios"));
        }

        Usuario usuario = autenticacionService.login(correo, clave);
        if (usuario != null) {
            return ResponseEntity.ok(usuario);
        }

        return ResponseEntity.status(401)
                .body(Map.of("error", "Credenciales incorrectas"));
    }

    @GetMapping("/registro")
    public ResponseEntity<?> registroInfo() {
        return ResponseEntity.ok(Map.of(
                "mensaje", "Endpoint de registro - Usa POST con JSON {persona, correo, clave}",
                "metodo", "POST",
                "body_ejemplo", Map.of(
                        "correo", "nuevo@mail.com",
                        "clave", "1234",
                        "persona", Map.of("nombre", "Juan", "apellido", "Perez", "telefono", "099123456")
                )
        ));
    }

    @GetMapping("/check-email")
    public ResponseEntity<?> verificarCorreo(@RequestParam String correo) {
        boolean existe = autenticacionService.existeCorreo(correo);
        return ResponseEntity.ok(Map.of("existe", existe));
    }

    @GetMapping("/check-documento")
    public ResponseEntity<?> verificarDocumento(@RequestParam String documento) {
        boolean existe = autenticacionService.existeDocumento(documento);
        return ResponseEntity.ok(Map.of("existe", existe));
    }

    @PostMapping("/registro")
    public ResponseEntity<?> registrar(@RequestBody Usuario usuario) {
        try {
            Usuario nuevoUsuario = autenticacionService.registrar(usuario);
            return ResponseEntity.ok(nuevoUsuario);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Error al registrar usuario: " + e.getMessage()));
        }
    }

    @PostMapping("/registro-admin")
    public ResponseEntity<?> registrarAdmin(@RequestBody Usuario usuario) {
        try {
            Usuario nuevoAdmin = autenticacionService.registrarAdmin(usuario);
            return ResponseEntity.ok(nuevoAdmin);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Error al registrar admin: " + e.getMessage()));
        }
    }
}
