package model;

public class DetalleCompra {
    private int cantidad;
    private float precioU;
    private float subtotal;

    private Producto producto;

    public DetalleCompra(){
    }

    public DetalleCompra(int cantidad, float precioU, float subtotal, Producto producto){
        this.cantidad = cantidad;
        this.precioU = precioU;
        this.subtotal = subtotal;
        this.producto = producto;
    }

    public int getCantidad() {
        return cantidad;
    }

    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }

    public float getPrecioU() {
        return precioU;
    }

    public void setPrecioU(float precioU) {
        this.precioU = precioU;
    }

    public float getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(float subtotal) {
        this.subtotal = subtotal;
    }

    public Producto getProducto() {
        return producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
    }
}
