package com.syssupplements.gym.syssumplemtens.service;

import com.syssupplements.gym.model.ventas.Carrito;
import com.syssupplements.gym.syssumplemtens.repository.CarritoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CarritoService {

    private final CarritoRepository carritoRepository;

    public Carrito guardar(Carrito carrito) {
        return carritoRepository.save(carrito);
    }

    public Carrito obtenerPorId(Integer id) {
        return carritoRepository.findById(id).orElse(null);
    }

    public List<Carrito> listarTodos() {
        return carritoRepository.findAll();
    }

    public void eliminar(Integer id) {
        carritoRepository.deleteById(id);
    }
}
