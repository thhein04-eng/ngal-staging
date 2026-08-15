import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormField,
  email,
  form,
  max,
  maxLength,
  min,
  minLength,
  required,
  requiredError,
  submit,
  validate,
} from '@angular/forms/signals';
import {
  ProjectTimeline,
  PropertyType,
  QuoteRequest,
  QuoteRequestResult,
  ServiceTier,
} from '@org/models';
import { QuoteRequestService, StagingContentService } from '@org/shop/data';
import { SectionHeadingComponent } from '@org/shop/shared-ui';

const SERVICE_TIERS: readonly ServiceTier[] = [
  'consultation',
  'occupied',
  'vacant',
  'luxury',
];

function emptyRequest(): QuoteRequest {
  return {
    name: '',
    email: '',
    phone: '',
    propertyAddress: '',
    propertyType: 'single-family',
    service: 'occupied',
    squareFeet: null,
    timeline: 'two-weeks',
    message: '',
    consent: false,
  };
}

@Component({
  selector: 'shop-contact-page',
  imports: [FormField, SectionHeadingComponent],
  templateUrl: './contact-page.component.html',
  styleUrl: './contact-page.component.css',
})
export class ContactPageComponent {
  private readonly content = inject(StagingContentService);
  private readonly quotes = inject(QuoteRequestService);
  private readonly route = inject(ActivatedRoute);

  protected readonly company = this.content.company;
  protected readonly services = this.content.services;

  protected readonly propertyTypes: readonly { value: PropertyType; label: string }[] = [
    { value: 'single-family', label: 'Single family' },
    { value: 'condo', label: 'Condo' },
    { value: 'townhouse', label: 'Townhouse' },
    { value: 'loft', label: 'Loft' },
    { value: 'luxury-estate', label: 'Luxury estate' },
  ];

  protected readonly timelines: readonly { value: ProjectTimeline; label: string }[] = [
    { value: 'asap', label: 'As soon as possible' },
    { value: 'two-weeks', label: 'Within two weeks' },
    { value: 'one-month', label: 'Within a month' },
    { value: 'just-exploring', label: 'Just exploring options' },
  ];

  /** Pre-selects a package when arriving from a service card link. */
  private readonly requestedService = toSignal(this.route.queryParamMap, {
    initialValue: null,
  });

  private readonly model = signal<QuoteRequest>({
    ...emptyRequest(),
    service: this.readServiceParam(),
  });

  protected readonly quoteForm = form(this.model, (path) => {
    required(path.name, { message: 'Please tell us your name.' });
    maxLength(path.name, 80, { message: 'Please keep this under 80 characters.' });

    required(path.email, { message: 'We need an email address to reply to.' });
    email(path.email, { message: 'That does not look like a valid email address.' });

    required(path.phone, { message: 'A phone number helps us schedule the walkthrough.' });
    minLength(path.phone, 7, { message: 'Please enter a complete phone number.' });

    required(path.propertyAddress, {
      message: 'Which property are we quoting?',
    });
    minLength(path.propertyAddress, 6, {
      message: 'Please include the street and city.',
    });

    required(path.squareFeet, { message: 'An approximate size is enough.' });
    min(path.squareFeet, 200, { message: 'That seems too small — please check.' });
    max(path.squareFeet, 25000, { message: 'That seems too large — please check.' });

    maxLength(path.message, 1200, {
      message: 'Please keep this under 1200 characters.',
    });

    validate(path.consent, ({ value }) =>
      value()
        ? null
        : requiredError({
            message: 'Please confirm we can contact you about this request.',
          })
    );
  });

  private readonly submission = signal<QuoteRequestResult | null>(null);
  private readonly failed = signal(false);
  private readonly attempted = signal(false);

  protected readonly result = this.submission.asReadonly();
  protected readonly submitFailed = this.failed.asReadonly();

  protected readonly submitting = computed(() => this.quoteForm().submitting());

  protected readonly messageCount = computed(() => this.model().message.length);

  /** Errors stay hidden until a field is touched or submission is attempted. */
  protected showErrors(touched: boolean, invalid: boolean): boolean {
    return invalid && (touched || this.attempted());
  }

  protected async onSubmit(): Promise<void> {
    this.failed.set(false);
    this.attempted.set(true);

    await submit(this.quoteForm, {
      action: async () => {
        try {
          this.submission.set(await this.quotes.submit(this.model()));
        } catch {
          this.failed.set(true);
        }
        return undefined;
      },
    });
  }

  protected reset(): void {
    this.submission.set(null);
    this.failed.set(false);
    this.model.set(emptyRequest());
  }

  private readServiceParam(): ServiceTier {
    const requested = this.requestedService()?.get('service');
    return SERVICE_TIERS.includes(requested as ServiceTier)
      ? (requested as ServiceTier)
      : 'occupied';
  }

  protected telHref(): string {
    return this.company.phone.replace(/[^\d+]/g, '');
  }
}
