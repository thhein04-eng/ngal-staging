import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CompanyInfo, ServiceArea } from '@org/models';

/** Site footer with contact details, navigation, and service areas. */
@Component({
  selector: 'shop-site-footer',
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="footer__inner">
        <div class="col col--brand">
          <p class="brand">{{ company().name }}</p>
          <p class="tagline">{{ company().tagline }}</p>
          <address class="address">
            {{ company().street }}<br />
            {{ company().city }}, {{ company().state }} {{ company().postalCode }}
          </address>
        </div>

        <div class="col">
          <h2 class="col__title">Contact</h2>
          <ul class="list">
            <li>
              <a [href]="'tel:' + telHref()">{{ company().phone }}</a>
            </li>
            <li>
              <a [href]="'mailto:' + company().email">{{ company().email }}</a>
            </li>
            <li class="muted">{{ company().hours }}</li>
          </ul>
        </div>

        <div class="col">
          <h2 class="col__title">Explore</h2>
          <ul class="list">
            <li><a routerLink="/services">Services &amp; pricing</a></li>
            <li><a routerLink="/portfolio">Portfolio</a></li>
            <li><a routerLink="/about">About the studio</a></li>
            <li><a routerLink="/contact">Request a quote</a></li>
          </ul>
        </div>

        <div class="col">
          <h2 class="col__title">Where we work</h2>
          <ul class="list">
            @for (area of serviceAreas(); track area.city) {
              <li class="muted">{{ area.city }}, {{ area.state }}</li>
            }
          </ul>
        </div>
      </div>

      <div class="footer__bar">
        <p>
          © {{ year() }} {{ company().legalName }}. Serving the Portland metro since
          {{ company().foundedYear }}.
        </p>
        <p class="disclaimer">
          A demonstration site. Company, projects, and testimonials are fictional.
        </p>
      </div>
    </footer>
  `,
  styles: `
    .footer {
      background: var(--nl-ink);
      color: rgb(255 255 255 / 0.75);
    }

    .footer__inner {
      display: grid;
      grid-template-columns: 1.4fr repeat(3, 1fr);
      gap: 2.5rem;
      max-width: var(--nl-container);
      margin-inline: auto;
      padding: clamp(2.5rem, 5vw, 4rem) var(--nl-gutter);
    }

    .brand {
      margin: 0;
      font-family: var(--nl-font-display);
      font-size: 1.5rem;
      color: #fff;
    }

    .tagline {
      margin: 0.5rem 0 1.25rem;
      max-width: 30ch;
      line-height: 1.6;
    }

    .address {
      font-style: normal;
      line-height: 1.7;
      font-size: 0.9375rem;
    }

    .col__title {
      margin: 0 0 1rem;
      font-size: 0.8125rem;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #fff;
    }

    .list {
      margin: 0;
      padding: 0;
      list-style: none;
      display: grid;
      gap: 0.6rem;
      font-size: 0.9375rem;
    }

    .list a {
      color: rgb(255 255 255 / 0.85);
      text-decoration: none;
    }

    .list a:hover {
      color: #fff;
      text-decoration: underline;
    }

    .muted {
      color: rgb(255 255 255 / 0.6);
    }

    .footer__bar {
      border-top: 1px solid rgb(255 255 255 / 0.15);
    }

    .footer__bar p {
      max-width: var(--nl-container);
      margin-inline: auto;
      padding-inline: var(--nl-gutter);
      font-size: 0.875rem;
      color: rgb(255 255 255 / 0.6);
    }

    .footer__bar p:first-child {
      padding-top: 1.5rem;
    }

    .disclaimer {
      padding-bottom: 1.5rem;
      font-style: italic;
    }

    .footer :focus-visible {
      outline: 3px solid #fff;
      outline-offset: 3px;
    }

    @media (max-width: 56rem) {
      .footer__inner {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 34rem) {
      .footer__inner {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class SiteFooterComponent {
  readonly company = input.required<CompanyInfo>();
  readonly serviceAreas = input.required<readonly ServiceArea[]>();
  /** Passed in so the component stays free of ambient globals. */
  readonly year = input.required<number>();

  protected telHref(): string {
    return this.company().phone.replace(/[^\d+]/g, '');
  }
}
