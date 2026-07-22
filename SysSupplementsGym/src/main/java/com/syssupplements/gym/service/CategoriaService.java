package com.syssupplements.gym.service;

import com.syssupplements.gym.model.catalogo.Categoria;
import com.syssupplements.gym.repository.CategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/*
 * Service para gestionar las categorías de productos.
 * Las categorías organizan el catálogo (ej: Proteínas, Creatinas, Vitaminas, etc.).
 */
@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    public Categoria guardar(Categoria categoria) {
        return categoriaRepository.save(categoria);
    }

    public Categoria obtenerPorId(Integer id) {
        return categoriaRepository.findById(id).orElse(null);
    }

    public List<Categoria> listarTodas() {
        return categoriaRepository.findAll();
    }

    public Categoria actualizar(Categoria categoria) {
        return categoriaRepository.save(categoria);
    }

    public void eliminar(Integer id) {
        categoriaRepository.deleteById(id);
    }
}
