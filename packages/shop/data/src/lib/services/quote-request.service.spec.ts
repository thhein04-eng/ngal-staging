import { TestBed } from '@angular/core/testing';
import { QuoteRequest } from '@org/models';
import { QuoteRequestService } from './quote-request.service';

function request(overrides: Partial<QuoteRequest> = {}): QuoteRequest {
  return {
    name: 'Rowan Whitfield',
    email: 'rowan@example.com',
    phone: '5035550188',
    propertyAddress: '1420 SE Ash St, Portland',
    propertyType: 'single-family',
    service: 'vacant',
    squareFeet: 1850,
    timeline: 'asap',
    message: '',
    consent: true,
    ...overrides,
  };
}

describe('QuoteRequestService', () => {
  let service: QuoteRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuoteRequestService);
  });

  it('returns a reference built from the requester initials', async () => {
    const result = await service.submit(request());

    expect(result.reference).toMatch(/^NL-RW-\d{4}$/);
  });

  it('uses at most two initials', async () => {
    const result = await service.submit(request({ name: 'Ada Grace Byron King' }));

    expect(result.reference).toMatch(/^NL-AG-\d{4}$/);
  });

  it('falls back when the name has no usable initials', async () => {
    const result = await service.submit(request({ name: '   ' }));

    expect(result.reference).toMatch(/^NL-XX-\d{4}$/);
  });

  it('timestamps the submission as an ISO string', async () => {
    const result = await service.submit(request());

    expect(new Date(result.receivedAt).toISOString()).toBe(result.receivedAt);
  });
});
