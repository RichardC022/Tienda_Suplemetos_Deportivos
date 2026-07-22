package com.syssupplements.gym.repository;

import com.syssupplements.gym.model.ventas.Compra;
import com.syssupplements.gym.model.ventas.TipoVenta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PurchaseRepository extends JpaRepository<Compra, Integer> {

    List<Compra> findByPersonaId(int personaId);

    List<Compra> findByTipoVentaOrderByFechaDesc(TipoVenta tipoVenta);
}
