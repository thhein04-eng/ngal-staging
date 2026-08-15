import { Component, inject, signal } from '@angular/core';
import { StagingContentService } from '@org/shop/data';
import {
  CtaBannerComponent,
  SectionHeadingComponent,
  ServiceCardComponent,
} from '@org/shop/shared-ui';

@Component({
  selector: 'shop-services-page',
  imports: [CtaBannerComponent, SectionHeadingComponent, ServiceCardComponent],
  templateUrl: './services-page.component.html',
  styleUrl: './services-page.component.css',
})
export class ServicesPageComponent {
  private readonly content = inject(StagingContentService);

  protected readonly services = this.content.services;
  protected readonly process = this.content.process;
  protected readonly faqs = this.content.faqs;
  protected readonly serviceAreas = this.content.serviceAreas;

  /** Id of the currently expanded FAQ, or null when all are collapsed. */
  private readonly expanded = signal<string | null>(null);

  protected isExpanded(id: string): boolean {
    return this.expanded() === id;
  }

  protected toggleFaq(id: string): void {
    this.expanded.update((current) => (current === id ? null : id));
  }
}
