package com.syssupplements.gym.service;

import com.syssupplements.gym.model.seguridad.Persona;
import com.syssupplements.gym.model.seguridad.Rol;
import com.syssupplements.gym.model.seguridad.Usuario;
import com.syssupplements.gym.dto.*;
import com.syssupplements.gym.repository.PersonaRepository;
import com.syssupplements.gym.repository.RolRepository;
import com.syssupplements.gym.repository.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PersonaRepository personaRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;
    private final PinEncoder pinEncoder;
    private final EmailService emailService;

    @PersistenceContext
    private EntityManager entityManager;

    private final ConcurrentHashMap<String, TempSession> tempSessions = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, RecoveryCode> recoveryCodes = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, String> recoveryTokens = new ConcurrentHashMap<>();

    @Transactional
    public LoginResponse login(LoginRequest request) {
        LoginUsuarioProjection u = userRepository.findLoginDataByCorreo(request.getCorreo());
        if (u == null) {
            return null;
        }

        if (!passwordEncoder.matches(request.getClave(), u.getClave())) {
            userRepository.updateIntentoFallido(u.getId(), u.getIntentoFallido() + 1);
            return null;
        }

        if (u.getIntentoFallido() != null && u.getIntentoFallido() > 0) {
            userRepository.updateIntentoFallido(u.getId(), 0);
        }

        String tempToken = UUID.randomUUID().toString();
        String nombre = u.getPersonaNombre() != null ? u.getPersonaNombre() : request.getCorreo();
        String rol = u.getRolNombre() != null ? u.getRolNombre() : "CLIENTE";
        boolean tienePin = u.getPinHash() != null && !u.getPinHash().isEmpty();

        tempSessions.put(tempToken, new TempSession(
                u.getId(),
                u.getPinHash(),
                LocalDateTime.now().plusMinutes(5)
        ));

        return new LoginResponse(tempToken, u.getId(), u.getPersonaId(), request.getCorreo(), nombre, rol, tienePin);
    }

    public boolean verificarPin(String tempToken, String pin) {
        TempSession session = tempSessions.get(tempToken);
        if (session == null || session.expirado()) {
            tempSessions.remove(tempToken);
            return false;
        }

        tempSessions.remove(tempToken);
        return session.pinHash() != null && pinEncoder.matches(pin, session.pinHash());
    }

    @Transactional
    public void registrar(RegistroRequest request) {
        Persona persona = new Persona();
        persona.setNombre(request.getPersona().getNombre());
        persona.setApellido(request.getPersona().getApellido());
        persona.setTelefono(request.getPersona().getTelefono());

        Rol rolCliente = rolRepository.findFirstByNombre("CLIENTE");
        if (rolCliente == null) {
            rolCliente = new Rol();
            rolCliente.setNombre("CLIENTE");
        }

        Usuario usuario = new Usuario();
        usuario.setCorreo(request.getCorreo());
        usuario.setClave(passwordEncoder.encode(request.getClave()));
        usuario.setPinHash(pinEncoder.encode(request.getPin()));
        usuario.setIntentoFallido(0);
        usuario.setPersona(persona);
        usuario.setRol(rolCliente);

        entityManager.persist(persona);
        entityManager.persist(rolCliente);
        entityManager.persist(usuario);
        entityManager.flush();

        log.info("Usuario registrado: {}", request.getCorreo());
    }

    @Transactional
    public void registrarAdmin(RegistroRequest request) {
        Persona persona = new Persona();
        persona.setNombre(request.getPersona().getNombre());
        persona.setApellido(request.getPersona().getApellido());
        persona.setTelefono(request.getPersona().getTelefono());

        Rol rolAdmin = rolRepository.findFirstByNombre("ADMIN");
        if (rolAdmin == null) {
            rolAdmin = new Rol();
            rolAdmin.setNombre("ADMIN");
        }

        Usuario usuario = new Usuario();
        usuario.setCorreo(request.getCorreo());
        usuario.setClave(passwordEncoder.encode(request.getClave()));
        usuario.setPinHash(pinEncoder.encode(request.getPin()));
        usuario.setIntentoFallido(0);
        usuario.setPersona(persona);
        usuario.setRol(rolAdmin);

        entityManager.persist(persona);
        entityManager.persist(rolAdmin);
        entityManager.persist(usuario);
        entityManager.flush();

        log.info("Admin registrado: {}", request.getCorreo());
    }

    public boolean existeCorreo(String correo) {
        return userRepository.existsByCorreo(correo);
    }

    public boolean existeDocumento(String documento) {
        return personaRepository.existsByDocumento(documento);
    }

    public void generarCodigoRecuperacion(String correo) {
        String codigo = String.format("%06d", (int) (Math.random() * 1000000));

        recoveryCodes.put(correo, new RecoveryCode(
                codigo,
                LocalDateTime.now().plusMinutes(5)
        ));

        emailService.enviarCodigoRecuperacionAsync(correo, codigo);
    }

    public boolean verificarCodigoRecuperacion(String correo, String codigo) {
        RecoveryCode code = recoveryCodes.get(correo);
        if (code == null || code.expirado()) return false;
        return code.codigo().equals(codigo);
    }

    public String generarRecoveryToken(String correo) {
        String token = UUID.randomUUID().toString();
        recoveryTokens.put(token, correo);
        recoveryCodes.remove(correo);
        return token;
    }

    @Transactional
    public boolean restablecerPin(String recoveryToken, String nuevoPin) {
        String correo = recoveryTokens.get(recoveryToken);
        if (correo == null) return false;
        recoveryTokens.remove(recoveryToken);

        Usuario usuario = userRepository.findFirstByCorreo(correo);
        if (usuario == null) return false;

        usuario.setPinHash(pinEncoder.encode(nuevoPin));
        userRepository.save(usuario);
        log.info("PIN restablecido para: {}", correo);
        return true;
    }

    public Usuario actualizar(Usuario usuario) {
        return userRepository.save(usuario);
    }

    public void eliminar(Integer id) {
        userRepository.deleteById(id);
    }

    private record TempSession(Integer usuarioId, String pinHash, LocalDateTime expiracion) {
        boolean expirado() { return LocalDateTime.now().isAfter(expiracion); }
    }

    private record RecoveryCode(String codigo, LocalDateTime expiracion) {
        boolean expirado() { return LocalDateTime.now().isAfter(expiracion); }
    }
}
