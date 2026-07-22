package com.syssupplements.gym.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/*
 * Configuración de Spring Security para la aplicación.
 *
 * Se utiliza la forma basada en beans (recomendada en Spring Security 6.x / Spring Boot 4.x)
 * en lugar de extender WebSecurityConfigurerAdapter, que está obsoleto desde Spring Security 5.7.
 *
 * DECISIÓN: Se deshabilita la protección CSRF porque esta es una API REST.
 * CSRF solo es necesario para formularios HTML tradicionales. Las APIS REST
 * utilizan tokens (JWT, OAuth2) para autenticación, lo que hace innecesario CSRF.
 *
 * DECISIÓN: Se configura CORS para permitir peticiones desde el frontend Angular
 * en desarrollo (localhost:4200) al backend (localhost:8081).
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /*
     * Configura la cadena de filtros de seguridad.
     * Define qué endpoints son públicos y cuáles requieren autenticación.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            /*
             * Se habilita CORS con la configuración definida en el bean corsConfigurationSource.
             * Esto es necesario para que el frontend Angular (puerto 4200) pueda
             * hacer peticiones al backend (puerto 8081) sin que el navegador las bloquee.
             */
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            /*
             * Se deshabilita CSRF porque es una API REST.
             * Las APIs no usan cookies de sesión, por lo que CSRF no aplica.
             */
            .csrf(csrf -> csrf.disable())

            /*
             * Se configuran las reglas de autorización.
             * Por ahora se permite el acceso público a todos los endpoints (/api/**)
             * para facilitar el desarrollo. En producción, se debe restringir.
             */
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/**").permitAll()
                .requestMatchers("/uploads/**").permitAll()
                .anyRequest().permitAll()
            )

            /*
             * Se deshabilita la autenticación HTTP Basic.
             * Si se desea usar autenticación básica para testing,
             * se puede cambiar a .and().httpBasic()
             */
            .httpBasic(httpBasic -> {});

        return http.build();
    }

    /*
     * Configuración de CORS.
     * Permite peticiones desde el frontend Angular en desarrollo.
     * En producción, se debe restringir allowedOrigins al dominio real.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        /*
         * Se permiten orígenes específicos en desarrollo.
         * localhost:4200 es el puerto por defecto del servidor de desarrollo de Angular.
         */
        configuration.setAllowedOrigins(List.of(
            "http://localhost:4200",
            "http://localhost:4201"
        ));

        /*
         * Se permiten todos los métodos HTTP comunes en APIS REST.
         */
        configuration.setAllowedMethods(List.of(
            "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
        ));

        /*
         * Se permiten todos los headers, incluyendo Authorization,
         * Content-Type, etc. Esto es necesario para que el interceptor
         * de autenticación funcione correctamente.
         */
        configuration.setAllowedHeaders(List.of("*"));

        /*
         * Se permite enviar credenciales (cookies, headers de autorización).
         */
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    /*
     * Bean para el encriptamiento de contraseñas.
     * BCrypt es el algoritmo estándar recomendado por Spring Security.
     *
     * NOTA: El modelo actual de Usuario almacena las contraseñas en texto plano.
     * Este Bean está disponible para cuando se implemente el hashing de contraseñas.
     * Para usarlo: passwordEncoder.encode(clave) para guardar,
     * passwordEncoder.matches(clave, hash) para verificar.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(4);
    }
}
