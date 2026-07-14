package com.syssupplements.gym.syssumplemtens.service;

import com.syssupplements.gym.model.ventas.Compra;
import com.syssupplements.gym.syssumplemtens.repository.CompraRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CompraService {

    private final CompraRepository compraRepository;

    public Compra registrarCompra(Compra compra) {
        return compraRepository.save(compra);
    }

    public Compra obtenerPorId(Integer id) {
        return compraRepository.findById(id).orElse(null);
    }

    public List<Compra> listarTodas() {
        return compraRepository.findAll();
    }

    public List<Compra> obtenerHistorialPorPersona(int personaId) {
        return compraRepository.findByPersonaId(personaId);
    }

    public Compra actualizar(Compra compra) {
        return compraRepository.save(compra);
    }

    public void eliminar(Integer id) {
        compraRepository.deleteById(id);
    }
}
