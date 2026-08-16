import {
  Component,
  ElementRef,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StagingContentService } from '@org/shop/data';
import {
  BeforeAfterComponent,
  CtaBannerComponent,
  RevealDirective,
  SectionHeadingComponent,
  ServiceCardComponent,
  StatBandComponent,
  TestimonialCardComponent,
} from '@org/shop/shared-ui';

/** Splits a headline into words so each can animate on its own delay. */
function words(text: string): string[] {
  return text.split(' ');
}

@Component({
  selector: 'shop-home-page',
  imports: [
    NgOptimizedImage,
    RouterLink,
    BeforeAfterComponent,
    CtaBannerComponent,
    RevealDirective,
    SectionHeadingComponent,
    ServiceCardComponent,
    StatBandComponent,
    TestimonialCardComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  private readonly content = inject(StagingContentService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly company = this.content.company;
  protected readonly services = this.content.services;
  protected readonly stats = this.content.stats;
  protected readonly process = this.content.process;
  protected readonly featuredProjects = this.content.featuredProjects;
  protected readonly testimonials = this.content.testimonials;
  protected readonly heroProject = this.content.projects[0];

  /** The sentence assistive technology announces, kept whole and unsplit. */
  protected readonly headline = 'Homes that photograph beautifully. And sell faster.';
  protected readonly headlineWords = words('Homes that photograph beautifully.');
  protected readonly headlineTail = words('And sell faster.');

  /** 0 at rest, 1 once the hero has scrolled a full screen away. */
  private readonly shift = signal(0);
  protected readonly heroShift = this.shift.asReadonly();

  /** Set once the hero animation has been kicked off on the client. */
  protected readonly entered = signal(false);

  constructor() {
    afterNextRender(() => {
      // The headline animates in on load rather than on intersection, since it
      // is above the fold on every viewport.
      requestAnimationFrame(() => this.entered.set(true));

      if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      const hero = this.host.nativeElement.querySelector('.hero');
      if (!hero) {
        return;
      }

      let queued = false;
      const update = () => {
        queued = false;
        const height = (hero as HTMLElement).offsetHeight || 1;
        this.shift.set(Math.min(window.scrollY / height, 1));
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

  /** Stagger step for the headline words, in milliseconds. */
  protected wordDelay(index: number): string {
    return `${80 + index * 55}ms`;
  }
}
