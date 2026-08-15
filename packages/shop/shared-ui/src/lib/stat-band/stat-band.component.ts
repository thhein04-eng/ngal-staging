import { Component, input } from '@angular/core';
import { ImpactStat } from '@org/models';

/** Row of headline metrics. */
@Component({
  selector: 'shop-stat-band',
  template: `
    <dl class="band">
      @for (stat of stats(); track stat.label) {
        <div class="stat">
          <dt class="stat__label">{{ stat.label }}</dt>
          <dd class="stat__value">{{ stat.value }}</dd>
          <p class="stat__detail">{{ stat.detail }}</p>
        </div>
      }
    </dl>
  `,
  styles: `
    .band {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
      gap: 2rem;
      margin: 0;
    }

    .stat {
      display: flex;
      flex-direction: column;
      padding-top: 1.25rem;
      border-top: 2px solid var(--nl-forest);
    }

    .stat__value {
      order: -1;
      margin: 0 0 0.4rem;
      font-family: var(--nl-font-display);
      font-size: clamp(2.25rem, 4vw, 2.875rem);
      line-height: 1;
      color: var(--nl-ink);
    }

    .stat__label {
      font-weight: 600;
      color: var(--nl-ink);
    }

    .stat__detail {
      margin: 0.5rem 0 0;
      font-size: 0.875rem;
      line-height: 1.55;
      color: var(--nl-ink-muted);
    }
  `,
})
export class StatBandComponent {
  readonly stats = input.required<readonly ImpactStat[]>();
}
