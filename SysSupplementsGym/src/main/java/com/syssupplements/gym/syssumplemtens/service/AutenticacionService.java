package com.syssupplements.gym.syssumplemtens.service;

import com.syssupplements.gym.model.seguridad.Persona;
import com.syssupplements.gym.model.seguridad.Rol;
import com.syssupplements.gym.model.seguridad.Usuario;
import com.syssupplements.gym.syssumplemtens.repository.PersonaRepository;
import com.syssupplements.gym.syssumplemtens.repository.RolRepository;
import com.syssupplements.gym.syssumplemtens.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AutenticacionService {

    private final UsuarioRepository usuarioRepository;
    private final PersonaRepository personaRepository;
    private final RolRepository rolRepository;

    public Usuario registrar(Usuario usuario) {
        if (usuario.getPersona() != null) {
            Persona personaGuardada = personaRepository.save(usuario.getPersona());
            usuario.setPersona(personaGuardada);
        }

        if (usuario.getRol() == null) {
            Rol rolCliente = rolRepository.findFirstByNombre("CLIENTE");
            if (rolCliente == null) {
                rolCliente = new Rol();
                rolCliente.setNombre("CLIENTE");
                rolCliente = rolRepository.save(rolCliente);
            }
            usuario.setRol(rolCliente);
        }

        usuario.setIntentoFallido(0);

        return usuarioRepository.save(usuario);
    }

    public Usuario login(String correo, String clave) {
        Usuario usuario = usuarioRepository.findFirstByCorreo(correo);
        if (usuario != null && usuario.getClave().equals(clave)) {
            usuario.setIntentoFallido(0);
            usuarioRepository.save(usuario);
            return usuario;
        }

        if (usuario != null) {
            usuario.setIntentoFallido(usuario.getIntentoFallido() + 1);
            usuarioRepository.save(usuario);
        }

        return null;
    }

    public Usuario obtenerPorId(Integer id) {
        return usuarioRepository.findById(id).orElse(null);
    }

    public boolean existeCorreo(String correo) {
        return usuarioRepository.existsByCorreo(correo);
    }

    public Usuario actualizar(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    public void eliminar(Integer id) {
        usuarioRepository.deleteById(id);
    }

    public Usuario registrarAdmin(Usuario usuario) {
        if (usuario.getPersona() != null) {
            Persona personaGuardada = personaRepository.save(usuario.getPersona());
            usuario.setPersona(personaGuardada);
        }

        Rol rolAdmin = rolRepository.findFirstByNombre("ADMIN");
        if (rolAdmin == null) {
            rolAdmin = new Rol();
            rolAdmin.setNombre("ADMIN");
            rolAdmin = rolRepository.save(rolAdmin);
        }
        usuario.setRol(rolAdmin);
        usuario.setIntentoFallido(0);

        return usuarioRepository.save(usuario);
    }
}
