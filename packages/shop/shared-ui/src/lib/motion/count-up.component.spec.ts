import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CountUpComponent } from './count-up.component';

describe('CountUpComponent', () => {
  let fixture: ComponentFixture<CountUpComponent>;

  async function create(inputs: Record<string, unknown>) {
    await TestBed.configureTestingModule({ imports: [CountUpComponent] }).compileComponents();
    fixture = TestBed.createComponent(CountUpComponent);
    for (const [key, value] of Object.entries(inputs)) {
      fixture.componentRef.setInput(key, value);
    }
    fixture.detectChanges();
  }

  it('renders the final value immediately so it is never missing', async () => {
    await create({ value: 412 });

    expect(fixture.nativeElement.textContent.trim()).toBe('412');
  });

  it('groups thousands by default', async () => {
    await create({ value: 12000 });

    expect(fixture.nativeElement.textContent.trim()).toBe('12,000');
  });

  it('can render without grouping', async () => {
    await create({ value: 12000, grouped: false });

    expect(fixture.nativeElement.textContent.trim()).toBe('12000');
  });

  it('applies a prefix and suffix', async () => {
    await create({ value: 70, suffix: '%' });

    expect(fixture.nativeElement.textContent.trim()).toBe('70%');
  });

  it('announces the final figure rather than intermediate ticks', async () => {
    await create({ value: 9, suffix: ' days' });

    expect(fixture.nativeElement.getAttribute('aria-label')).toBe('9 days');
  });
});
