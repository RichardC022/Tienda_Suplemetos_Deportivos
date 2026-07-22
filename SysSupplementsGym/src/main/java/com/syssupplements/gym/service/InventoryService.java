package com.syssupplements.gym.service;

import com.syssupplements.gym.model.catalogo.Producto;
import com.syssupplements.gym.model.inventario.Inventario;
import com.syssupplements.gym.repository.InventoryRepository;
import com.syssupplements.gym.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;

    public Inventario guardar(Inventario inventario) {
        if (inventario.getProducto() != null && inventario.getProducto().getId() != null) {
            Producto producto = productRepository.findById(inventario.getProducto().getId()).orElse(null);
            inventario.setProducto(producto);
        }
        return inventoryRepository.save(inventario);
    }

    public Inventario obtenerPorId(Integer id) {
        return inventoryRepository.findById(id).orElse(null);
    }

    public List<Inventario> listarTodos() {
        return inventoryRepository.findAll();
    }

    public Inventario obtenerPorProducto(int productoId) {
        return inventoryRepository.findByProductoId(productoId);
    }

    public boolean reducirStock(int productoId, int cantidad) {
        Inventario inventario = inventoryRepository.findByProductoId(productoId);
        if (inventario != null && inventario.getStock() >= cantidad) {
            inventario.setStock(inventario.getStock() - cantidad);
            inventoryRepository.save(inventario);
            return true;
        }
        return false;
    }

    public void aumentarStock(int productoId, int cantidad) {
        Inventario inventario = inventoryRepository.findByProductoId(productoId);
        if (inventario != null) {
            inventario.setStock(inventario.getStock() + cantidad);
            inventoryRepository.save(inventario);
        }
    }

    public Inventario actualizar(Inventario inventario) {
        if (inventario.getProducto() != null && inventario.getProducto().getId() != null) {
            Producto producto = productRepository.findById(inventario.getProducto().getId()).orElse(null);
            inventario.setProducto(producto);
        }
        return inventoryRepository.save(inventario);
    }

    public void eliminar(Integer id) {
        inventoryRepository.deleteById(id);
    }
}
