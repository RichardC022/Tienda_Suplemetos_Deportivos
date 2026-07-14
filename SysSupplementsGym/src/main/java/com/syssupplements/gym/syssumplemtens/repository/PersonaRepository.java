package com.syssupplements.gym.syssumplemtens.repository;

import com.syssupplements.gym.model.seguridad.Persona;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/*
 * Repository para la entidad Persona. Almacena los datos personales
 * de los usuarios/clientes del sistema.
 * Se crea porque Persona es una entidad independiente que puede
 * existir sin un Usuario asociado (por ejemplo, un cliente que solo compra).
 */
@Repository
public interface PersonaRepository extends JpaRepository<Persona, Integer> {
}
