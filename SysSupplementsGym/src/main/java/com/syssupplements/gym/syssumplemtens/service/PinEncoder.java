package com.syssupplements.gym.syssumplemtens.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Component
public class PinEncoder {

    private final String secret;

    public PinEncoder(@Value("${app.pin-secret:SysSupGym2024PinSecretKey!}") String secret) {
        this.secret = secret;
    }

    public String encode(String pin) {
        return sha256(pin + "." + secret);
    }

    public boolean matches(String rawPin, String hash) {
        if (rawPin == null || hash == null) return false;
        return encode(rawPin).equals(hash);
    }

    private String sha256(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] digest = md.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(64);
            for (byte b : digest) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 not available", e);
        }
    }
}
