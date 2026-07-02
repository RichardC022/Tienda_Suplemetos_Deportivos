package model;

public class DireccionEntrega {
    private String callePrincipal;
    private String callleSecundaria;
    private String nroCasa;
    private String referencia;

    private EstadoEntrega estadoEntrega;

    public DireccionEntrega(){
    }

    public DireccionEntrega(String callePrincipal, String callleSecundaria, String nroCasa, String referencia, EstadoEntrega estadoEntrega){
        this.callePrincipal = callePrincipal;
        this.callleSecundaria = callleSecundaria;
        this.nroCasa = nroCasa;
        this.referencia = referencia;
        this.estadoEntrega = estadoEntrega;
    }

    public String getCallePrincipal() {
        return callePrincipal;
    }

    public void setCallePrincipal(String callePrincipal) {
        this.callePrincipal = callePrincipal;
    }

    public String getCallleSecundaria() {
        return callleSecundaria;
    }

    public void setCallleSecundaria(String callleSecundaria) {
        this.callleSecundaria = callleSecundaria;
    }

    public String getNroCasa() {
        return nroCasa;
    }

    public void setNroCasa(String nroCasa) {
        this.nroCasa = nroCasa;
    }

    public String getReferencia() {
        return referencia;
    }

    public void setReferencia(String referencia) {
        this.referencia = referencia;
    }

    public EstadoEntrega getEstadoEntrega() {
        return estadoEntrega;
    }

    public void setEstadoEntrega(EstadoEntrega estadoEntrega) {
        this.estadoEntrega = estadoEntrega;
    }
}
