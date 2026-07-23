package com.syssupplements.gym.service;

import com.syssupplements.gym.model.seguridad.Persona;
import com.syssupplements.gym.model.seguridad.Usuario;
import com.syssupplements.gym.repository.PersonaRepository;
import com.syssupplements.gym.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/*
 * Service para la gestión administrativa de usuarios.
 * Se separa de AuthService porque AuthService maneja autenticación
 * y registro, mientras que este Service maneja la administración
 * de usuarios (CRUD completo para el módulo admin).
 */
@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UserRepository userRepository;
    private final PersonaRepository personaRepository;

    public Usuario guardar(Usuario usuario) {
        return userRepository.save(usuario);
    }

    public Usuario obtenerPorId(Integer id) {
        return userRepository.findById(id).orElse(null);
    }

    public List<Usuario> listarTodos() {
        return userRepository.findAll();
    }

    public Usuario actualizar(Usuario usuario) {
        return userRepository.save(usuario);
    }

    @Transactional
    public void eliminar(Integer id) {
        Usuario usuario = userRepository.findById(id).orElse(null);
        if (usuario == null) return;

        Persona persona = usuario.getPersona();
        if (persona != null) {
            persona.setActivo(false);
            personaRepository.save(persona);
        }

        usuario.setPersona(null);
        userRepository.delete(usuario);
    }
}
