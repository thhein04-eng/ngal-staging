import { DOCUMENT } from '@angular/common';
import { Service, inject, signal } from '@angular/core';

export type ThemePreference = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'nl-theme';

/**
 * Owns the light/dark preference.
 *
 * An inline script in `index.html` applies the stored choice before first
 * paint; this service keeps that state in sync once Angular takes over. It
 * never touches storage or `matchMedia` on the server, so prerendering is safe.
 */
@Service()
export class ThemeService {
  private readonly document = inject(DOCUMENT);

  private readonly preference = signal<ThemePreference>('system');
  /** The visitor's explicit choice, or `system` to follow the OS. */
  readonly theme = this.preference.asReadonly();

  /** The theme actually being displayed, resolving `system` against the OS. */
  private readonly resolved = signal<'light' | 'dark'>('light');
  readonly resolvedTheme = this.resolved.asReadonly();

  /** Called from the browser only — see `App`'s `afterNextRender`. */
  initialize(): void {
    const stored = this.read();
    this.preference.set(stored);
    this.apply(stored);

    const query = this.document.defaultView?.matchMedia?.(
      '(prefers-color-scheme: dark)'
    );

    query?.addEventListener('change', () => {
      if (this.preference() === 'system') {
        this.apply('system');
      }
    });
  }

  set(preference: ThemePreference): void {
    this.preference.set(preference);
    this.apply(preference);
    this.write(preference);
  }

  /** Flips between light and dark, resolving `system` to its current value. */
  toggle(): void {
    this.set(this.resolved() === 'dark' ? 'light' : 'dark');
  }

  private apply(preference: ThemePreference): void {
    const root = this.document.documentElement;
    const effective =
      preference === 'system' ? (this.prefersDark() ? 'dark' : 'light') : preference;

    if (preference === 'system') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', preference);
    }

    this.resolved.set(effective);
  }

  private prefersDark(): boolean {
    return (
      this.document.defaultView?.matchMedia?.('(prefers-color-scheme: dark)').matches ??
      false
    );
  }

  private read(): ThemePreference {
    try {
      const value = this.document.defaultView?.localStorage.getItem(STORAGE_KEY);
      return value === 'light' || value === 'dark' ? value : 'system';
    } catch {
      return 'system';
    }
  }

  private write(preference: ThemePreference): void {
    try {
      const storage = this.document.defaultView?.localStorage;
      if (preference === 'system') {
        storage?.removeItem(STORAGE_KEY);
      } else {
        storage?.setItem(STORAGE_KEY, preference);
      }
    } catch {
      /* Storage unavailable; the choice simply will not persist. */
    }
  }
}
