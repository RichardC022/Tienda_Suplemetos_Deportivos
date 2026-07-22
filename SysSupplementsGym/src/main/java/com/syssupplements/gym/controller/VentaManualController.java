package com.syssupplements.gym.controller;

import com.syssupplements.gym.dto.VentaManualRequest;
import com.syssupplements.gym.dto.VentaManualResponse;
import com.syssupplements.gym.service.VentaManualService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ventas-manuales")
@RequiredArgsConstructor
public class VentaManualController {

    private final VentaManualService ventaManualService;

    @PostMapping
    public ResponseEntity<?> registrarVenta(@RequestBody VentaManualRequest request) {
        try {
            VentaManualResponse response = ventaManualService.registrarVenta(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
