import {
  Component,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';

/**
 * Counts a number up when it scrolls into view.
 *
 * The final value is rendered immediately on the server and whenever motion is
 * unavailable, so the figure is never missing — the animation only replaces a
 * already-correct value with a brief count.
 */
@Component({
  selector: 'shop-count-up',
  template: `{{ display() }}`,
  host: { '[attr.aria-label]': 'ariaLabel()' },
})
export class CountUpComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly value = input.required<number>();
  readonly prefix = input('');
  readonly suffix = input('');
  readonly durationMs = input(1600);
  /** Thousands separators, e.g. 12,000. */
  readonly grouped = input(true);

  private readonly current = signal<number | null>(null);

  protected readonly display = computed(() => {
    const shown = this.current() ?? this.value();
    const formatted = this.grouped() ? shown.toLocaleString('en-US') : `${shown}`;
    return `${this.prefix()}${formatted}${this.suffix()}`;
  });

  /** Screen readers get the final figure, not the intermediate ticks. */
  protected readonly ariaLabel = computed(
    () => `${this.prefix()}${this.value().toLocaleString('en-US')}${this.suffix()}`
  );

  constructor() {
    afterNextRender(() => this.watch());
  }

  private watch(): void {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !('IntersectionObserver' in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            observer.disconnect();
            this.run();
          }
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(this.host.nativeElement);
  }

  private run(): void {
    const target = this.value();
    const duration = this.durationMs();
    const start = performance.now();

    this.current.set(0);

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic: fast start, gentle settle.
      const eased = 1 - Math.pow(1 - progress, 3);

      this.current.set(Math.round(target * eased));

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        this.current.set(target);
      }
    };

    requestAnimationFrame(tick);
  }
}
