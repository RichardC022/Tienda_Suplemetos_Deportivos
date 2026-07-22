package com.syssupplements.gym.repository;

import com.syssupplements.gym.model.entrega.DireccionEntrega;
import com.syssupplements.gym.model.entrega.EstadoEntrega;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeliveryRepository extends JpaRepository<DireccionEntrega, Integer> {

    List<DireccionEntrega> findByEstadoEntrega(EstadoEntrega estadoEntrega);
}
