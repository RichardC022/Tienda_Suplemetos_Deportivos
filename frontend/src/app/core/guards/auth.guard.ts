import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

/*
 * Guard funcional que protege las rutas que requieren autenticación.
 * Si el usuario no está logueado, lo redirige a la página de login.
 *
 * Se usa una función (forma moderna en Angular 19+) en lugar de una clase.
 * El guard se configura en app.routes.ts con la propiedad `canActivate`.
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Redirigir al login si no está autenticado
  router.navigate(['/login']);
  return false;
};

/*
 * Guard que protege las rutas del módulo de administración.
 * Solo permite el acceso si el usuario está logueado Y tiene rol ADMIN.
 * Si es un cliente normal, lo redirige al catálogo.
 */
export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.isAdmin()) {
    return true;
  }

  // Redirigir al catálogo si no es admin
  router.navigate(['/catalogo']);
  return false;
};
