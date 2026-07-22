package com.syssupplements.gym.service;

import com.syssupplements.gym.model.catalogo.Producto;
import com.syssupplements.gym.model.entrega.DireccionEntrega;
import com.syssupplements.gym.model.entrega.EstadoEntrega;
import com.syssupplements.gym.model.inventario.Inventario;
import com.syssupplements.gym.model.seguridad.Persona;
import com.syssupplements.gym.model.ventas.*;
import com.syssupplements.gym.dto.VentaManualRequest;
import com.syssupplements.gym.dto.VentaManualResponse;
import com.syssupplements.gym.repository.*;
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
public class VentaManualService {

    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;
    private final PurchaseRepository purchaseRepository;
    private final DetalleCompraRepository detalleCompraRepository;
    private final FacturaRepository facturaRepository;
    private final PersonaRepository personaRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public VentaManualResponse registrarVenta(VentaManualRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new RuntimeException("Debe agregar al menos un producto");
        }
        if (request.getMetodoPago() == null || request.getMetodoPago().isBlank()) {
            throw new RuntimeException("Debe seleccionar un metodo de pago");
        }

        float total = 0f;

        for (VentaManualRequest.VentaManualItem item : request.getItems()) {
            if (item.getCantidad() == null || item.getCantidad() <= 0) {
                throw new RuntimeException("La cantidad del producto debe ser mayor a 0");
            }
            Producto producto = productRepository.findById(item.getProductoId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado: ID " + item.getProductoId()));
            if (!Boolean.TRUE.equals(producto.getEstado())) {
                throw new RuntimeException("El producto '" + producto.getNombre() + "' no esta activo");
            }

            Inventario inventario = inventoryRepository.findByProductoId(item.getProductoId());
            if (inventario == null) {
                throw new RuntimeException("No hay inventario para el producto: " + producto.getNombre());
            }
            if (inventario.getStock() < item.getCantidad()) {
                throw new RuntimeException("Stock insuficiente para '" + producto.getNombre()
                        + "'. Disponible: " + inventario.getStock() + ", solicitado: " + item.getCantidad());
            }

            item.setPrecioUnitario(producto.getPrecio());
            total += producto.getPrecio() * item.getCantidad();
        }

        Persona persona = new Persona();
        persona.setNombre(request.getClienteNombre());
        persona.setApellido(request.getClienteApellido());
        persona.setTelefono(request.getClienteTelefono());
        persona.setDocumento(request.getClienteDocumento());
        persona.setTipoDocumento("CEDULA");
        persona = personaRepository.save(persona);

        DireccionEntrega direccion = new DireccionEntrega();
        direccion.setCallePrincipal(request.getDireccionCallePrincipal());
        direccion.setCalleSecundaria(request.getDireccionCalleSecundaria());
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
        compra.setTipoVenta(TipoVenta.MANUAL);
        compra = purchaseRepository.save(compra);

        for (VentaManualRequest.VentaManualItem item : request.getItems()) {
            Producto producto = productRepository.findById(item.getProductoId())
                    .orElseThrow();

            DetalleCompra detalle = new DetalleCompra();
            detalle.setCantidad(item.getCantidad());
            detalle.setPrecioU(item.getPrecioUnitario());
            detalle.setSubtotal(item.getPrecioUnitario() * item.getCantidad());
            detalle.setCompra(compra);
            detalle.setProducto(producto);
            detalleCompraRepository.save(detalle);
        }

        for (VentaManualRequest.VentaManualItem item : request.getItems()) {
            Inventario inventario = inventoryRepository.findByProductoId(item.getProductoId());
            inventario.setStock(inventario.getStock() - item.getCantidad());
            inventoryRepository.save(inventario);
        }

        String numeroFactura = "FV-" + String.format("%06d", compra.getId());
        Factura factura = new Factura();
        factura.setFecha(new Date());
        factura.setTotal(total);
        factura.setNumero(numeroFactura);
        factura.setCompra(compra);
        facturaRepository.save(factura);

        compra.setFactura(factura);
        purchaseRepository.save(compra);

        log.info("Venta manual registrada: Compra ID={}, Factura={}, Total={}",
                compra.getId(), numeroFactura, total);

        return new VentaManualResponse(compra.getId(), numeroFactura, total, compra.getFecha());
    }
}
