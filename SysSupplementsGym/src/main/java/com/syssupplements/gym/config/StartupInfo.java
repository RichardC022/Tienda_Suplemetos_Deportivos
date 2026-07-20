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
        System.out.println("   Frontend:  http://localhost:4200");
        System.out.println("=======================================================");
        System.out.println("   Admin DB:  admin@sys.com / admin123");
        System.out.println("=======================================================");
        System.out.println();
    }
}
