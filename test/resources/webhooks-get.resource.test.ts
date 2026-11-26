import { describe, expect, it, vi } from 'vitest';

import TicketBaiWsHttpClient from '../../src/client/ticketbaiws-http-client.js';
import type {
  TicketBaiWsGetWebhookResponse,
  TicketBaiWsGetWebhookResult,
  TicketBaiWsWebhook,
} from '../../src/index.js';
import TicketBaiWsWebhooksResource from '../../src/resources/webhooks.resource.js';

const webhook: TicketBaiWsWebhook = {
  codigo: 'hook-01',
  url: 'https://example.com/webhook',
  entorno: 'test',
  secret: 'mock-secret',
  solo_errores: false,
  activo: true,
  fecha_creado: '2026-11-26T12:00:00+01:00',
  fecha_modificado: '2026-11-26T12:00:00+01:00',
  nif: 'B01000012',
};

function createResource(returnData: unknown): {
  readonly resource: TicketBaiWsWebhooksResource;
  readonly fetchImplementation: ReturnType<
    typeof vi.fn<typeof globalThis.fetch>
  >;
} {
  const fetchImplementation = vi
    .fn<typeof globalThis.fetch>()
    .mockResolvedValue(
      new Response(
        JSON.stringify({
          result: 'OK',
          return: returnData,
          msg: null,
        }),
        {
          status: 200,
        },
      ),
    );

  const httpClient = new TicketBaiWsHttpClient(
    'https://api-test.ticketbaiws.eus/',
    'mock-token',
    '00000014Z',
    fetchImplementation,
  );

  return {
    resource: new TicketBaiWsWebhooksResource(httpClient),
    fetchImplementation,
  };
}

describe('TicketBaiWS individual webhook consultation', (): void => {
  it('returns a single webhook object', async (): Promise<void> => {
    const { resource, fetchImplementation } = createResource(webhook);

    const response: TicketBaiWsGetWebhookResponse =
      await resource.get('hook-01');

    const result: TicketBaiWsGetWebhookResult = response.return;

    expect(response.result).toBe('OK');
    expect(result).toEqual(webhook);
    expect(result.codigo).toBe('hook-01');
    expect(Array.isArray(result)).toBe(false);

    expect(fetchImplementation).toHaveBeenCalledOnce();

    const [input, init] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe('https://api-test.ticketbaiws.eus/webhooks/hook-01/');
    expect(init?.method).toBe('GET');
  });

  it('encodes the webhook code as a URL path segment', async (): Promise<void> => {
    const { resource, fetchImplementation } = createResource(webhook);

    await resource.get('hook/01');

    const [input] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe('https://api-test.ticketbaiws.eus/webhooks/hook%2F01/');
  });

  it('keeps the webhook list response as an array', async (): Promise<void> => {
    const { resource, fetchImplementation } = createResource([webhook]);

    const response = await resource.list();

    expect(response.return).toEqual([webhook]);
    expect(response.return).toHaveLength(1);

    const [input, init] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe('https://api-test.ticketbaiws.eus/webhooks/');
    expect(init?.method).toBe('GET');
  });
});
