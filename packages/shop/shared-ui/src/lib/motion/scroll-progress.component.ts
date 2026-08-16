import { Component, afterNextRender, signal } from '@angular/core';

/**
 * Thin reading-progress bar pinned under the masthead.
 *
 * Purely decorative, so it is hidden from assistive technology and skipped
 * entirely when reduced motion is requested.
 */
@Component({
  selector: 'shop-scroll-progress',
  template: `
    @if (enabled()) {
      <div class="track" aria-hidden="true">
        <div class="bar" [style.transform]="'scaleX(' + progress() + ')'"></div>
      </div>
    }
  `,
  styles: `
    .track {
      position: absolute;
      inset-inline: 0;
      bottom: -1px;
      height: 2px;
      overflow: hidden;
      pointer-events: none;
    }

    .bar {
      height: 100%;
      background: var(--nl-accent);
      transform-origin: left center;
    }
  `,
})
export class ScrollProgressComponent {
  protected readonly progress = signal(0);
  protected readonly enabled = signal(false);

  constructor() {
    afterNextRender(() => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      this.enabled.set(true);

      let queued = false;
      const update = () => {
        queued = false;
        const scrollable =
          document.documentElement.scrollHeight - window.innerHeight;
        this.progress.set(
          scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0
        );
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
}
