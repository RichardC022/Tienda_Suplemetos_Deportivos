import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly THEME_KEY = 'theme';
  private themeSubject = new BehaviorSubject<string>(this.getSavedTheme());
  theme$ = this.themeSubject.asObservable();

  constructor() {
    this.applyTheme(this.themeSubject.value);
  }

  private getSavedTheme(): string {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(this.THEME_KEY) || 'light';
    }
    return 'light';
  }

  private applyTheme(theme: string): void {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }

  toggleTheme(): void {
    const current = this.themeSubject.value;
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem(this.THEME_KEY, next);
    this.applyTheme(next);
    this.themeSubject.next(next);
  }

  isDark(): boolean {
    return this.themeSubject.value === 'dark';
  }
}
