package com.syssupplements.gym.repository;

import com.syssupplements.gym.model.inventario.Inventario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InventoryRepository extends JpaRepository<Inventario, Integer> {

    Inventario findByProductoId(int productoId);
}
