import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SiteHeaderComponent } from './site-header.component';

describe('SiteHeaderComponent', () => {
  let fixture: ComponentFixture<SiteHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteHeaderComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SiteHeaderComponent);
    fixture.detectChanges();
  });

  function toggle(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('.menu-toggle');
  }

  it('renders a skip link targeting the main landmark', () => {
    const skip = fixture.nativeElement.querySelector('.skip') as HTMLAnchorElement;
    expect(skip.getAttribute('href')).toBe('#main');
  });

  it('labels the primary navigation', () => {
    expect(fixture.nativeElement.querySelector('nav').getAttribute('aria-label')).toBe(
      'Primary'
    );
  });

  it('starts with the mobile menu collapsed', () => {
    expect(toggle().getAttribute('aria-expanded')).toBe('false');
  });

  it('expands and collapses the menu on toggle', () => {
    toggle().click();
    fixture.detectChanges();
    expect(toggle().getAttribute('aria-expanded')).toBe('true');

    toggle().click();
    fixture.detectChanges();
    expect(toggle().getAttribute('aria-expanded')).toBe('false');
  });

  it('points the toggle at the nav it controls', () => {
    expect(toggle().getAttribute('aria-controls')).toBe('primary-nav');
    expect(fixture.nativeElement.querySelector('#primary-nav')).toBeTruthy();
  });

  it('closes the menu when a nav link is followed', () => {
    toggle().click();
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('.nav__list a') as HTMLAnchorElement;
    link.click();
    fixture.detectChanges();

    expect(toggle().getAttribute('aria-expanded')).toBe('false');
  });

  it('closes the menu on a click outside the header', () => {
    toggle().click();
    fixture.detectChanges();

    document.body.click();
    fixture.detectChanges();

    expect(toggle().getAttribute('aria-expanded')).toBe('false');
  });

  it('keeps the menu open when the click lands on inert header chrome', () => {
    toggle().click();
    fixture.detectChanges();

    (fixture.nativeElement.querySelector('.header__inner') as HTMLElement).click();
    fixture.detectChanges();

    expect(toggle().getAttribute('aria-expanded')).toBe('true');
  });

  it('renders every primary destination', () => {
    const labels = Array.from(
      fixture.nativeElement.querySelectorAll('.nav__list a') as NodeListOf<HTMLElement>
    ).map((link) => link.textContent?.trim());

    expect(labels).toEqual(
      expect.arrayContaining(['Services', 'Portfolio', 'About', 'Contact'])
    );
  });
});
