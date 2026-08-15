import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PortfolioPageComponent } from './portfolio-page.component';

describe('PortfolioPageComponent', () => {
  let fixture: ComponentFixture<PortfolioPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioPageComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PortfolioPageComponent);
    fixture.detectChanges();
  });

  function chips(): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.chip'));
  }

  function chip(label: string): HTMLButtonElement {
    const found = chips().find((button) => button.textContent?.trim() === label);
    if (!found) {
      throw new Error(`No filter chip labelled "${label}"`);
    }
    return found;
  }

  function cards(): NodeListOf<HTMLElement> {
    return fixture.nativeElement.querySelectorAll('shop-project-card');
  }

  it('renders a level 1 heading', () => {
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain(
      'Homes we staged'
    );
  });

  it('shows all projects initially', () => {
    expect(cards().length).toBe(6);
    expect(fixture.nativeElement.querySelector('.filters__count').textContent).toContain(
      '6 projects'
    );
  });

  it('marks the active filter with aria-pressed', () => {
    expect(chip('All projects').getAttribute('aria-pressed')).toBe('true');
    expect(chip('Vacant').getAttribute('aria-pressed')).toBe('false');
  });

  it('filters the archive when a chip is chosen', () => {
    chip('Vacant').click();
    fixture.detectChanges();

    expect(chip('Vacant').getAttribute('aria-pressed')).toBe('true');
    expect(cards().length).toBe(3);
  });

  it('uses the singular noun for a single result', () => {
    chip('Luxury').click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.filters__count').textContent).toContain(
      '1 project'
    );
  });

  it('announces the result count politely', () => {
    expect(
      fixture.nativeElement.querySelector('.filters__count').getAttribute('aria-live')
    ).toBe('polite');
  });

  it('restores the full archive when All projects is chosen', () => {
    chip('Occupied').click();
    fixture.detectChanges();
    expect(cards().length).toBe(2);

    chip('All projects').click();
    fixture.detectChanges();
    expect(cards().length).toBe(6);
  });

  it('renders two showcase comparison sliders', () => {
    expect(fixture.nativeElement.querySelectorAll('shop-before-after').length).toBe(2);
  });

  it('groups the filters under a labelled group', () => {
    const group = fixture.nativeElement.querySelector('[role=group]');
    expect(group.getAttribute('aria-labelledby')).toBe('filter-label');
    expect(fixture.nativeElement.querySelector('#filter-label')).toBeTruthy();
  });
});
