package com.syssupplements.gym.model.inventario;

import com.syssupplements.gym.model.catalogo.Producto;
import jakarta.persistence.*;

@Entity
public class Inventario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private int stock;
    private int stockMin;

    @OneToOne
    private Producto producto;

    public Inventario(){
    }

    public Inventario(int id, int stock, int stockMin, Producto producto) {
        this.id = id;
        this.stock = stock;
        this.stockMin = stockMin;
        this.producto = producto;
    }

    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
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

    public Producto getProducto() {
        return producto;
    }
    public void setProducto(Producto producto) {
        this.producto = producto;
    }
}
