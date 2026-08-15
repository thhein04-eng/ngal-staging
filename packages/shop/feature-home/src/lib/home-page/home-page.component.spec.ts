import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HomePageComponent } from './home-page.component';

describe('HomePageComponent', () => {
  let fixture: ComponentFixture<HomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePageComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();
  });

  it('renders exactly one level 1 heading', () => {
    const h1s = fixture.nativeElement.querySelectorAll('h1');
    expect(h1s.length).toBe(1);
    expect(h1s[0].textContent).toContain('Homes that photograph beautifully');
  });

  it('offers both primary calls to action', () => {
    const hrefs = Array.from(
      fixture.nativeElement.querySelectorAll('.hero__actions a') as NodeListOf<HTMLAnchorElement>
    ).map((link) => link.getAttribute('href'));

    expect(hrefs).toEqual(['/contact', '/portfolio']);
  });

  it('gives the hero image descriptive alt text', () => {
    const img = fixture.nativeElement.querySelector('.hero__media img');
    expect(img.getAttribute('alt')).toContain('staged living room');
  });

  it('renders the impact stats', () => {
    expect(fixture.nativeElement.querySelectorAll('shop-stat-band').length).toBe(1);
    expect(fixture.nativeElement.textContent).toContain('Average time to pending');
  });

  it('renders the before/after comparison', () => {
    expect(fixture.nativeElement.querySelector('shop-before-after')).toBeTruthy();
  });

  it('renders a card per staging package', () => {
    expect(fixture.nativeElement.querySelectorAll('shop-service-card').length).toBe(4);
  });

  it('renders the four process steps in order', () => {
    const titles = Array.from(
      fixture.nativeElement.querySelectorAll('.process__title') as NodeListOf<HTMLElement>
    ).map((el) => el.textContent?.trim());

    expect(titles).toEqual(['Walkthrough', 'Staging plan', 'Install', 'Market and de-stage']);
  });

  it('previews three recent projects', () => {
    expect(fixture.nativeElement.querySelectorAll('.mini').length).toBe(3);
  });

  it('renders every testimonial', () => {
    expect(fixture.nativeElement.querySelectorAll('shop-testimonial-card').length).toBe(4);
  });

  it('closes with a call to action banner', () => {
    expect(fixture.nativeElement.querySelector('shop-cta-banner')).toBeTruthy();
  });
});
