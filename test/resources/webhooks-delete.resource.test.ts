import { describe, expect, it, vi } from 'vitest';

import TicketBaiWsHttpClient from '../../src/client/ticketbaiws-http-client.js';
import TicketBaiWsApiError from '../../src/errors/ticketbaiws-api-error.js';
import TicketBaiWsHttpError from '../../src/errors/ticketbaiws-http-error.js';

import type { TicketBaiWsDeleteWebhookResponse } from '../../src/index.js';

import TicketBaiWsWebhooksResource from '../../src/resources/webhooks.resource.js';

function createResource(response: Response): {
  readonly resource: TicketBaiWsWebhooksResource;
  readonly fetchImplementation: ReturnType<
    typeof vi.fn<typeof globalThis.fetch>
  >;
} {
  const fetchImplementation = vi
    .fn<typeof globalThis.fetch>()
    .mockResolvedValue(response);

  const httpClient = new TicketBaiWsHttpClient(
    'https://api-test.ticketbaiws.eus/',
    'test-token',
    '00000014Z',
    fetchImplementation,
  );

  return {
    resource: new TicketBaiWsWebhooksResource(httpClient),
    fetchImplementation,
  };
}

function createApiResponse(
  result: 'OK' | 'ERROR',
  returnValue: unknown,
  msg: string | null,
): Response {
  return new Response(
    JSON.stringify({
      result,
      return: returnValue,
      msg,
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}

describe('TicketBaiWS webhook deletion', (): void => {
  it('deletes a webhook and returns the API response', async (): Promise<void> => {
    const { resource, fetchImplementation } = createResource(
      createApiResponse('OK', [], null),
    );

    const response: TicketBaiWsDeleteWebhookResponse =
      await resource.delete('hook-01');

    expect(response).toEqual({
      result: 'OK',
      return: [],
      msg: null,
    });

    expect(fetchImplementation).toHaveBeenCalledOnce();

    const [input, init] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe('https://api-test.ticketbaiws.eus/webhooks/hook-01/');

    expect(init?.method).toBe('DELETE');
    expect(init?.body).toBeUndefined();

    const headers = new Headers(init?.headers);

    expect(headers.get('Accept')).toBe('application/json');
    expect(headers.get('Token')).toBe('test-token');
    expect(headers.get('Nif')).toBe('00000014Z');
    expect(headers.has('Content-Type')).toBe(false);
  });

  it('encodes special characters in the webhook code', async (): Promise<void> => {
    const { resource, fetchImplementation } = createResource(
      createApiResponse('OK', [], null),
    );

    await resource.delete('hook/01');

    expect(fetchImplementation).toHaveBeenCalledOnce();

    const [input, init] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe('https://api-test.ticketbaiws.eus/webhooks/hook%2F01/');

    expect(init?.method).toBe('DELETE');
  });

  it('throws an API error when deletion is rejected', async (): Promise<void> => {
    const apiResponse = {
      result: 'ERROR',
      return: null,
      msg: 'Webhook not found',
    };

    const { resource, fetchImplementation } = createResource(
      createApiResponse('ERROR', apiResponse.return, apiResponse.msg),
    );

    try {
      await resource.delete('missing-hook');

      expect.unreachable();
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(TicketBaiWsApiError);

      if (error instanceof TicketBaiWsApiError) {
        expect(error.message).toBe('Webhook not found');
        expect(error.apiResponse).toEqual(apiResponse);
      }
    }

    expect(fetchImplementation).toHaveBeenCalledOnce();
  });

  it('preserves HTTP errors from the transport', async (): Promise<void> => {
    const { resource, fetchImplementation } = createResource(
      new Response('Not Found', {
        status: 404,
        statusText: 'Not Found',
      }),
    );

    await expect(resource.delete('missing-hook')).rejects.toMatchObject({
      status: 404,
      statusText: 'Not Found',
      responseBody: 'Not Found',
    });

    try {
      await createResource(
        new Response('Not Found', {
          status: 404,
        }),
      ).resource.delete('missing-hook');

      expect.unreachable();
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(TicketBaiWsHttpError);
    }

    expect(fetchImplementation).toHaveBeenCalledOnce();
  });
});
