package com.syssupplements.gym.config;

import com.syssupplements.gym.model.seguridad.Persona;
import com.syssupplements.gym.model.seguridad.Rol;
import com.syssupplements.gym.model.seguridad.Usuario;
import com.syssupplements.gym.syssumplemtens.repository.PersonaRepository;
import com.syssupplements.gym.syssumplemtens.repository.RolRepository;
import com.syssupplements.gym.syssumplemtens.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final RolRepository rolRepository;
    private final PersonaRepository personaRepository;
    private final UsuarioRepository usuarioRepository;

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
        if (usuarioRepository.findFirstByCorreo("admin@sys.com") == null) {
            Persona persona = new Persona();
            persona.setNombre("Admin");
            persona.setApellido("Sistema");
            persona.setTelefono("000000000");
            persona = personaRepository.save(persona);

            Usuario admin = new Usuario();
            admin.setCorreo("admin@sys.com");
            admin.setClave("admin123");
            admin.setIntentoFallido(0);
            admin.setPersona(persona);
            admin.setRol(rolRepository.findFirstByNombre("ADMIN"));
            usuarioRepository.save(admin);

            log.info("Usuario admin creado - Correo: admin@sys.com | Clave: admin123");
        }
    }
}
