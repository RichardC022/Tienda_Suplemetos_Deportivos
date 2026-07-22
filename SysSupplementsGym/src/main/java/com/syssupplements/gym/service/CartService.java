package com.syssupplements.gym.service;

import com.syssupplements.gym.model.ventas.Carrito;
import com.syssupplements.gym.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;

    public Carrito guardar(Carrito carrito) {
        return cartRepository.save(carrito);
    }

    public Carrito obtenerPorId(Integer id) {
        return cartRepository.findById(id).orElse(null);
    }

    public List<Carrito> listarTodos() {
        return cartRepository.findAll();
    }

    public void eliminar(Integer id) {
        cartRepository.deleteById(id);
    }
}
