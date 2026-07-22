package com.syssupplements.gym.repository;

import com.syssupplements.gym.model.ventas.DetalleCompra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/*
 * Repository para la entidad DetalleCompra. CadaDetalleCompra representa
 * un ítem dentro de una Compra (producto, cantidad, precio unitario, subtotal).
 */
@Repository
public interface DetalleCompraRepository extends JpaRepository<DetalleCompra, Integer> {

    /*
     * Busca todos los detalles asociados a una compra específica.
     * Se usa para obtener los ítems de un pedido cuando se consulta
     * el detalle de una compra.
     */
    List<DetalleCompra> findByCompraId(int compraId);
}
