import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ServicesPageComponent } from './services-page.component';

describe('ServicesPageComponent', () => {
  let fixture: ComponentFixture<ServicesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesPageComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ServicesPageComponent);
    fixture.detectChanges();
  });

  function faqTriggers(): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.faq__trigger'));
  }

  it('renders a level 1 heading', () => {
    expect(fixture.nativeElement.querySelector('h1')).toBeTruthy();
  });

  it('renders a card for every package', () => {
    expect(fixture.nativeElement.querySelectorAll('shop-service-card').length).toBe(4);
  });

  it('summarises the packages in a captioned table', () => {
    const table = fixture.nativeElement.querySelector('table');
    expect(table.querySelector('caption')).toBeTruthy();
    expect(table.querySelectorAll('tbody tr').length).toBe(4);
  });

  it('uses row scope headers in the comparison table', () => {
    const rowHeader = fixture.nativeElement.querySelector('tbody th');
    expect(rowHeader.getAttribute('scope')).toBe('row');
  });

  it('starts with every FAQ collapsed', () => {
    expect(faqTriggers().every((t) => t.getAttribute('aria-expanded') === 'false')).toBe(
      true
    );
    expect(fixture.nativeElement.querySelector('.faq__panel')).toBeNull();
  });

  it('expands an FAQ when its trigger is activated', () => {
    faqTriggers()[0].click();
    fixture.detectChanges();

    expect(faqTriggers()[0].getAttribute('aria-expanded')).toBe('true');
    expect(fixture.nativeElement.querySelector('.faq__panel')).toBeTruthy();
  });

  it('wires the trigger to its panel', () => {
    const trigger = faqTriggers()[0];
    trigger.click();
    fixture.detectChanges();

    const panelId = trigger.getAttribute('aria-controls');
    const panel = fixture.nativeElement.querySelector(`#${panelId}`);
    expect(panel).toBeTruthy();
    expect(panel.getAttribute('aria-labelledby')).toBe(trigger.id);
  });

  it('collapses an open FAQ when clicked again', () => {
    faqTriggers()[0].click();
    fixture.detectChanges();
    faqTriggers()[0].click();
    fixture.detectChanges();

    expect(faqTriggers()[0].getAttribute('aria-expanded')).toBe('false');
  });

  it('keeps only one FAQ open at a time', () => {
    faqTriggers()[0].click();
    fixture.detectChanges();
    faqTriggers()[1].click();
    fixture.detectChanges();

    expect(faqTriggers()[0].getAttribute('aria-expanded')).toBe('false');
    expect(faqTriggers()[1].getAttribute('aria-expanded')).toBe('true');
    expect(fixture.nativeElement.querySelectorAll('.faq__panel').length).toBe(1);
  });

  it('lists the service areas', () => {
    expect(fixture.nativeElement.textContent).toContain('Portland, OR');
    expect(fixture.nativeElement.textContent).toContain('Vancouver, WA');
  });
});
