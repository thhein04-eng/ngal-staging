import { Service } from '@angular/core';
import { QuoteRequest, QuoteRequestResult } from '@org/models';

/**
 * Handles quote request submissions.
 *
 * The marketing site has no backend, so this resolves locally after a short
 * delay to model the round trip. Swap the body of {@link submit} for an HTTP
 * call when a real endpoint exists — the signature is already the right shape.
 */
@Service()
export class QuoteRequestService {
  async submit(request: QuoteRequest): Promise<QuoteRequestResult> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    return {
      reference: this.buildReference(request),
      receivedAt: new Date().toISOString(),
    };
  }

  private buildReference(request: QuoteRequest): string {
    const initials = request.name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('');

    const suffix = Math.floor(Math.random() * 9000 + 1000);

    return `NL-${initials || 'XX'}-${suffix}`;
  }
}
