import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteFooterComponent, SiteHeaderComponent } from '@org/shop/shared-ui';
import { StagingContentService } from '@org/shop/data';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SiteHeaderComponent, SiteFooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly content = inject(StagingContentService);

  protected readonly company = this.content.company;
  protected readonly serviceAreas = this.content.serviceAreas;
  /** Resolved once at construction so server and client markup agree. */
  protected readonly year = new Date().getFullYear();
}
