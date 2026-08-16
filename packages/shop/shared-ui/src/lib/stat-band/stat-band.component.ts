import { Component, input } from '@angular/core';
import { ImpactStat } from '@org/models';
import { CountUpComponent } from '../motion/count-up.component';
import { RevealDirective } from '../motion/reveal.directive';

/** Splits "12,000" or "9 days" into a number plus its surrounding text. */
function parse(value: string): { prefix: string; number: number | null; suffix: string } {
  const match = value.match(/^([^\d]*)([\d,]+)(.*)$/);
  if (!match) {
    return { prefix: value, number: null, suffix: '' };
  }
  return {
    prefix: match[1],
    number: Number(match[2].replace(/,/g, '')),
    suffix: match[3],
  };
}

/** Row of headline metrics, counted up as they scroll into view. */
@Component({
  selector: 'shop-stat-band',
  imports: [CountUpComponent, RevealDirective],
  template: `
    <dl class="band">
      @for (stat of stats(); track stat.label; let i = $index) {
        <div class="stat" shopReveal="up" [revealDelay]="i * 90">
          <dt class="stat__label">{{ stat.label }}</dt>
          <dd class="stat__value">
            @if (parts(stat.value); as p) {
              @if (p.number !== null) {
                <shop-count-up
                  [value]="p.number"
                  [prefix]="p.prefix"
                  [suffix]="p.suffix"
                />
              } @else {
                {{ stat.value }}
              }
            }
          </dd>
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
      border-top: 2px solid var(--nl-accent);
    }

    .stat__value {
      order: -1;
      margin: 0 0 0.4rem;
      font-family: var(--nl-font-display);
      font-size: clamp(2.25rem, 4vw, 2.875rem);
      line-height: 1;
      color: var(--nl-ink);
      font-variant-numeric: tabular-nums;
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

  protected parts = parse;
}
