package com.syssupplements.gym.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Forwarding controller for Angular SPA routing.
 * All non-API, non-static routes are forwarded to index.html
 * so Angular's router can handle them client-side.
 */
@Controller
public class SpaForwardController {

    @GetMapping(value = {
        "/login",
        "/registro",
        "/catalogo",
        "/carrito",
        "/mis-compras",
        "/admin",
        "/admin/**"
    })
    public String forward() {
        return "forward:/index.html";
    }
}
