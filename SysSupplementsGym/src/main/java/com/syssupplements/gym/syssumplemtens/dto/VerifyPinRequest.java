package com.syssupplements.gym.syssumplemtens.dto;

public class VerifyPinRequest {
    private String tempToken;
    private String pin;

    public String getTempToken() { return tempToken; }
    public void setTempToken(String tempToken) { this.tempToken = tempToken; }
    public String getPin() { return pin; }
    public void setPin(String pin) { this.pin = pin; }
}
