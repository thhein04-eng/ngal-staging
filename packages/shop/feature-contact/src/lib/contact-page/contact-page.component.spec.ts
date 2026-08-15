import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ContactPageComponent } from './contact-page.component';

describe('ContactPageComponent', () => {
  let fixture: ComponentFixture<ContactPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactPageComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactPageComponent);
    fixture.detectChanges();
  });

  function field(id: string): HTMLInputElement {
    return fixture.nativeElement.querySelector(`#${id}`);
  }

  function setValue(id: string, value: string): void {
    const input = field(id);
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  function submitButton(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('button[type=submit]');
  }

  async function submitForm(): Promise<void> {
    submitButton().click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  it('renders the quote request form', () => {
    expect(fixture.nativeElement.querySelector('form')).toBeTruthy();
    expect(field('name')).toBeTruthy();
    expect(field('email')).toBeTruthy();
  });

  it('gives every control a label', () => {
    for (const id of ['name', 'email', 'phone', 'address', 'squareFeet', 'consent']) {
      const label = fixture.nativeElement.querySelector(`label[for=${id}]`);
      expect(label).toBeTruthy();
    }
  });

  it('hides errors until the field is touched', () => {
    expect(fixture.nativeElement.querySelector('.error')).toBeNull();
  });

  it('reports required fields after an attempted submit', async () => {
    await submitForm();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Please tell us your name.');
    expect(text).toContain('We need an email address to reply to.');
    expect(text).toContain('Which property are we quoting?');
  });

  it('requires consent before submitting', async () => {
    await submitForm();

    expect(fixture.nativeElement.textContent).toContain(
      'Please confirm we can contact you about this request.'
    );
  });

  it('links each error to its control for assistive technology', async () => {
    await submitForm();

    expect(field('name').getAttribute('aria-invalid')).toBe('true');
    expect(field('name').getAttribute('aria-describedby')).toBe('name-error');
    expect(fixture.nativeElement.querySelector('#name-error')).toBeTruthy();
  });

  it('rejects a malformed email address', async () => {
    setValue('email', 'not-an-email');
    await submitForm();

    expect(fixture.nativeElement.textContent).toContain(
      'That does not look like a valid email address.'
    );
  });

  it('rejects an implausible square footage', async () => {
    setValue('squareFeet', '10');
    await submitForm();

    expect(fixture.nativeElement.textContent).toContain('That seems too small');
  });

  it('does not confirm when the form is invalid', async () => {
    await submitForm();

    expect(fixture.nativeElement.textContent).not.toContain('Request received');
  });

  it('counts the characters typed into the message', () => {
    const textarea = fixture.nativeElement.querySelector('#message') as HTMLTextAreaElement;
    textarea.value = 'Corner lot, needs the dining room addressed.';
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#message-count').textContent).toContain(
      `${textarea.value.length} / 1200`
    );
  });

  it('confirms with a reference once a valid request is sent', async () => {
    setValue('name', 'Rowan Whitfield');
    setValue('email', 'rowan@example.com');
    setValue('phone', '5035550188');
    setValue('address', '1420 SE Ash St, Portland');
    setValue('squareFeet', '1850');

    const consent = field('consent');
    consent.checked = true;
    consent.dispatchEvent(new Event('input'));
    consent.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    await submitForm();
    await new Promise((resolve) => setTimeout(resolve, 700));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Request received');
    expect(fixture.nativeElement.textContent).toMatch(/NL-RW-\d{4}/);
  });
});
