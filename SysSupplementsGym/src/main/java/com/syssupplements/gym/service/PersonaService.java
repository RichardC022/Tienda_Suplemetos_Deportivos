package com.syssupplements.gym.service;

import com.syssupplements.gym.model.seguridad.Persona;
import com.syssupplements.gym.repository.PersonaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/*
 * Service para gestionar los datos personales de los clientes.
 * Persona es una entidad independiente de Usuario, ya que una persona
 * puede existir sin tener una cuenta de usuario (registro solo con datos de contacto).
 */
@Service
@RequiredArgsConstructor
public class PersonaService {

    private final PersonaRepository personaRepository;

    public Persona guardar(Persona persona) {
        return personaRepository.save(persona);
    }

    public Persona obtenerPorId(Integer id) {
        return personaRepository.findById(id).orElse(null);
    }

    public List<Persona> listarTodas() {
        return personaRepository.findAll();
    }

    public Persona actualizar(Persona persona) {
        return personaRepository.save(persona);
    }

    public void eliminar(Integer id) {
        personaRepository.deleteById(id);
    }
}
