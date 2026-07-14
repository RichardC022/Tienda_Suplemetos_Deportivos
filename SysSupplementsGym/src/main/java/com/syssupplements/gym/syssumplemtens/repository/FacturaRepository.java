package com.syssupplements.gym.syssumplemtens.repository;

import com.syssupplements.gym.model.ventas.Factura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/*
 * Repository para la entidad Factura. Las facturas se generan
 * automáticamente después de completar una compra.
 */
@Repository
public interface FacturaRepository extends JpaRepository<Factura, Integer> {

    /*
     * Busca una factura por su número de factura único.
     * Se usa para consultas de facturación y reportes.
     */
    Factura findByNumero(String numero);
}
