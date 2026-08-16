import {
  Directive,
  ElementRef,
  afterNextRender,
  inject,
  input,
} from '@angular/core';

export type RevealDirection = 'up' | 'left' | 'right' | 'scale' | 'fade';

/**
 * Reveals an element as it scrolls into view.
 *
 * The hidden starting state lives in global CSS behind `.motion-ready`, which
 * an inline script sets before first paint only when reduced motion is not
 * requested. So if this directive never runs — no JavaScript, no
 * IntersectionObserver, reduced motion — the element is simply visible, and
 * nothing is lost.
 *
 * Elements are revealed once and then unobserved; re-animating on every pass
 * is the thing that makes these pages feel restless.
 */
@Directive({
  selector: '[shopReveal]',
  host: {
    '[attr.data-reveal]': 'shopReveal()',
    '[style.--nl-reveal-delay]': 'delayMs()',
  },
})
export class RevealDirective {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Direction the element travels from. */
  readonly shopReveal = input<RevealDirection>('up');
  /** Delay in milliseconds, for cascading a group of siblings. */
  readonly revealDelay = input(0);
  /** Fraction of the element that must be visible before it reveals. */
  readonly revealThreshold = input(0.15);

  protected readonly delayMs = () => `${this.revealDelay()}ms`;

  constructor() {
    afterNextRender(() => this.observe());
  }

  private observe(): void {
    const element = this.host.nativeElement;

    if (!('IntersectionObserver' in window)) {
      element.classList.add('is-revealed');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            element.classList.add('is-revealed');
            observer.disconnect();
          }
        }
      },
      { threshold: this.revealThreshold(), rootMargin: '0px 0px -8% 0px' }
    );

    observer.observe(element);
  }
}
