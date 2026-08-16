import { Component, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { StagingContentService } from '@org/shop/data';
import {
  CtaBannerComponent,
  RevealDirective,
  SectionHeadingComponent,
  StatBandComponent,
} from '@org/shop/shared-ui';

@Component({
  selector: 'shop-about-page',
  imports: [CtaBannerComponent, NgOptimizedImage, RevealDirective, SectionHeadingComponent, StatBandComponent],
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.css',
})
export class AboutPageComponent {
  private readonly content = inject(StagingContentService);

  protected readonly company = this.content.company;
  protected readonly team = this.content.team;
  protected readonly stats = this.content.stats;

  protected readonly values = [
    {
      title: 'We tell you what the house actually needs',
      body: 'Sometimes that is a full stage. Sometimes it is a consultation and a weekend of your own work. We would rather quote you accurately than upsell you into a package that will not change your outcome.',
    },
    {
      title: 'Fixed quotes, before anything is ordered',
      body: 'You approve a written scope with a number on it. We do not send surprise invoices for the extra lamp, and we do not start work until you have said yes.',
    },
    {
      title: 'We hit our install dates',
      body: 'Listing launches are choreography — photographer, copy, MLS, open house. Our crew shows up on the day we promised so the rest of your schedule holds.',
    },
    {
      title: 'Our inventory is our own',
      body: 'Twelve thousand square feet of warehouse in North Portland. Nothing gets delayed because a rental house could not deliver a sofa on time.',
    },
  ];
}
