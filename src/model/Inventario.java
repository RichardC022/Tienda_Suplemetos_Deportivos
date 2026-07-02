package model;

public class Inventario {
    private int stock;
    private int stockMin;

    public Inventario(){
    }

    public Inventario (int stock, int stockMin){
        this.stock = stock;
        this.stockMin = stockMin;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }

    public int getStockMin() {
        return stockMin;
    }

    public void setStockMin(int stockMin) {
        this.stockMin = stockMin;
    }
}
