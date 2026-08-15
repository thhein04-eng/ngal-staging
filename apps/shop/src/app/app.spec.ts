import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { App } from './app';
import { appRoutes } from './app.routes';

describe('App', () => {
  let component: App;
  let fixture: ComponentFixture<App>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(appRoutes)],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the site header with the brand name', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('shop-site-header')?.textContent).toContain(
      'Northlight'
    );
  });

  it('should expose a skip link as the first focusable element', () => {
    const skip = fixture.nativeElement.querySelector('a.skip') as HTMLAnchorElement;
    expect(skip).toBeTruthy();
    expect(skip.getAttribute('href')).toBe('#main');
  });

  it('should render the primary navigation', () => {
    const navLinks = fixture.debugElement.queryAll(By.css('nav[aria-label="Primary"] a'));
    const labels = navLinks.map((link) => link.nativeElement.textContent.trim());

    expect(labels).toEqual(
      expect.arrayContaining(['Services', 'Portfolio', 'About', 'Contact'])
    );
  });

  it('should render a main landmark that the skip link targets', () => {
    const main = fixture.nativeElement.querySelector('main#main');
    expect(main).toBeTruthy();
  });

  it('should render the router outlet', () => {
    expect(fixture.nativeElement.querySelector('router-outlet')).toBeTruthy();
  });

  it('should render the footer with company details', () => {
    const footer = fixture.nativeElement.querySelector('shop-site-footer');
    expect(footer?.textContent).toContain('Northlight');
    expect(footer?.textContent).toContain('hello@northlightstaging.com');
  });
});
