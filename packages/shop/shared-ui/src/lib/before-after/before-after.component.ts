import {
  Component,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

/**
 * Before/after comparison slider.
 *
 * The handle is a real `input[type=range]`, so it is keyboard operable and
 * announced correctly without any custom ARIA. The visible divider tracks its
 * value; the input itself is transparent and stretched across the image.
 *
 * With `scrub` enabled the reveal is additionally driven by scroll position
 * while the figure is pinned on screen. Dragging or using the keyboard takes
 * over immediately and permanently, so the control never fights the visitor.
 */
@Component({
  selector: 'shop-before-after',
  imports: [NgOptimizedImage],
  template: `
    <figure class="compare">
      <div
        class="frame"
        [style.--nl-pos]="position() + '%'"
        [style.--nl-reveal]="position() / 100"
      >
        <img
          class="layer"
          [ngSrc]="afterImage()"
          fill
          [priority]="priority()"
          [alt]="afterAlt()"
        />

        <div class="layer layer--before" aria-hidden="true">
          <img class="layer" [ngSrc]="beforeImage()" fill [alt]="beforeAlt()" />
        </div>

        <span class="tag tag--before" aria-hidden="true">Before</span>
        <span class="tag tag--after" aria-hidden="true">After</span>

        <div class="divider" aria-hidden="true">
          <span class="knob">
            <svg viewBox="0 0 24 24" width="18" height="18" focusable="false">
              <path
                d="M9 6 4 12l5 6M15 6l5 6-5 6"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
        </div>

        <input
          class="range"
          type="range"
          min="0"
          max="100"
          step="1"
          [value]="position()"
          (input)="onInput($event)"
          [attr.aria-label]="sliderLabel()"
          [attr.aria-valuetext]="valueText()"
        />
      </div>

      @if (caption(); as text) {
        <figcaption class="caption">{{ text }}</figcaption>
      }
    </figure>
  `,
  styles: `
    .compare {
      margin: 0;
    }

    .frame {
      position: relative;
      aspect-ratio: 3 / 2;
      overflow: hidden;
      border-radius: var(--nl-radius);
      background: var(--nl-sand);
      box-shadow: var(--nl-shadow-md);
      isolation: isolate;
    }

    .layer {
      object-fit: cover;
    }

    /* The before image is revealed from the left edge up to the handle. */
    .layer--before {
      position: absolute;
      inset: 0;
      clip-path: inset(0 calc(100% - var(--nl-pos)) 0 0);
    }

    .tag {
      position: absolute;
      top: 1rem;
      z-index: 3;
      padding: 0.3rem 0.7rem;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      background: rgb(255 255 255 / 0.92);
      color: #23211e;
    }

    /* Fades in as the before side is revealed. --nl-reveal is unitless, so it
       can be used directly as an opacity; --nl-pos carries the % unit. */
    .tag--before {
      left: 1rem;
      opacity: var(--nl-reveal);
    }

    .tag--after {
      right: 1rem;
      background: var(--nl-forest);
      color: var(--nl-on-forest);
    }

    .divider {
      position: absolute;
      inset-block: 0;
      left: var(--nl-pos);
      z-index: 4;
      width: 2px;
      background: rgb(255 255 255 / 0.95);
      transform: translateX(-1px);
      pointer-events: none;
    }

    .knob {
      position: absolute;
      top: 50%;
      left: 50%;
      display: grid;
      place-items: center;
      width: 2.75rem;
      height: 2.75rem;
      border-radius: 50%;
      background: #fff;
      color: #2f5d50;
      box-shadow: 0 2px 10px rgb(0 0 0 / 0.28);
      transform: translate(-50%, -50%);
    }

    /* Transparent control layered over the image; the divider is its visuals. */
    .range {
      position: absolute;
      inset: 0;
      z-index: 5;
      width: 100%;
      height: 100%;
      margin: 0;
      appearance: none;
      background: transparent;
      cursor: ew-resize;
    }

    .range::-webkit-slider-thumb {
      appearance: none;
      width: 2.75rem;
      height: 2.75rem;
      border-radius: 50%;
      background: transparent;
      cursor: ew-resize;
    }

    .range::-moz-range-thumb {
      width: 2.75rem;
      height: 2.75rem;
      border: 0;
      border-radius: 50%;
      background: transparent;
      cursor: ew-resize;
    }

    .range:focus-visible {
      outline: none;
    }

    .range:focus-visible ~ .divider .knob {
      outline: 3px solid var(--nl-focus);
      outline-offset: 3px;
    }

    .caption {
      margin-top: 0.875rem;
      font-size: 0.9375rem;
      line-height: 1.6;
      color: var(--nl-ink-muted);
    }

    @media (prefers-reduced-motion: no-preference) {
      .knob {
        transition: outline-color 0.15s ease, transform 0.25s var(--nl-ease);
      }

      .frame:hover .knob {
        transform: translate(-50%, -50%) scale(1.08);
      }
    }
  `,
})
export class BeforeAfterComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly beforeImage = input.required<string>();
  readonly afterImage = input.required<string>();
  readonly beforeAlt = input('The room before staging');
  readonly afterAlt = input('The room after staging');
  readonly caption = input<string>();
  readonly label = input<string>();
  /** Set on the first slider above the fold to preload its "after" image. */
  readonly priority = input(false);
  /** Drives the reveal from scroll position while the figure is on screen. */
  readonly scrub = input(false);

  private readonly pos = signal(50);
  readonly position = this.pos.asReadonly();

  /** Set once the visitor drags or keys the slider; scroll stops driving it. */
  private interacted = false;

  readonly sliderLabel = computed(
    () => this.label() ?? 'Drag to compare the room before and after staging'
  );

  readonly valueText = computed(() => `${this.pos()}% before, ${100 - this.pos()}% after`);

  constructor() {
    afterNextRender(() => {
      if (this.scrub()) {
        this.startScrub();
      }
    });
  }

  onInput(event: Event): void {
    this.interacted = true;
    this.pos.set(Number((event.target as HTMLInputElement).value));
  }

  private startScrub(): void {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const element = this.host.nativeElement;

    // While the figure is pinned its own rect stops moving, so progress has to
    // be measured against the tall stage that provides the scroll room. Falls
    // back to the figure itself when it is not inside a stage.
    const stage = element.closest<HTMLElement>('[data-scrub-stage]');

    let queued = false;

    const update = () => {
      queued = false;
      if (this.interacted) {
        return;
      }

      const viewport = window.innerHeight;
      let raw: number;

      if (stage) {
        const rect = stage.getBoundingClientRect();
        const scrollable = Math.max(stage.offsetHeight - viewport, 1);
        raw = -rect.top / scrollable;
      } else {
        const rect = element.getBoundingClientRect();
        const travel = rect.height + viewport;
        raw = (viewport - rect.top) / travel;
      }

      // Leave a margin at each end so the wipe settles fully open before the
      // stage releases, rather than still moving as the section scrolls away.
      const eased = Math.min(Math.max((raw - 0.08) / 0.72, 0), 1);
      this.pos.set(Math.round(eased * 100));
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
  }
}
