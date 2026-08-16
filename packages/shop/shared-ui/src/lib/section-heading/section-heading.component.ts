import { Component, input } from '@angular/core';

/**
 * Standard section introduction: a small eyebrow label, a heading, and an
 * optional lead paragraph. Keeps vertical rhythm consistent across pages.
 */
@Component({
  selector: 'shop-section-heading',
  template: `
    <div class="heading" [class.heading--centered]="centered()">
      @if (eyebrow(); as label) {
        <p class="eyebrow">{{ label }}</p>
      }
      @switch (level()) {
        @case (1) {
          <h1 class="title">{{ title() }}</h1>
        }
        @default {
          <h2 class="title">{{ title() }}</h2>
        }
      }
      @if (lead(); as leadText) {
        <p class="lead">{{ leadText }}</p>
      }
    </div>
  `,
  styles: `
    .heading {
      max-width: 62ch;
    }

    .heading--centered {
      margin-inline: auto;
      text-align: center;
    }

    .eyebrow {
      margin: 0 0 0.75rem;
      font-size: 0.8125rem;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--nl-accent);
    }

    .title {
      margin: 0;
      font-family: var(--nl-font-display);
      font-size: var(--nl-size-h2);
      font-weight: 400;
      line-height: 1.15;
      letter-spacing: -0.015em;
      color: var(--nl-ink);
      text-wrap: balance;
    }

    h1.title {
      font-size: var(--nl-size-h1);
    }

    .lead {
      margin: 1.25rem 0 0;
      font-size: 1.125rem;
      line-height: 1.65;
      color: var(--nl-ink-muted);
      text-wrap: pretty;
    }
  `,
})
export class SectionHeadingComponent {
  readonly eyebrow = input<string>();
  readonly title = input.required<string>();
  readonly lead = input<string>();
  readonly centered = input(false);
  /** Renders an `h1` when set to 1, otherwise an `h2`. */
  readonly level = input<1 | 2>(2);
}
