package com.syssupplements.gym.dto;

public class ResetPinRequest {
    private String recoveryToken;
    private String nuevoPin;

    public String getRecoveryToken() { return recoveryToken; }
    public void setRecoveryToken(String recoveryToken) { this.recoveryToken = recoveryToken; }
    public String getNuevoPin() { return nuevoPin; }
    public void setNuevoPin(String nuevoPin) { this.nuevoPin = nuevoPin; }
}
