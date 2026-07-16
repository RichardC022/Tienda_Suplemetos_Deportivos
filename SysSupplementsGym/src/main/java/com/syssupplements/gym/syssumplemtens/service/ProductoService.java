package com.syssupplements.gym.syssumplemtens.service;

import com.syssupplements.gym.model.catalogo.Categoria;
import com.syssupplements.gym.model.catalogo.Producto;
import com.syssupplements.gym.syssumplemtens.repository.CategoriaRepository;
import com.syssupplements.gym.syssumplemtens.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;

    @Value("${app.upload.dir:uploads/productos}")
    private String uploadDir;

    private static final Set<String> TIPOS_PERMITIDOS = Set.of(
            "image/jpeg", "image/png", "image/webp"
    );

    public Producto guardar(Producto producto) {
        if (producto.getCategoria() != null && producto.getCategoria().getId() != null) {
            Categoria categoria = categoriaRepository.findById(producto.getCategoria().getId()).orElse(null);
            producto.setCategoria(categoria);
        }
        return productoRepository.save(producto);
    }

    public Producto obtenerPorId(Integer id) {
        return productoRepository.findById(id).orElse(null);
    }

    public List<Producto> listarTodos() {
        return productoRepository.findAll();
    }

    public List<Producto> obtenerPorCategoria(int categoriaId) {
        return productoRepository.findByCategoriaId(categoriaId);
    }

    public List<Producto> obtenerPorEstado(boolean estado) {
        return productoRepository.findByEstado(estado);
    }

    public Producto obtenerPorCodigo(int cod) {
        return productoRepository.findByCod(cod);
    }

    public Producto actualizar(Producto producto) {
        if (producto.getCategoria() != null && producto.getCategoria().getId() != null) {
            Categoria categoria = categoriaRepository.findById(producto.getCategoria().getId()).orElse(null);
            producto.setCategoria(categoria);
        }
        return productoRepository.save(producto);
    }

    public void eliminar(Integer id) {
        Producto producto = productoRepository.findById(id).orElse(null);
        if (producto != null) {
            eliminarImagenSiExiste(producto);
            productoRepository.deleteById(id);
        }
    }

    public String subirImagen(Producto producto, MultipartFile archivo) {
        if (archivo.isEmpty()) {
            return null;
        }

        String contentType = archivo.getContentType();
        if (contentType == null || !TIPOS_PERMITIDOS.contains(contentType)) {
            return null;
        }

        eliminarImagenSiExiste(producto);

        try {
            Path directorioUpload = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(directorioUpload);

            String extension = contentType.equals("image/png") ? ".png"
                    : contentType.equals("image/webp") ? ".webp" : ".jpg";
            String nombreArchivo = "prod_" + producto.getId() + "_" + System.currentTimeMillis() + extension;

            Path destino = directorioUpload.resolve(nombreArchivo);
            archivo.transferTo(destino.toFile());

            String imagenUrl = "/uploads/productos/" + nombreArchivo;
            producto.setImagenUrl(imagenUrl);
            productoRepository.save(producto);

            return imagenUrl;
        } catch (IOException e) {
            return null;
        }
    }

    private void eliminarImagenSiExiste(Producto producto) {
        if (producto.getImagenUrl() != null && producto.getImagenUrl().startsWith("/uploads/")) {
            try {
                Path archivo = Paths.get(uploadDir).toAbsolutePath().normalize()
                        .resolve(producto.getImagenUrl().replace("/uploads/productos/", ""));
                Files.deleteIfExists(archivo);
            } catch (IOException ignored) {
            }
            producto.setImagenUrl(null);
        }
    }
}
