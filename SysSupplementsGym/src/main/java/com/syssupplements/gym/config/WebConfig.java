package com.syssupplements.gym.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.upload.dir:uploads/productos}")
    private String uploadDir;

    /*
     * Resolve el directorio de uploads a una ruta absoluta confiable.
     *
     * Si la propiedad es una ruta relativa (ej: "uploads/productos"), se
     * resolve relativa al directorio de trabajo actual (user.dir), que
     * normalmente es el directorio del proyecto backend. Esto evita que
     * las imagenes se sirvan desde un directorio equivocado cuando el
     * backend se arranca desde diferentes ubicaciones (IDE vs consola).
     *
     * Tambien crea el directorio si no existe para que el resource
     * handler no falle al registrar la location.
     */
    /*
     * Resolve el directorio base de uploads a una ruta absoluta confiable.
     *
     * La propiedad "app.upload.dir" apunta al subdirectorio donde se
     * guardan los archivos (ej: "uploads/productos"). Sin embargo, las
     * URLs guardadas en la BD son de la forma "/uploads/productos/x.png",
     * por lo que el resource handler debe servir desde el directorio
     * PADRE ("uploads") para que la ruta relativa coincida con la URL.
     *
     * Si la propiedad es relativa, se resolve relativa al directorio de
     * trabajo actual (user.dir), normalmente el directorio del backend.
     * Tambien crea los directorios si no existen.
     */
    private String resolveUploadBaseDir() {
        Path path = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(path);
        } catch (Exception ignored) {
        }
        Path parent = path.getParent();
        if (parent == null) {
            parent = path;
        }
        File file = parent.toFile();
        // Spring requiere que la location termine con "/" para que
        // el resource handler resuelva archivos dentro del directorio.
        return file.toURI().toString();
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String rutaAbsoluta = resolveUploadBaseDir();
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(rutaAbsoluta);
    }
}
