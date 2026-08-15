import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('@org/shop/feature-home').then((m) => m.HomePageComponent),
    title: 'Northlight Home Staging — Portland, Oregon',
  },
  {
    path: 'services',
    loadComponent: () =>
      import('@org/shop/feature-services').then((m) => m.ServicesPageComponent),
    title: 'Services & Pricing — Northlight Home Staging',
  },
  {
    path: 'portfolio',
    loadComponent: () =>
      import('@org/shop/feature-portfolio').then((m) => m.PortfolioPageComponent),
    title: 'Portfolio — Northlight Home Staging',
  },
  {
    path: 'about',
    loadComponent: () =>
      import('@org/shop/feature-about').then((m) => m.AboutPageComponent),
    title: 'About the Studio — Northlight Home Staging',
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('@org/shop/feature-contact').then((m) => m.ContactPageComponent),
    title: 'Request a Quote — Northlight Home Staging',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
