import { describe, expect, it, vi } from 'vitest';

import TicketBaiWsHttpClient from '../../src/client/ticketbaiws-http-client.js';
import TicketBaiWsHttpError from '../../src/errors/ticketbaiws-http-error.js';

interface RetryAfterTestCase {
  readonly description: string;
  readonly status: number;
  readonly statusText: string;
  readonly retryAfter: string | null;
}

const testCases: readonly RetryAfterTestCase[] = [
  {
    description: '429 with a delay in seconds',
    status: 429,
    statusText: 'Too Many Requests',
    retryAfter: '30',
  },
  {
    description: '429 with zero seconds',
    status: 429,
    statusText: 'Too Many Requests',
    retryAfter: '0',
  },
  {
    description: '429 without Retry-After',
    status: 429,
    statusText: 'Too Many Requests',
    retryAfter: null,
  },
  {
    description: '503 with an HTTP date',
    status: 503,
    statusText: 'Service Unavailable',
    retryAfter: 'Wed, 21 Oct 2037 07:28:00 GMT',
  },
  {
    description: '401 without Retry-After',
    status: 401,
    statusText: 'Unauthorized',
    retryAfter: null,
  },
];

describe('TicketBaiWS Retry-After handling', (): void => {
  it.each(testCases)(
    'preserves Retry-After for $description',
    async ({
      status,
      statusText,
      retryAfter,
    }: RetryAfterTestCase): Promise<void> => {
      const responseBody = 'HTTP error';

      const headers: Headers = new Headers();

      if (retryAfter !== null) {
        headers.set('Retry-After', retryAfter);
      }

      const response = new Response(responseBody, {
        status,
        statusText,
        headers,
      });

      const fetchImplementation = vi
        .fn<typeof globalThis.fetch>()
        .mockResolvedValue(response);

      const client = new TicketBaiWsHttpClient(
        'https://api-test.ticketbaiws.eus/',
        'test-token',
        '00000014Z',
        fetchImplementation,
      );

      try {
        await client.request('GET', 'status/');

        expect.unreachable();
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(TicketBaiWsHttpError);

        if (error instanceof TicketBaiWsHttpError) {
          expect(error.status).toBe(status);
          expect(error.statusText).toBe(statusText);
          expect(error.responseBody).toBe(responseBody);
          expect(error.retryAfter).toBe(retryAfter);
        }
      }

      // The SDK must not automatically retry the request.
      expect(fetchImplementation).toHaveBeenCalledOnce();
    },
  );

  it('reads Retry-After case-insensitively', async (): Promise<void> => {
    const fetchImplementation = vi
      .fn<typeof globalThis.fetch>()
      .mockResolvedValue(
        new Response('Rate limit exceeded', {
          status: 429,
          headers: {
            'retry-after': '45',
          },
        }),
      );

    const client = new TicketBaiWsHttpClient(
      'https://api-test.ticketbaiws.eus/',
      'test-token',
      '00000014Z',
      fetchImplementation,
    );

    try {
      await client.request('GET', 'status/');

      expect.unreachable();
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(TicketBaiWsHttpError);

      if (error instanceof TicketBaiWsHttpError) {
        expect(error.retryAfter).toBe('45');
      }
    }

    expect(fetchImplementation).toHaveBeenCalledOnce();
  });

  it('keeps the existing three-argument constructor compatible', (): void => {
    const error = new TicketBaiWsHttpError(
      429,
      'Too Many Requests',
      'Rate limit exceeded',
    );

    expect(error.status).toBe(429);
    expect(error.statusText).toBe('Too Many Requests');
    expect(error.responseBody).toBe('Rate limit exceeded');
    expect(error.retryAfter).toBeNull();
    expect(error.message).toBe(
      'TicketBaiWS HTTP request failed with status 429 Too Many Requests.',
    );
  });
});
