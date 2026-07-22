package com.syssupplements.gym.syssumplemtens.controller;

import com.syssupplements.gym.syssumplemtens.dto.*;
import com.syssupplements.gym.syssumplemtens.service.AutenticacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AutenticacionController {

    private final AutenticacionService autenticacionService;

    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        if (request.getCorreo() == null || request.getCorreo().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "El correo es obligatorio"));
        }
        if (request.getClave() == null || request.getClave().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "La clave es obligatoria"));
        }
        if (!EMAIL_PATTERN.matcher(request.getCorreo()).matches()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "El formato del correo no es valido"));
        }

        LoginResponse response = autenticacionService.login(request);
        if (response != null) {
            return ResponseEntity.ok(Map.of(
                    "tempToken", response.getTempToken(),
                    "usuarioId", response.getUsuarioId(),
                    "personaId", response.getPersonaId(),
                    "correo", response.getCorreo(),
                    "nombre", response.getNombre(),
                    "rol", response.getRol(),
                    "requierePin", response.isTienePin()
            ));
        }

        return ResponseEntity.status(401)
                .body(Map.of("error", "Correo o contrasena incorrectos"));
    }

    @PostMapping("/verify-pin")
    public ResponseEntity<?> verificarPin(@RequestBody VerifyPinRequest request) {
        if (request.getTempToken() == null || request.getTempToken().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Token de sesion invalido"));
        }
        if (request.getPin() == null || !request.getPin().matches("^\\d{4}$")) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "El PIN debe ser exactamente 4 digitos numericos"));
        }

        boolean valido = autenticacionService.verificarPin(request.getTempToken(), request.getPin());
        if (valido) {
            return ResponseEntity.ok(Map.of("mensaje", "PIN verificado correctamente"));
        }

        return ResponseEntity.status(401)
                .body(Map.of("error", "PIN incorrecto"));
    }

    @PostMapping("/forgot-pin")
    public ResponseEntity<?> forgotPin(@RequestBody ForgotPinRequest request) {
        if (request.getCorreo() == null || request.getCorreo().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "El correo es obligatorio"));
        }
        if (!autenticacionService.existeCorreo(request.getCorreo())) {
            return ResponseEntity.status(404)
                    .body(Map.of("error", "No existe una cuenta con ese correo"));
        }

        autenticacionService.generarCodigoRecuperacion(request.getCorreo());
        return ResponseEntity.ok(Map.of(
                "mensaje", "Se ha enviado un codigo de verificacion a tu correo electronico"
        ));
    }

    @PostMapping("/verify-recovery-code")
    public ResponseEntity<?> verificarCodigoRecuperacion(@RequestBody VerifyRecoveryCodeRequest request) {
        if (request.getCorreo() == null || request.getCodigo() == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Correo y codigo son obligatorios"));
        }
        if (!request.getCodigo().matches("^\\d{6}$")) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "El codigo debe ser exactamente 6 digitos"));
        }

        boolean valido = autenticacionService.verificarCodigoRecuperacion(
                request.getCorreo(), request.getCodigo());
        if (valido) {
            String recoveryToken = autenticacionService.generarRecoveryToken(request.getCorreo());
            return ResponseEntity.ok(Map.of(
                    "mensaje", "Codigo verificado correctamente",
                    "recoveryToken", recoveryToken
            ));
        }

        return ResponseEntity.status(401)
                .body(Map.of("error", "Codigo incorrecto o expirado"));
    }

    @PostMapping("/reset-pin")
    public ResponseEntity<?> resetPin(@RequestBody ResetPinRequest request) {
        if (request.getRecoveryToken() == null || request.getRecoveryToken().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Token de recuperacion invalido"));
        }
        if (request.getNuevoPin() == null || !request.getNuevoPin().matches("^\\d{4}$")) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "El PIN debe ser exactamente 4 digitos numericos"));
        }

        boolean exito = autenticacionService.restablecerPin(
                request.getRecoveryToken(), request.getNuevoPin());
        if (exito) {
            return ResponseEntity.ok(Map.of(
                    "mensaje", "PIN restablecido correctamente. Ya puedes iniciar sesion."
            ));
        }

        return ResponseEntity.status(401)
                .body(Map.of("error", "Token de recuperacion invalido o expirado"));
    }

    @PostMapping("/registro")
    public ResponseEntity<?> registrar(@RequestBody RegistroRequest request) {
        if (request.getCorreo() == null || request.getCorreo().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "El correo es obligatorio"));
        }
        if (request.getClave() == null || request.getClave().length() < 4) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "La contrasena debe tener al menos 4 caracteres"));
        }
        if (request.getPin() == null || !request.getPin().matches("^\\d{4}$")) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "El PIN debe ser exactamente 4 digitos numericos"));
        }
        if (request.getPersona() == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Los datos de persona son obligatorios"));
        }
        if (autenticacionService.existeCorreo(request.getCorreo())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "El correo ya esta registrado"));
        }

        try {
            autenticacionService.registrar(request);
            return ResponseEntity.ok(Map.of("mensaje", "Usuario registrado correctamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Error al registrar usuario: " + e.getMessage()));
        }
    }

    @PostMapping("/registro-admin")
    public ResponseEntity<?> registrarAdmin(@RequestBody RegistroRequest request) {
        try {
            autenticacionService.registrarAdmin(request);
            return ResponseEntity.ok(Map.of("mensaje", "Admin registrado correctamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Error al registrar admin: " + e.getMessage()));
        }
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
}
