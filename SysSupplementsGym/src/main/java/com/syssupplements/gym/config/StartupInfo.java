package com.syssupplements.gym.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class StartupInfo {

    private static final Logger log = LoggerFactory.getLogger(StartupInfo.class);

    @EventListener(ApplicationReadyEvent.class)
    public void onStartup() {
        System.out.println();
        System.out.println("=======================================================");
        System.out.println("   SysSupplementsGym iniciado correctamente");
        System.out.println("=======================================================");
        System.out.println("   Tienda:     http://localhost:8081");
        System.out.println("   Login:      http://localhost:8081/login.html");
        System.out.println("   Registro:   http://localhost:8081/registro.html");
        System.out.println("   Admin:      http://localhost:8081/admin.html");
        System.out.println("=======================================================");
        System.out.println("   Admin DB:   admin@sys.com / admin123");
        System.out.println("=======================================================");
        System.out.println();
    }
}
