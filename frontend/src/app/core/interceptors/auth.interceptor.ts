import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/*
 * Interceptor funcional (forma moderna en Angular 19+).
 * Adjunta el token JWT almacenado en AuthService a todas las
 * peticiones HTTP salientes que vayan hacia /api/.
 *
 * Se usa una función en lugar de una clase porque Angular 19+
 * promueve los interceptores funcionales sobre los basados en clases.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Solo adjuntar token a peticiones hacia nuestra API
  if (req.url.includes('/api/')) {
    const authService = inject(AuthService);
    const token = authService.getToken();

    if (token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next(cloned);
    }
  }

  return next(req);
};
