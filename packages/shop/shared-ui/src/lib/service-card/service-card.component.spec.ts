import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { StagingService } from '@org/models';
import { ServiceCardComponent } from './service-card.component';

const SERVICE: StagingService = {
  id: 'occupied',
  name: 'Occupied Staging',
  tagline: 'You keep living there.',
  description: 'Works with what you already own.',
  priceFrom: 1850,
  priceUnit: 'per project',
  turnaround: '2–3 days on site',
  features: ['Full walkthrough', '60-day rental period'],
  featured: true,
};

describe('ServiceCardComponent', () => {
  let fixture: ComponentFixture<ServiceCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceCardComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceCardComponent);
    fixture.componentRef.setInput('service', SERVICE);
    fixture.detectChanges();
  });

  it('renders the package name and tagline', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Occupied Staging');
    expect(text).toContain('You keep living there.');
  });

  it('formats the starting price without decimals', () => {
    expect(fixture.nativeElement.querySelector('.price__value').textContent).toContain(
      '$1,850'
    );
  });

  it('lists every included feature', () => {
    const items = fixture.nativeElement.querySelectorAll('.features li');
    expect(items.length).toBe(SERVICE.features.length);
  });

  it('flags the featured package', () => {
    expect(fixture.nativeElement.querySelector('.badge').textContent).toContain(
      'Most chosen'
    );
  });

  it('omits the badge for non-featured packages', () => {
    fixture.componentRef.setInput('service', { ...SERVICE, featured: false });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.badge')).toBeNull();
  });

  it('links to the contact form preselecting this package', () => {
    const cta = fixture.nativeElement.querySelector('.cta') as HTMLAnchorElement;
    expect(cta.getAttribute('href')).toBe('/contact?service=occupied');
  });

  it('gives the link an accessible name that names the package', () => {
    expect(fixture.nativeElement.querySelector('.cta').textContent).toContain(
      'Occupied Staging'
    );
  });
});
