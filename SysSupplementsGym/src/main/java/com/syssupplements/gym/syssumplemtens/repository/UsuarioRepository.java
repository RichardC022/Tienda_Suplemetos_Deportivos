package com.syssupplements.gym.syssumplemtens.repository;

import com.syssupplements.gym.model.seguridad.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    Usuario findFirstByCorreo(String correo);
    boolean existsByCorreo(String correo);
}
