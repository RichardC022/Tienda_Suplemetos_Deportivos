package com.syssupplements.gym.syssumplemtens.service;

import com.syssupplements.gym.model.catalogo.Producto;
import com.syssupplements.gym.model.inventario.Inventario;
import com.syssupplements.gym.syssumplemtens.repository.InventarioRepository;
import com.syssupplements.gym.syssumplemtens.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InventarioService {

    private final InventarioRepository inventarioRepository;
    private final ProductoRepository productoRepository;

    public Inventario guardar(Inventario inventario) {
        if (inventario.getProducto() != null && inventario.getProducto().getId() != null) {
            Producto producto = productoRepository.findById(inventario.getProducto().getId()).orElse(null);
            inventario.setProducto(producto);
        }
        return inventarioRepository.save(inventario);
    }

    public Inventario obtenerPorId(Integer id) {
        return inventarioRepository.findById(id).orElse(null);
    }

    public List<Inventario> listarTodos() {
        return inventarioRepository.findAll();
    }

    public Inventario obtenerPorProducto(int productoId) {
        return inventarioRepository.findByProductoId(productoId);
    }

    public boolean reducirStock(int productoId, int cantidad) {
        Inventario inventario = inventarioRepository.findByProductoId(productoId);
        if (inventario != null && inventario.getStock() >= cantidad) {
            inventario.setStock(inventario.getStock() - cantidad);
            inventarioRepository.save(inventario);
            return true;
        }
        return false;
    }

    public void aumentarStock(int productoId, int cantidad) {
        Inventario inventario = inventarioRepository.findByProductoId(productoId);
        if (inventario != null) {
            inventario.setStock(inventario.getStock() + cantidad);
            inventarioRepository.save(inventario);
        }
    }

    public Inventario actualizar(Inventario inventario) {
        if (inventario.getProducto() != null && inventario.getProducto().getId() != null) {
            Producto producto = productoRepository.findById(inventario.getProducto().getId()).orElse(null);
            inventario.setProducto(producto);
        }
        return inventarioRepository.save(inventario);
    }

    public void eliminar(Integer id) {
        inventarioRepository.deleteById(id);
    }
}
