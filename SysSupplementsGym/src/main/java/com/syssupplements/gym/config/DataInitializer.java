package com.syssupplements.gym.config;

import com.syssupplements.gym.model.seguridad.Persona;
import com.syssupplements.gym.model.seguridad.Rol;
import com.syssupplements.gym.model.seguridad.Usuario;
import com.syssupplements.gym.syssumplemtens.repository.PersonaRepository;
import com.syssupplements.gym.syssumplemtens.repository.RolRepository;
import com.syssupplements.gym.syssumplemtens.repository.UsuarioRepository;
import com.syssupplements.gym.syssumplemtens.service.PinEncoder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final RolRepository rolRepository;
    private final PersonaRepository personaRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final PinEncoder pinEncoder;

    @Override
    public void run(String... args) {
        crearRoles();
        crearAdminPorDefecto();
    }

    private void crearRoles() {
        if (rolRepository.findFirstByNombre("ADMIN") == null) {
            Rol rol = new Rol();
            rol.setNombre("ADMIN");
            rolRepository.save(rol);
            log.info("Rol ADMIN creado");
        }

        if (rolRepository.findFirstByNombre("CLIENTE") == null) {
            Rol rol = new Rol();
            rol.setNombre("CLIENTE");
            rolRepository.save(rol);
            log.info("Rol CLIENTE creado");
        }
    }

    private void crearAdminPorDefecto() {
        Usuario adminExistente = usuarioRepository.findFirstByCorreo("admin@sys.com");
        if (adminExistente == null) {
            Persona persona = new Persona();
            persona.setNombre("Admin");
            persona.setApellido("Sistema");
            persona.setTelefono("000000000");
            persona = personaRepository.save(persona);

            Usuario admin = new Usuario();
            admin.setCorreo("admin@sys.com");
            admin.setClave(passwordEncoder.encode("admin123"));
            admin.setPinHash(pinEncoder.encode("1234"));
            admin.setIntentoFallido(0);
            admin.setPersona(persona);
            admin.setRol(rolRepository.findFirstByNombre("ADMIN"));
            usuarioRepository.save(admin);

            log.info("Admin creado - Correo: admin@sys.com | Clave: admin123 | PIN: 1234");
        } else {
            boolean needsUpdate = false;
            if (adminExistente.getPinHash() == null || adminExistente.getPinHash().startsWith("$2a$")) {
                adminExistente.setPinHash(pinEncoder.encode("1234"));
                needsUpdate = true;
                log.info("Admin PIN migrado a SHA-256");
            }
            if (adminExistente.getClave() == null || !adminExistente.getClave().startsWith("$2a$")) {
                adminExistente.setClave(passwordEncoder.encode("admin123"));
                needsUpdate = true;
                log.info("Admin password migrado a BCrypt");
            }
            if (needsUpdate) {
                usuarioRepository.save(adminExistente);
            }
        }
    }
}
