package model;

public class Producto {
    private String nombre;
    private int cod;
    private String detalle;
    private boolean estado;

    private Categoria categoria;
    private Inventario inventario;

    public Producto(){
    }

    public Producto (String nombre, int cod, String detalle, boolean estado, Categoria categoria, Inventario inventario){
        this.nombre = nombre;
        this.cod = cod;
        this.detalle = detalle;
        this.estado = estado;
        this.categoria = categoria;
        this.inventario = inventario;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public int getCod() {
        return cod;
    }

    public void setCod(int cod) {
        this.cod = cod;
    }

    public String getDetalle() {
        return detalle;
    }

    public void setDetalle(String detalle) {
        this.detalle = detalle;
    }

    public boolean isEstado() {
        return estado;
    }

    public void setEstado(boolean estado) {
        this.estado = estado;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }

    public Inventario getInventario() {
        return inventario;
    }

    public void setInventario(Inventario inventario) {
        this.inventario = inventario;
    }
}
