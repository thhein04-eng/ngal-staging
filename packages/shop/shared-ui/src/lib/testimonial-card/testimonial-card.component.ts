import { Component, computed, input } from '@angular/core';
import { Testimonial } from '@org/models';

/** Pull-quote card for a client or agent testimonial. */
@Component({
  selector: 'shop-testimonial-card',
  template: `
    <figure class="card">
      <p class="rating">
        <span class="visually-hidden">{{ ratingLabel() }}</span>
        <span class="stars" aria-hidden="true">
          @for (filled of stars(); track $index) {
            <span [class.stars__on]="filled">★</span>
          }
        </span>
      </p>

      <blockquote class="quote">
        <p>{{ testimonial().quote }}</p>
      </blockquote>

      <figcaption class="attribution">
        <span class="author">{{ testimonial().author }}</span>
        <span class="role">{{ testimonial().role }}, {{ testimonial().company }}</span>
      </figcaption>
    </figure>
  `,
  styles: `
    .card {
      display: flex;
      flex-direction: column;
      height: 100%;
      margin: 0;
      padding: 2rem;
      border-radius: var(--nl-radius);
      background: var(--nl-surface);
      border: 1px solid var(--nl-line);
    }

    .rating {
      margin: 0 0 1rem;
    }

    .stars {
      color: var(--nl-line-strong);
      font-size: 1.05rem;
      letter-spacing: 0.15em;
    }

    .stars__on {
      color: var(--nl-clay);
    }

    .quote {
      margin: 0;
      flex: 1;
    }

    .quote p {
      margin: 0;
      font-family: var(--nl-font-display);
      font-size: 1.1875rem;
      line-height: 1.6;
      color: var(--nl-ink);
      text-wrap: pretty;
    }

    .attribution {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      margin-top: 1.75rem;
      padding-top: 1.25rem;
      border-top: 1px solid var(--nl-line);
    }

    .author {
      font-weight: 600;
      color: var(--nl-ink);
    }

    .role {
      font-size: 0.875rem;
      color: var(--nl-ink-muted);
    }
  `,
})
export class TestimonialCardComponent {
  readonly testimonial = input.required<Testimonial>();

  protected readonly stars = computed(() =>
    Array.from({ length: 5 }, (_, index) => index < this.testimonial().rating)
  );

  protected readonly ratingLabel = computed(
    () => `Rated ${this.testimonial().rating} out of 5`
  );
}
