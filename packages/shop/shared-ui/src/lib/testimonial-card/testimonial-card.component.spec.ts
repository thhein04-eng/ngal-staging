import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Testimonial } from '@org/models';
import { TestimonialCardComponent } from './testimonial-card.component';

const TESTIMONIAL: Testimonial = {
  id: 't1',
  quote: 'The only stager my sellers thank me for.',
  author: 'Deborah Ellsworth',
  role: 'Principal Broker',
  company: 'Ellsworth & Vance Realty',
  rating: 4,
};

describe('TestimonialCardComponent', () => {
  let fixture: ComponentFixture<TestimonialCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestimonialCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestimonialCardComponent);
    fixture.componentRef.setInput('testimonial', TESTIMONIAL);
    fixture.detectChanges();
  });

  it('renders the quote and attribution', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('The only stager my sellers thank me for.');
    expect(text).toContain('Deborah Ellsworth');
    expect(text).toContain('Principal Broker');
  });

  it('renders five stars with the rated ones filled', () => {
    const stars = fixture.nativeElement.querySelectorAll('.stars span');
    const filled = fixture.nativeElement.querySelectorAll('.stars__on');

    expect(stars.length).toBe(5);
    expect(filled.length).toBe(4);
  });

  it('exposes the rating as text rather than only stars', () => {
    expect(fixture.nativeElement.querySelector('.visually-hidden').textContent).toBe(
      'Rated 4 out of 5'
    );
  });

  it('hides the decorative stars from assistive technology', () => {
    expect(
      fixture.nativeElement.querySelector('.stars').getAttribute('aria-hidden')
    ).toBe('true');
  });

  it('uses a blockquote for the quote', () => {
    expect(fixture.nativeElement.querySelector('blockquote')).toBeTruthy();
  });
});
