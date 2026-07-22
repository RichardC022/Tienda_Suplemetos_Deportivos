package com.syssupplements.gym.syssumplemtens.repository;

import com.syssupplements.gym.model.catalogo.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Integer> {

    List<Producto> findByCategoriaId(int categoriaId);

    List<Producto> findByEstado(boolean estado);

    Producto findByCod(int cod);

    @Query("SELECT p FROM Producto p WHERE p.estado = true AND " +
           "(LOWER(p.nombre) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR " +
           "CAST(p.cod AS string) LIKE CONCAT('%', :busqueda, '%'))")
    List<Producto> buscarActivos(@Param("busqueda") String busqueda);
}
