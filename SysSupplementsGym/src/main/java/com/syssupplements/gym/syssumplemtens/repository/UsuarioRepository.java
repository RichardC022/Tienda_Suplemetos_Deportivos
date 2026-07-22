package com.syssupplements.gym.syssumplemtens.repository;

import com.syssupplements.gym.model.seguridad.Usuario;
import com.syssupplements.gym.syssumplemtens.dto.LoginUsuarioProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    @Query("SELECT new com.syssupplements.gym.syssumplemtens.dto.LoginUsuarioProjection(" +
           "u.id, p.id, u.clave, u.pinHash, u.intentoFallido, p.nombre, r.nombre) " +
           "FROM Usuario u " +
           "LEFT JOIN u.persona p " +
           "LEFT JOIN u.rol r " +
           "WHERE u.correo = :correo")
    LoginUsuarioProjection findLoginDataByCorreo(@Param("correo") String correo);

    @Modifying
    @Query("UPDATE Usuario u SET u.intentoFallido = :intentos WHERE u.id = :id")
    void updateIntentoFallido(@Param("id") Integer id, @Param("intentos") Integer intentos);

    boolean existsByCorreo(String correo);

    Usuario findFirstByCorreo(String correo);
}
