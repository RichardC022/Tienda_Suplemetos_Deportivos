import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

/*
 * Configuración principal de la aplicación Angular.
 * - provideRouter: configura el enrutamiento
 * - provideHttpClient: habilita HttpClient para peticiones HTTP al backend
 * - withInterceptors: agrega el interceptor de autenticación que adjunta
 *   el token JWT a todas las peticiones HTTP salientes
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};
