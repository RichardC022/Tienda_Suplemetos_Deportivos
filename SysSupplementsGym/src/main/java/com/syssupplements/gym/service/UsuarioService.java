package com.syssupplements.gym.service;

import com.syssupplements.gym.model.seguridad.Usuario;
import com.syssupplements.gym.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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

    public void eliminar(Integer id) {
        userRepository.deleteById(id);
    }
}
