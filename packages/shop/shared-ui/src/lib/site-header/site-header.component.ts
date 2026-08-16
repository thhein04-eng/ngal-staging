import {
  Component,
  ElementRef,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { ScrollProgressComponent } from '../motion/scroll-progress.component';
import { ThemeToggleComponent } from '../theme/theme-toggle.component';

interface NavItem {
  readonly path: string;
  readonly label: string;
}

const NAV: readonly NavItem[] = [
  { path: '/services', label: 'Services' },
  { path: '/portfolio', label: 'Portfolio' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' },
];

/**
 * Site masthead. On narrow viewports the navigation collapses behind a
 * disclosure button; the panel closes on navigation, on Escape, and on any
 * click outside the header.
 */
@Component({
  selector: 'shop-site-header',
  imports: [RouterLink, RouterLinkActive, ScrollProgressComponent, ThemeToggleComponent],
  host: {
    '(document:keydown.escape)': 'close()',
    '(document:click)': 'onDocumentClick($event)',
  },
  template: `
    <a class="skip" href="#main">Skip to main content</a>

    <header class="header" [class.header--stuck]="stuck()">
      <div class="header__inner">
        <a class="brand" routerLink="/" (click)="close()">
          <span class="brand__mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" width="30" height="30" focusable="false">
              <path
                d="M4 27V11.5L16 4l12 7.5V27"
                fill="none"
                stroke="currentColor"
                stroke-width="2.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path d="M12 27v-8h8v8" fill="none" stroke="currentColor" stroke-width="2.2" />
            </svg>
          </span>
          <span class="brand__text">
            <span class="brand__name">Northlight</span>
            <span class="brand__sub">Home Staging</span>
          </span>
        </a>

        <nav id="primary-nav" class="nav" [class.nav--open]="open()" aria-label="Primary">
          <ul class="nav__list">
            @for (item of nav; track item.path) {
              <li>
                <a
                  [routerLink]="item.path"
                  routerLinkActive="is-active"
                  [attr.aria-current]="isActive(item.path) ? 'page' : null"
                  (click)="close()"
                >
                  {{ item.label }}
                </a>
              </li>
            }
            <li class="nav__cta">
              <a routerLink="/contact" [queryParams]="{ intent: 'quote' }" (click)="close()">
                Get a quote
              </a>
            </li>
          </ul>
        </nav>

        <div class="actions">
          <shop-theme-toggle />

          <button
            class="menu-toggle"
            type="button"
            [attr.aria-expanded]="open()"
            aria-controls="primary-nav"
            (click)="toggle()"
          >
            <span class="visually-hidden">{{ open() ? 'Close menu' : 'Open menu' }}</span>
            <span
              class="menu-toggle__bars"
              [class.menu-toggle__bars--open]="open()"
              aria-hidden="true"
            >
              <span></span><span></span><span></span>
            </span>
          </button>
        </div>

        <shop-scroll-progress />
      </div>
    </header>
  `,
  styles: `
    .skip {
      position: absolute;
      left: 0.5rem;
      top: -4rem;
      z-index: 100;
      padding: 0.75rem 1.25rem;
      border-radius: var(--nl-radius-sm);
      background: var(--nl-forest);
      color: var(--nl-on-forest);
      font-weight: 600;
      text-decoration: none;
      transition: top 0.15s ease;
    }

    .skip:focus {
      top: 0.5rem;
    }

    .header {
      position: sticky;
      top: 0;
      z-index: 50;
      background: color-mix(in srgb, var(--nl-cream) 82%, transparent);
      backdrop-filter: saturate(180%) blur(14px);
      -webkit-backdrop-filter: saturate(180%) blur(14px);
      border-bottom: 1px solid transparent;
    }

    /* Border and shadow appear only once the page has scrolled, so the header
       sits flush against the hero at rest. */
    .header--stuck {
      border-bottom-color: var(--nl-line);
      box-shadow: 0 1px 20px rgb(0 0 0 / 0.06);
    }

    @supports not (backdrop-filter: blur(1px)) {
      .header {
        background: var(--nl-cream);
      }
    }

    .header__inner {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
      max-width: var(--nl-container);
      margin-inline: auto;
      padding: 1rem var(--nl-gutter);
    }

    .actions {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.7rem;
      color: var(--nl-ink);
      text-decoration: none;
    }

    .brand:hover {
      text-decoration: none;
    }

    .brand__mark {
      color: var(--nl-accent);
      display: grid;
      place-items: center;
    }

    .brand__text {
      display: flex;
      flex-direction: column;
      line-height: 1.1;
    }

    .brand__name {
      font-family: var(--nl-font-display);
      font-size: 1.375rem;
      letter-spacing: -0.01em;
    }

    .brand__sub {
      font-size: 0.6875rem;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      white-space: nowrap;
      color: var(--nl-ink-muted);
    }

    .menu-toggle {
      display: none;
      padding: 0.6rem;
      border: 1px solid var(--nl-line-strong);
      border-radius: var(--nl-radius-sm);
      background: transparent;
      cursor: pointer;
      color: var(--nl-ink);
    }

    .menu-toggle__bars {
      display: grid;
      gap: 4px;
      width: 20px;
    }

    .menu-toggle__bars span {
      height: 2px;
      background: currentColor;
      border-radius: 2px;
    }

    .menu-toggle__bars--open span:nth-child(2) {
      opacity: 0;
    }

    .nav__list {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .nav__list a {
      display: block;
      padding: 0.55rem 0.9rem;
      border-radius: var(--nl-radius-sm);
      color: var(--nl-ink);
      font-weight: 500;
      text-decoration: none;
    }

    .nav__list a:hover {
      background: var(--nl-sand);
      text-decoration: none;
    }

    .nav__list a.is-active {
      color: var(--nl-accent);
      font-weight: 600;
    }

    .nav__cta a,
    .nav__cta a.is-active {
      margin-left: 0.5rem;
      background: var(--nl-forest);
      color: var(--nl-on-forest);
      font-weight: 600;
    }

    .nav__cta a:hover {
      background: var(--nl-forest-dark);
    }

    @media (prefers-reduced-motion: no-preference) {
      .header {
        transition: border-color 0.3s var(--nl-ease), box-shadow 0.3s var(--nl-ease),
          background-color 0.3s var(--nl-ease);
      }

      .nav__list a {
        transition: background-color 0.2s var(--nl-ease), color 0.2s var(--nl-ease);
      }

      .nav__cta a:hover {
        transform: translateY(-1px);
      }
    }

    @media (max-width: 56rem) {
      /* Lets the nav panel wrap onto its own row below the brand and actions. */
      .header__inner {
        flex-wrap: wrap;
      }

      .actions {
        order: 3;
      }

      .menu-toggle {
        display: block;
      }

      .nav {
        display: none;
        flex-basis: 100%;
        order: 4;
      }

      .nav--open {
        display: block;
      }

      .nav__list {
        flex-direction: column;
        align-items: stretch;
        gap: 0.25rem;
        padding: 0.75rem 0 0.5rem;
      }

      .nav__list a {
        padding: 0.8rem 0.9rem;
      }

      .nav__cta a {
        margin-left: 0;
        text-align: center;
      }
    }
  `,
})
export class SiteHeaderComponent {
  private readonly router = inject(Router);
  private readonly host = inject(ElementRef<HTMLElement>);

  protected readonly nav = NAV;
  private readonly menuOpen = signal(false);
  protected readonly open = this.menuOpen.asReadonly();

  /** True once the page has scrolled away from the top. */
  private readonly scrolled = signal(false);
  protected readonly stuck = this.scrolled.asReadonly();

  constructor() {
    afterNextRender(() => {
      let queued = false;
      const update = () => {
        queued = false;
        this.scrolled.set(window.scrollY > 8);
      };

      addEventListener(
        'scroll',
        () => {
          if (!queued) {
            queued = true;
            requestAnimationFrame(update);
          }
        },
        { passive: true }
      );

      update();
    });
  }

  /** Current URL without query string, used for `aria-current`. */
  private readonly currentPath = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects.split('?')[0])
    ),
    { initialValue: this.router.url.split('?')[0] }
  );

  protected isActive(path: string): boolean {
    return this.currentPath() === path;
  }

  protected toggle(): void {
    this.menuOpen.update((open) => !open);
  }

  protected close(): void {
    this.menuOpen.set(false);
  }

  protected onDocumentClick(event: MouseEvent): void {
    if (!this.menuOpen()) {
      return;
    }

    const target = event.target as Node | null;
    if (target && !this.host.nativeElement.contains(target)) {
      this.close();
    }
  }
}
