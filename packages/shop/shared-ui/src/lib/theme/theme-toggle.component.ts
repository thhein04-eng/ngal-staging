import { Component, computed, inject } from '@angular/core';
import { ThemeService } from './theme.service';

/** Header control that flips between the light and dark palettes. */
@Component({
  selector: 'shop-theme-toggle',
  template: `
    <button
      type="button"
      class="toggle"
      [attr.aria-pressed]="isDark()"
      [attr.title]="label()"
      (click)="theme.toggle()"
    >
      <span class="visually-hidden">{{ label() }}</span>
      <span class="icon" aria-hidden="true">
        @if (isDark()) {
          <svg viewBox="0 0 24 24" width="18" height="18" focusable="false">
            <circle cx="12" cy="12" r="4.5" fill="currentColor" />
            <g stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
              <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2" />
              <path d="M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6" />
            </g>
          </svg>
        } @else {
          <svg viewBox="0 0 24 24" width="18" height="18" focusable="false">
            <path
              d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"
              fill="currentColor"
            />
          </svg>
        }
      </span>
    </button>
  `,
  styles: `
    .toggle {
      display: grid;
      place-items: center;
      width: 2.5rem;
      height: 2.5rem;
      border: 1px solid var(--nl-line-strong);
      border-radius: 50%;
      background: transparent;
      color: var(--nl-ink);
      cursor: pointer;
    }

    .toggle:hover {
      border-color: var(--nl-accent);
      color: var(--nl-accent);
    }

    .icon {
      display: grid;
      place-items: center;
    }

    @media (prefers-reduced-motion: no-preference) {
      .toggle {
        transition: color 0.25s var(--nl-ease), border-color 0.25s var(--nl-ease),
          transform 0.35s var(--nl-ease);
      }

      .toggle:hover {
        transform: rotate(18deg);
      }
    }
  `,
})
export class ThemeToggleComponent {
  protected readonly theme = inject(ThemeService);

  protected readonly isDark = computed(() => this.theme.resolvedTheme() === 'dark');

  protected readonly label = computed(() =>
    this.isDark() ? 'Switch to light theme' : 'Switch to dark theme'
  );
}
