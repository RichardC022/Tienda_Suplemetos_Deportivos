package com.syssupplements.gym.syssumplemtens.service;

import com.syssupplements.gym.model.entrega.DireccionEntrega;
import com.syssupplements.gym.model.entrega.EstadoEntrega;
import com.syssupplements.gym.syssumplemtens.repository.EnvioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EnvioService {

    private final EnvioRepository envioRepository;

    public DireccionEntrega guardar(DireccionEntrega direccion) {
        return envioRepository.save(direccion);
    }

    public DireccionEntrega obtenerPorId(Integer id) {
        return envioRepository.findById(id).orElse(null);
    }

    public List<DireccionEntrega> listarTodas() {
        return envioRepository.findAll();
    }

    public List<DireccionEntrega> obtenerPorEstado(EstadoEntrega estado) {
        return envioRepository.findByEstadoEntrega(estado);
    }

    public DireccionEntrega actualizarEstado(int direccionId, EstadoEntrega nuevoEstado) {
        DireccionEntrega direccion = envioRepository.findById(direccionId).orElse(null);
        if (direccion != null) {
            direccion.setEstadoEntrega(nuevoEstado);
            return envioRepository.save(direccion);
        }
        return null;
    }

    public DireccionEntrega actualizar(DireccionEntrega direccion) {
        return envioRepository.save(direccion);
    }

    public void eliminar(Integer id) {
        envioRepository.deleteById(id);
    }
}
