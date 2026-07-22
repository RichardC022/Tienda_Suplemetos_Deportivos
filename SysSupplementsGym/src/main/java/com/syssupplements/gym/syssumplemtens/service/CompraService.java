package com.syssupplements.gym.syssumplemtens.service;

import com.syssupplements.gym.model.catalogo.Producto;
import com.syssupplements.gym.model.entrega.DireccionEntrega;
import com.syssupplements.gym.model.entrega.EstadoEntrega;
import com.syssupplements.gym.model.inventario.Inventario;
import com.syssupplements.gym.model.seguridad.Persona;
import com.syssupplements.gym.model.ventas.*;
import com.syssupplements.gym.syssumplemtens.dto.CompraOnlineRequest;
import com.syssupplements.gym.syssumplemtens.dto.VentaManualResponse;
import com.syssupplements.gym.syssumplemtens.repository.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CompraService {

    private final CompraRepository compraRepository;
    private final DetalleCompraRepository detalleCompraRepository;
    private final FacturaRepository facturaRepository;
    private final InventarioRepository inventarioRepository;
    private final ProductoRepository productoRepository;
    private final PersonaRepository personaRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public Compra registrarCompra(Compra compra) {
        return compraRepository.save(compra);
    }

    @Transactional
    public VentaManualResponse registrarCompraOnline(CompraOnlineRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new RuntimeException("Debe agregar al menos un producto");
        }
        if (request.getMetodoPago() == null || request.getMetodoPago().isBlank()) {
            throw new RuntimeException("Debe seleccionar un metodo de pago");
        }

        float total = 0f;

        for (CompraOnlineRequest.CompraOnlineItem item : request.getItems()) {
            if (item.getCantidad() == null || item.getCantidad() <= 0) {
                throw new RuntimeException("La cantidad del producto debe ser mayor a 0");
            }
            Producto producto = productoRepository.findById(item.getProductoId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado: ID " + item.getProductoId()));
            if (!Boolean.TRUE.equals(producto.getEstado())) {
                throw new RuntimeException("El producto '" + producto.getNombre() + "' no esta activo");
            }

            Inventario inventario = inventarioRepository.findByProductoId(item.getProductoId());
            if (inventario == null) {
                throw new RuntimeException("No hay inventario para el producto: " + producto.getNombre());
            }
            if (inventario.getStock() < item.getCantidad()) {
                throw new RuntimeException("Stock insuficiente para '" + producto.getNombre()
                        + "'. Disponible: " + inventario.getStock() + ", solicitado: " + item.getCantidad());
            }

            total += producto.getPrecio() * item.getCantidad();
        }

        Persona persona = personaRepository.findById(request.getPersonaId())
                .orElseThrow(() -> new RuntimeException("Persona no encontrada"));

        DireccionEntrega direccion = new DireccionEntrega();
        direccion.setCallePrincipal(request.getDireccionCallePrincipal());
        direccion.setCallleSecundaria(request.getDireccionCalleSecundaria());
        direccion.setNroCasa(request.getDireccionNumeroCasa());
        direccion.setReferencia(request.getDireccionReferencia());
        direccion.setEstadoEntrega(EstadoEntrega.ENTREGADO);
        entityManager.persist(direccion);

        MetodoPago metodoPago;
        try {
            metodoPago = MetodoPago.valueOf(request.getMetodoPago().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Metodo de pago invalido: " + request.getMetodoPago());
        }

        Compra compra = new Compra();
        compra.setFecha(new Date());
        compra.setTotal(total);
        compra.setPersona(persona);
        compra.setMetodoPago(metodoPago);
        compra.setDireccionEntrega(direccion);
        compra.setTipoVenta(TipoVenta.ONLINE);
        compra = compraRepository.save(compra);

        for (CompraOnlineRequest.CompraOnlineItem item : request.getItems()) {
            Producto producto = productoRepository.findById(item.getProductoId()).orElseThrow();
            Float precioUnitario = producto.getPrecio();

            DetalleCompra detalle = new DetalleCompra();
            detalle.setCantidad(item.getCantidad());
            detalle.setPrecioU(precioUnitario);
            detalle.setSubtotal(precioUnitario * item.getCantidad());
            detalle.setCompra(compra);
            detalle.setProducto(producto);
            detalleCompraRepository.save(detalle);
        }

        for (CompraOnlineRequest.CompraOnlineItem item : request.getItems()) {
            Inventario inventario = inventarioRepository.findByProductoId(item.getProductoId());
            inventario.setStock(inventario.getStock() - item.getCantidad());
            inventarioRepository.save(inventario);
        }

        String numeroFactura = "FV-" + String.format("%06d", compra.getId());
        Factura factura = new Factura();
        factura.setFecha(new Date());
        factura.setTotal(total);
        factura.setNumero(numeroFactura);
        factura.setCompra(compra);
        facturaRepository.save(factura);

        compra.setFactura(factura);
        compraRepository.save(compra);

        log.info("Venta online registrada: Compra ID={}, Factura={}, Total={}",
                compra.getId(), numeroFactura, total);

        return new VentaManualResponse(compra.getId(), numeroFactura, total, compra.getFecha());
    }

    public Compra obtenerPorId(Integer id) {
        return compraRepository.findById(id).orElse(null);
    }

    public List<Compra> listarTodas() {
        return compraRepository.findAll();
    }

    public List<Compra> listarPorTipo(TipoVenta tipoVenta) {
        return compraRepository.findByTipoVentaOrderByFechaDesc(tipoVenta);
    }

    public List<Compra> obtenerHistorialPorPersona(int personaId) {
        return compraRepository.findByPersonaId(personaId);
    }

    public Compra actualizar(Compra compra) {
        return compraRepository.save(compra);
    }

    public void eliminar(Integer id) {
        compraRepository.deleteById(id);
    }
}
