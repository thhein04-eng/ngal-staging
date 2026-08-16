import { Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StagingService } from '@org/models';

/** Pricing/summary card for a single staging package. */
@Component({
  selector: 'shop-service-card',
  imports: [CurrencyPipe, RouterLink],
  template: `
    <article class="card" [class.card--featured]="service().featured">
      @if (service().featured) {
        <p class="badge">Most chosen</p>
      }

      <h3 class="name">{{ service().name }}</h3>
      <p class="tagline">{{ service().tagline }}</p>

      <p class="price">
        <span class="price__from">from</span>
        <span class="price__value">{{
          service().priceFrom | currency: 'USD' : 'symbol' : '1.0-0'
        }}</span>
        <span class="price__unit">{{ service().priceUnit }}</span>
      </p>

      <p class="turnaround">{{ service().turnaround }}</p>

      <ul class="features">
        @for (feature of service().features; track feature) {
          <li>
            <svg
              class="tick"
              viewBox="0 0 20 20"
              width="18"
              height="18"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="m4 10.5 4 4 8-9"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span>{{ feature }}</span>
          </li>
        }
      </ul>

      <a class="cta" routerLink="/contact" [queryParams]="{ service: service().id }">
        Request a quote
        <span class="visually-hidden"> for {{ service().name }}</span>
      </a>
    </article>
  `,
  styles: `
    .card {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 2rem;
      border: 1px solid var(--nl-line);
      border-radius: var(--nl-radius);
      background: var(--nl-surface);
    }

    .card--featured {
      border-color: var(--nl-accent);
      box-shadow: var(--nl-shadow-md);
    }

    .badge {
      align-self: flex-start;
      margin: 0 0 1rem;
      padding: 0.3rem 0.7rem;
      border-radius: 999px;
      background: var(--nl-forest);
      color: var(--nl-on-forest);
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .name {
      margin: 0;
      font-family: var(--nl-font-display);
      font-size: 1.5rem;
      font-weight: 400;
      color: var(--nl-ink);
    }

    .tagline {
      margin: 0.5rem 0 0;
      color: var(--nl-ink-muted);
      line-height: 1.55;
    }

    .price {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      gap: 0.4rem;
      margin: 1.5rem 0 0;
      padding-top: 1.5rem;
      border-top: 1px solid var(--nl-line);
    }

    .price__from {
      font-size: 0.875rem;
      color: var(--nl-ink-muted);
    }

    .price__value {
      font-family: var(--nl-font-display);
      font-size: 2rem;
      color: var(--nl-ink);
      line-height: 1;
    }

    .price__unit {
      font-size: 0.875rem;
      color: var(--nl-ink-muted);
    }

    .turnaround {
      margin: 0.5rem 0 0;
      font-size: 0.875rem;
      color: var(--nl-ink-muted);
    }

    .features {
      margin: 1.5rem 0 2rem;
      padding: 0;
      list-style: none;
      display: grid;
      gap: 0.75rem;
    }

    .features li {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 0.65rem;
      align-items: start;
      font-size: 0.9375rem;
      line-height: 1.5;
    }

    .tick {
      margin-top: 0.15rem;
      color: var(--nl-accent);
    }

    .cta {
      margin-top: auto;
      padding: 0.8rem 1.25rem;
      border: 1px solid var(--nl-accent);
      border-radius: var(--nl-radius-sm);
      text-align: center;
      font-weight: 600;
      text-decoration: none;
      color: var(--nl-accent);
      background: transparent;
    }

    .card--featured .cta {
      background: var(--nl-forest);
      color: var(--nl-on-forest);
    }

    .cta:hover {
      background: var(--nl-forest);
      color: var(--nl-on-forest);
      text-decoration: none;
    }

    .card--featured .cta:hover {
      background: var(--nl-forest-dark);
      border-color: var(--nl-forest-dark);
    }
  `,
})
export class ServiceCardComponent {
  readonly service = input.required<StagingService>();
}
