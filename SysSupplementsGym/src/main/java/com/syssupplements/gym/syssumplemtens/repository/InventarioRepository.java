package com.syssupplements.gym.syssumplemtens.repository;

import com.syssupplements.gym.model.inventario.Inventario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InventarioRepository extends JpaRepository<Inventario, Integer> {

    Inventario findByProductoId(int productoId);
}
