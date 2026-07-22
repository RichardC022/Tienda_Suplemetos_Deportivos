package com.syssupplements.gym.repository;

import com.syssupplements.gym.model.catalogo.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/*
 * Repository para la entidad Categoria. Permite gestionar las categorías
 * de productos (ej: Proteínas, Creatinas, Vitaminas, etc.).
 */
@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {
}
