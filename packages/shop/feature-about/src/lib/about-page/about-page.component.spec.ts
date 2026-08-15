import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AboutPageComponent } from './about-page.component';

describe('AboutPageComponent', () => {
  let fixture: ComponentFixture<AboutPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutPageComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutPageComponent);
    fixture.detectChanges();
  });

  it('renders a level 1 heading', () => {
    expect(fixture.nativeElement.querySelectorAll('h1').length).toBe(1);
  });

  it('introduces every team member', () => {
    const members = fixture.nativeElement.querySelectorAll('.member');
    expect(members.length).toBe(3);
    expect(fixture.nativeElement.textContent).toContain('Ingrid Halvorsen');
  });

  it('gives each portrait descriptive alt text', () => {
    const images = Array.from(
      fixture.nativeElement.querySelectorAll('.member__photo') as NodeListOf<HTMLImageElement>
    );

    expect(images.length).toBe(3);
    for (const image of images) {
      expect(image.getAttribute('alt')).toMatch(/^Portrait of /);
    }
  });

  it('lists credentials for each member', () => {
    expect(
      fixture.nativeElement.querySelectorAll('.member__creds li').length
    ).toBeGreaterThan(0);
  });

  it('renders the four studio values', () => {
    expect(fixture.nativeElement.querySelectorAll('.value').length).toBe(4);
  });

  it('reuses the shared stat band', () => {
    expect(fixture.nativeElement.querySelector('shop-stat-band')).toBeTruthy();
  });
});
