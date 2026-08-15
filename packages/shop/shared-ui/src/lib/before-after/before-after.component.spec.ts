import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BeforeAfterComponent } from './before-after.component';

describe('BeforeAfterComponent', () => {
  let fixture: ComponentFixture<BeforeAfterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeforeAfterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BeforeAfterComponent);
    fixture.componentRef.setInput('beforeImage', '/images/projects/alberta-before.svg');
    fixture.componentRef.setInput('afterImage', '/images/projects/alberta-after.svg');
    fixture.detectChanges();
  });

  function slider(): HTMLInputElement {
    return fixture.nativeElement.querySelector('input[type=range]');
  }

  it('starts at the midpoint', () => {
    expect(fixture.componentInstance.position()).toBe(50);
    expect(slider().value).toBe('50');
  });

  it('uses a real range input so it is keyboard operable', () => {
    const input = slider();
    expect(input.min).toBe('0');
    expect(input.max).toBe('100');
  });

  it('updates the reveal position on input', () => {
    const input = slider();
    input.value = '80';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.componentInstance.position()).toBe(80);
  });

  it('drives the clip position through a custom property', () => {
    const input = slider();
    input.value = '25';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const frame = fixture.nativeElement.querySelector('.frame') as HTMLElement;
    expect(frame.style.getPropertyValue('--nl-pos')).toBe('25%');
  });

  it('exposes a unitless reveal fraction for opacity', () => {
    const input = slider();
    input.value = '80';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const frame = fixture.nativeElement.querySelector('.frame') as HTMLElement;
    // Must be unitless: calc(80% / 100) would yield 0.8%, not 0.8.
    expect(frame.style.getPropertyValue('--nl-reveal')).toBe('0.8');
  });

  it('falls back to a descriptive slider label', () => {
    expect(slider().getAttribute('aria-label')).toContain('before and after staging');
  });

  it('uses a caller supplied label when given', () => {
    fixture.componentRef.setInput('label', 'Compare the Pearl District loft');
    fixture.detectChanges();

    expect(slider().getAttribute('aria-label')).toBe('Compare the Pearl District loft');
  });

  it('announces the split as readable text', () => {
    const input = slider();
    input.value = '30';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(slider().getAttribute('aria-valuetext')).toBe('30% before, 70% after');
  });

  it('hides the decorative before layer from assistive technology', () => {
    const layer = fixture.nativeElement.querySelector('.layer--before');
    expect(layer.getAttribute('aria-hidden')).toBe('true');
  });

  it('renders a caption when provided', () => {
    fixture.componentRef.setInput('caption', 'Alberta Arts Craftsman');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('figcaption').textContent).toContain(
      'Alberta Arts Craftsman'
    );
  });
});
