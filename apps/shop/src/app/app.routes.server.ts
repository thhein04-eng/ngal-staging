import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Every page is static marketing content, so each one is prerendered at build
 * time. The catch-all stays server-rendered to handle unknown URLs.
 */
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'services', renderMode: RenderMode.Prerender },
  { path: 'portfolio', renderMode: RenderMode.Prerender },
  { path: 'about', renderMode: RenderMode.Prerender },
  { path: 'contact', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Server },
];
