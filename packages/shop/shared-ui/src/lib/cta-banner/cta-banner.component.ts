import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Full-width closing call to action. */
@Component({
  selector: 'shop-cta-banner',
  imports: [RouterLink],
  template: `
    <section class="banner">
      <div class="banner__inner">
        <h2 class="banner__title">{{ heading() }}</h2>
        <p class="banner__body">{{ body() }}</p>
        <div class="banner__actions">
          <a class="btn btn--solid" [routerLink]="primaryLink()">{{ primaryLabel() }}</a>
          @if (secondaryLabel(); as label) {
            <a class="btn btn--ghost" [routerLink]="secondaryLink()">{{ label }}</a>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .banner {
      background: var(--nl-forest);
      color: #fff;
    }

    .banner__inner {
      max-width: var(--nl-container);
      margin-inline: auto;
      padding: clamp(3rem, 7vw, 5rem) var(--nl-gutter);
      text-align: center;
    }

    .banner__title {
      max-width: 22ch;
      margin: 0 auto;
      font-family: var(--nl-font-display);
      font-size: var(--nl-size-h2);
      font-weight: 400;
      line-height: 1.15;
      text-wrap: balance;
    }

    .banner__body {
      max-width: 54ch;
      margin: 1.25rem auto 0;
      font-size: 1.0625rem;
      line-height: 1.65;
      color: rgb(255 255 255 / 0.85);
      text-wrap: pretty;
    }

    .banner__actions {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1rem;
      margin-top: 2rem;
    }

    .btn {
      padding: 0.85rem 1.75rem;
      border-radius: var(--nl-radius-sm);
      font-weight: 600;
      text-decoration: none;
    }

    /* The banner is always dark green, so this button stays light in both
       themes — themed tokens would invert it and destroy the contrast. */
    .btn--solid {
      background: #ffffff;
      color: #2f5d50;
    }

    .btn--solid:hover {
      background: #efeae1;
      text-decoration: none;
    }

    .btn--ghost {
      border: 1px solid rgb(255 255 255 / 0.5);
      color: #fff;
    }

    .btn--ghost:hover {
      border-color: #fff;
      background: rgb(255 255 255 / 0.1);
      text-decoration: none;
    }

    .banner :focus-visible {
      outline: 3px solid #fff;
      outline-offset: 3px;
    }
  `,
})
export class CtaBannerComponent {
  readonly heading = input.required<string>();
  readonly body = input.required<string>();
  readonly primaryLabel = input('Request a quote');
  readonly primaryLink = input('/contact');
  readonly secondaryLabel = input<string>();
  readonly secondaryLink = input('/portfolio');
}
