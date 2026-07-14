package com.syssupplements.gym.syssumplemtens.repository;

import com.syssupplements.gym.model.catalogo.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Integer> {

    List<Producto> findByCategoriaId(int categoriaId);

    List<Producto> findByEstado(boolean estado);

    Producto findByCod(int cod);
}
