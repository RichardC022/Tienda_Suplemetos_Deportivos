package com.syssupplements.gym.syssumplemtens.repository;

import com.syssupplements.gym.model.ventas.Compra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompraRepository extends JpaRepository<Compra, Integer> {

    List<Compra> findByPersonaId(int personaId);
}
