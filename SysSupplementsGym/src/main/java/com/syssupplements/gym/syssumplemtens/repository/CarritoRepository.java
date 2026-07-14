package com.syssupplements.gym.syssumplemtens.repository;

import com.syssupplements.gym.model.ventas.Carrito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/*
 * Repository para la entidad Carrito. Gestiona las sesiones de compra
 * activas antes de que se conviertan en una Compra formal.
 */
@Repository
public interface CarritoRepository extends JpaRepository<Carrito, Integer> {
}
