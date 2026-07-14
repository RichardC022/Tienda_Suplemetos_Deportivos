package com.syssupplements.gym.syssumplemtens.service;

import com.syssupplements.gym.model.catalogo.Categoria;
import com.syssupplements.gym.model.catalogo.Producto;
import com.syssupplements.gym.syssumplemtens.repository.CategoriaRepository;
import com.syssupplements.gym.syssumplemtens.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;

    public Producto guardar(Producto producto) {
        if (producto.getCategoria() != null && producto.getCategoria().getId() != null) {
            Categoria categoria = categoriaRepository.findById(producto.getCategoria().getId()).orElse(null);
            producto.setCategoria(categoria);
        }
        return productoRepository.save(producto);
    }

    public Producto obtenerPorId(Integer id) {
        return productoRepository.findById(id).orElse(null);
    }

    public List<Producto> listarTodos() {
        return productoRepository.findAll();
    }

    public List<Producto> obtenerPorCategoria(int categoriaId) {
        return productoRepository.findByCategoriaId(categoriaId);
    }

    public List<Producto> obtenerPorEstado(boolean estado) {
        return productoRepository.findByEstado(estado);
    }

    public Producto obtenerPorCodigo(int cod) {
        return productoRepository.findByCod(cod);
    }

    public Producto actualizar(Producto producto) {
        if (producto.getCategoria() != null && producto.getCategoria().getId() != null) {
            Categoria categoria = categoriaRepository.findById(producto.getCategoria().getId()).orElse(null);
            producto.setCategoria(categoria);
        }
        return productoRepository.save(producto);
    }

    public void eliminar(Integer id) {
        productoRepository.deleteById(id);
    }
}
