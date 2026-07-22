package com.syssupplements.gym.service;

import com.syssupplements.gym.model.ventas.Factura;
import com.syssupplements.gym.repository.FacturaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/*
 * Service para gestionar las facturas generadas a partir de las compras.
 * Las facturas se generan automáticamente después de completar una compra.
 */
@Service
@RequiredArgsConstructor
public class FacturaService {

    private final FacturaRepository facturaRepository;

    public Factura guardar(Factura factura) {
        return facturaRepository.save(factura);
    }

    public Factura obtenerPorId(Integer id) {
        return facturaRepository.findById(id).orElse(null);
    }

    public List<Factura> listarTodas() {
        return facturaRepository.findAll();
    }

    /*
     * Busca una factura por su número único.
     * Se usa para consultas de facturación y para que los clientes
     * puedan consultar sus facturas por número.
     */
    public Factura obtenerPorNumero(String numero) {
        return facturaRepository.findByNumero(numero);
    }

    public Factura actualizar(Factura factura) {
        return facturaRepository.save(factura);
    }

    public void eliminar(Integer id) {
        facturaRepository.deleteById(id);
    }
}
