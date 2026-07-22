package com.syssupplements.gym.service;

import com.syssupplements.gym.model.entrega.DireccionEntrega;
import com.syssupplements.gym.model.entrega.EstadoEntrega;
import com.syssupplements.gym.repository.DeliveryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;

    public DireccionEntrega guardar(DireccionEntrega direccion) {
        return deliveryRepository.save(direccion);
    }

    public DireccionEntrega obtenerPorId(Integer id) {
        return deliveryRepository.findById(id).orElse(null);
    }

    public List<DireccionEntrega> listarTodas() {
        return deliveryRepository.findAll();
    }

    public List<DireccionEntrega> obtenerPorEstado(EstadoEntrega estado) {
        return deliveryRepository.findByEstadoEntrega(estado);
    }

    public DireccionEntrega actualizarEstado(int direccionId, EstadoEntrega nuevoEstado) {
        DireccionEntrega direccion = deliveryRepository.findById(direccionId).orElse(null);
        if (direccion != null) {
            direccion.setEstadoEntrega(nuevoEstado);
            return deliveryRepository.save(direccion);
        }
        return null;
    }

    public DireccionEntrega actualizar(DireccionEntrega direccion) {
        return deliveryRepository.save(direccion);
    }

    public void eliminar(Integer id) {
        deliveryRepository.deleteById(id);
    }
}
