import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/catalogo', pathMatch: 'full' },

  { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  { path: 'registro', loadComponent: () => import('./components/registro/registro.component').then(m => m.RegistroComponent) },

  { path: 'catalogo', loadComponent: () => import('./components/catalogo/catalogo.component').then(m => m.CatalogoComponent) },
  { path: 'carrito', loadComponent: () => import('./components/carrito/carrito.component').then(m => m.CarritoComponent) },
  { path: 'checkout', loadComponent: () => import('./components/checkout/checkout.component').then(m => m.CheckoutComponent), canActivate: [authGuard] },
  { path: 'mis-compras', loadComponent: () => import('./components/mis-compras/mis-compras.component').then(m => m.MisComprasComponent), canActivate: [authGuard] },

  {
    path: 'admin',
    loadComponent: () => import('./components/admin/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'productos', pathMatch: 'full' },

      { path: 'productos', loadComponent: () => import('./components/admin/admin-productos.component').then(m => m.AdminProductosComponent) },
      { path: 'productos/nuevo', loadComponent: () => import('./components/admin/admin-producto-form.component').then(m => m.AdminProductoFormComponent) },
      { path: 'productos/editar/:id', loadComponent: () => import('./components/admin/admin-producto-form.component').then(m => m.AdminProductoFormComponent) },

      { path: 'categorias', loadComponent: () => import('./components/admin/admin-categorias.component').then(m => m.AdminCategoriasComponent) },
      { path: 'categorias/nueva', loadComponent: () => import('./components/admin/admin-categoria-form.component').then(m => m.AdminCategoriaFormComponent) },
      { path: 'categorias/editar/:id', loadComponent: () => import('./components/admin/admin-categoria-form.component').then(m => m.AdminCategoriaFormComponent) },

      { path: 'inventario', loadComponent: () => import('./components/admin/admin-inventario.component').then(m => m.AdminInventarioComponent) },
      { path: 'inventario/nuevo', loadComponent: () => import('./components/admin/admin-inventario-form.component').then(m => m.AdminInventarioFormComponent) },
      { path: 'inventario/editar/:id', loadComponent: () => import('./components/admin/admin-inventario-form.component').then(m => m.AdminInventarioFormComponent) },

      { path: 'compras', loadComponent: () => import('./components/admin/admin-compras.component').then(m => m.AdminComprasComponent) },
      { path: 'metodos-pago', loadComponent: () => import('./components/admin/admin-metodos-pago.component').then(m => m.AdminMetodosPagoComponent) },
      { path: 'usuarios', loadComponent: () => import('./components/admin/admin-usuarios.component').then(m => m.AdminUsuariosComponent) },
      { path: 'envios', loadComponent: () => import('./components/admin/admin-envios.component').then(m => m.AdminEnviosComponent) },
    ]
  },

  { path: '**', redirectTo: '/catalogo' }
];
