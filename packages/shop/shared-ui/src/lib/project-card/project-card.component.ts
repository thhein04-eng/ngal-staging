import { Component, input } from '@angular/core';
import { CurrencyPipe, DecimalPipe, NgOptimizedImage } from '@angular/common';
import { PortfolioProject } from '@org/models';

/** Portfolio tile showing the staged result and how the listing performed. */
@Component({
  selector: 'shop-project-card',
  imports: [CurrencyPipe, DecimalPipe, NgOptimizedImage],
  template: `
    <article class="card">
      <div class="media">
        <img
          [ngSrc]="project().afterImage"
          fill
          [alt]="'The ' + project().title + ' living space after staging'"
        />
      </div>

      <div class="body">
        <p class="meta">
          {{ typeLabel() }} · {{ project().neighborhood }} ·
          {{ project().squareFeet | number }} sq ft
        </p>
        <h3 class="title">{{ project().title }}</h3>
        <p class="summary">{{ project().summary }}</p>

        <dl class="stats">
          <div class="stat">
            <dt>Days to pending</dt>
            <dd>{{ project().daysOnMarket }}</dd>
          </div>
          <div class="stat">
            <dt>List price</dt>
            <dd>{{ project().listPrice | currency: 'USD' : 'symbol' : '1.0-0' }}</dd>
          </div>
          <div class="stat">
            <dt>Sold for</dt>
            <dd [class.stat--over]="soldOverAsk()">
              {{ project().salePrice | currency: 'USD' : 'symbol' : '1.0-0' }}
            </dd>
          </div>
        </dl>
      </div>
    </article>
  `,
  styles: `
    .card {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
      border: 1px solid var(--nl-line);
      border-radius: var(--nl-radius);
      background: var(--nl-surface);
    }

    .media {
      position: relative;
      aspect-ratio: 3 / 2;
      background: var(--nl-sand);
    }

    .media img {
      object-fit: cover;
    }

    .body {
      display: flex;
      flex-direction: column;
      flex: 1;
      padding: 1.5rem;
    }

    .meta {
      margin: 0;
      font-size: 0.8125rem;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--nl-ink-muted);
    }

    .title {
      margin: 0.5rem 0 0;
      font-family: var(--nl-font-display);
      font-size: 1.375rem;
      font-weight: 400;
      color: var(--nl-ink);
    }

    .summary {
      margin: 0.75rem 0 1.5rem;
      font-size: 0.9375rem;
      line-height: 1.6;
      color: var(--nl-ink-muted);
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin: auto 0 0;
      padding-top: 1.25rem;
      border-top: 1px solid var(--nl-line);
    }

    .stat dt {
      font-size: 0.75rem;
      line-height: 1.3;
      color: var(--nl-ink-muted);
    }

    .stat dd {
      margin: 0.35rem 0 0;
      font-family: var(--nl-font-display);
      font-size: 1.125rem;
      color: var(--nl-ink);
    }

    .stat--over {
      color: var(--nl-accent);
    }
  `,
})
export class ProjectCardComponent {
  readonly project = input.required<PortfolioProject>();
  readonly typeLabel = input.required<string>();

  protected soldOverAsk(): boolean {
    return this.project().salePrice > this.project().listPrice;
  }
}
