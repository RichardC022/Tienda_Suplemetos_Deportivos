package com.syssupplements.gym.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender javaMailSender;

    @Async
    public void enviarCodigoRecuperacionAsync(String correoDestino, String codigo) {
        try {
            SimpleMailMessage mensaje = new SimpleMailMessage();
            mensaje.setTo(correoDestino);
            mensaje.setSubject("SysSupplementsGym - Codigo de recuperacion de PIN");
            mensaje.setText(
                "Hola,\n\n" +
                "Has solicitado recuperar tu PIN de acceso.\n\n" +
                "Tu codigo de verificacion es: " + codigo + "\n\n" +
                "Este codigo expira en 5 minutos.\n\n" +
                "Si no solicitaste este cambio, ignora este mensaje.\n\n" +
                "Saludos,\nEquipo SysSupplementsGym"
            );
            mensaje.setFrom("noreply@syssupplements.com");
            javaMailSender.send(mensaje);
            log.info("Correo de recuperacion enviado a: {}", correoDestino);
        } catch (Exception e) {
            log.error("Error al enviar correo a {}: {}", correoDestino, e.getMessage());
            log.info("Codigo de recuperacion para {}: {}", correoDestino, codigo);
        }
    }
}
