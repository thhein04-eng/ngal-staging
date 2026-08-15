import { Component, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StagingContentService } from '@org/shop/data';
import {
  BeforeAfterComponent,
  CtaBannerComponent,
  SectionHeadingComponent,
  ServiceCardComponent,
  StatBandComponent,
  TestimonialCardComponent,
} from '@org/shop/shared-ui';

@Component({
  selector: 'shop-home-page',
  imports: [
    NgOptimizedImage,
    RouterLink,
    BeforeAfterComponent,
    CtaBannerComponent,
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

  protected readonly company = this.content.company;
  protected readonly services = this.content.services;
  protected readonly stats = this.content.stats;
  protected readonly process = this.content.process;
  protected readonly featuredProjects = this.content.featuredProjects;
  protected readonly testimonials = this.content.testimonials;
  protected readonly heroProject = this.content.projects[0];
}
