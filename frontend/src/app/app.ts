import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';

/*
 * Componente raíz de la aplicación.
 * Solo contiene el LayoutComponent que envuelve todas las páginas
 * con la barra de navegación y el pie de página.
 *
 * Se usa standalone: true (forma moderna en Angular 19+)
 * para no depender de módulos NgModule.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LayoutComponent],
  template: `<app-layout></app-layout>`
})
export class AppComponent {}
