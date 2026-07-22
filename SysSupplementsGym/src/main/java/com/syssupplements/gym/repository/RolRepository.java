package com.syssupplements.gym.repository;

import com.syssupplements.gym.model.seguridad.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/*
 * Repository para la entidad Rol. Los roles controlan los permisos
 * de acceso del usuario (ADMIN, CLIENTE, etc.).
 * Se crea porque se necesita consultar roles al momento de
 * registrar usuarios y asignar permisos.
 */
@Repository
public interface RolRepository extends JpaRepository<Rol, Integer> {

    /*
     * Busca un rol por su nombre (ej: "ADMIN", "CLIENTE").
     * Se usa al registrar un nuevo usuario para asignarle su rol.
     */
    Rol findFirstByNombre(String nombre);
}
