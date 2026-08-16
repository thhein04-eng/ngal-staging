import { Component, afterNextRender, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  SiteFooterComponent,
  SiteHeaderComponent,
  ThemeService,
} from '@org/shop/shared-ui';
import { StagingContentService } from '@org/shop/data';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SiteHeaderComponent, SiteFooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly content = inject(StagingContentService);
  private readonly themeService = inject(ThemeService);

  protected readonly company = this.content.company;
  protected readonly serviceAreas = this.content.serviceAreas;
  /** Resolved once at construction so server and client markup agree. */
  protected readonly year = new Date().getFullYear();

  constructor() {
    // Browser only: the server has no storage or media queries to read.
    afterNextRender(() => this.themeService.initialize());
  }
}
