package com.syssupplements.gym.model.inventario;

import com.syssupplements.gym.model.catalogo.Producto;
import jakarta.persistence.*;

@Entity
public class Inventario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private Integer stock;
    private Integer stockMin;

    @OneToOne
    @JoinColumn(name = "producto_id")
    private Producto producto;

    public Inventario(){
    }

    public Inventario(Integer id, Integer stock, Integer stockMin, Producto producto) {
        this.id = id;
        this.stock = stock;
        this.stockMin = stockMin;
        this.producto = producto;
    }

    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getStock() {
        return stock;
    }
    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public Integer getStockMin() {
        return stockMin;
    }
    public void setStockMin(Integer stockMin) {
        this.stockMin = stockMin;
    }

    public Producto getProducto() {
        return producto;
    }
    public void setProducto(Producto producto) {
        this.producto = producto;
    }
}
