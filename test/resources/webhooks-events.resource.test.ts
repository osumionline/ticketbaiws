import { describe, expect, it, vi } from 'vitest';

import TicketBaiWsHttpClient from '../../src/client/ticketbaiws-http-client.js';

import type {
  TicketBaiWsWebhook,
  TicketBaiWsWebhookEvent,
  TicketBaiWsWebhookRequest,
} from '../../src/index.js';

import TicketBaiWsWebhooksResource from '../../src/resources/webhooks.resource.js';

const allEvents: readonly TicketBaiWsWebhookEvent[] = [
  'cambio_estado',
  'spfe_envio',
  'spfe_estado',
  'spfe_recibida',
];

const baseRequest: TicketBaiWsWebhookRequest = {
  url: 'https://example.com/webhook',
  secret: 'mock-secret',
  solo_errores: false,
  activo: true,
};

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
  eventos: allEvents,
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

function expectRequest(
  fetchImplementation: ReturnType<typeof vi.fn<typeof globalThis.fetch>>,
  method: string,
  path: string,
  request: TicketBaiWsWebhookRequest,
): void {
  expect(fetchImplementation).toHaveBeenCalledOnce();

  const [input, init] = fetchImplementation.mock.calls[0] ?? [];

  expect(input).toBe(`https://api-test.ticketbaiws.eus/${path}`);

  expect(init?.method).toBe(method);
  expect(init?.body).toBe(JSON.stringify(request));

  const headers = new Headers(init?.headers);

  expect(headers.get('Content-Type')).toBe('application/json');
}

describe('TicketBaiWS webhook event subscriptions', (): void => {
  it('creates a webhook subscribed to all supported events', async (): Promise<void> => {
    const request: TicketBaiWsWebhookRequest = {
      ...baseRequest,
      eventos: allEvents,
    };

    const { resource, fetchImplementation } = createResource(webhook);

    const response = await resource.create(request);

    expectRequest(fetchImplementation, 'POST', 'webhooks/', request);

    expect(response.return.eventos).toEqual(allEvents);
  });

  it('updates the subscribed events', async (): Promise<void> => {
    const events: readonly TicketBaiWsWebhookEvent[] = [
      'spfe_envio',
      'spfe_estado',
    ];

    const request: TicketBaiWsWebhookRequest = {
      ...baseRequest,
      eventos: events,
    };

    const updatedWebhook: TicketBaiWsWebhook = {
      ...webhook,
      eventos: events,
    };

    const { resource, fetchImplementation } = createResource(updatedWebhook);

    const response = await resource.update('hook-01', request);

    expectRequest(fetchImplementation, 'PUT', 'webhooks/hook-01/', request);

    expect(response.return.eventos).toEqual(events);
  });

  it('does not add default events when creating a webhook', async (): Promise<void> => {
    const { resource, fetchImplementation } = createResource(webhook);

    await resource.create(baseRequest);

    expectRequest(fetchImplementation, 'POST', 'webhooks/', baseRequest);

    const [, init] = fetchImplementation.mock.calls[0] ?? [];

    if (typeof init?.body !== 'string') {
      throw new Error('Expected a JSON request body.');
    }

    const body = JSON.parse(init.body) as Record<string, unknown>;

    expect(body).not.toHaveProperty('eventos');
  });

  it('does not change subscriptions when events are omitted from an update', async (): Promise<void> => {
    const request: TicketBaiWsWebhookRequest = {
      ...baseRequest,
      activo: false,
    };

    const { resource, fetchImplementation } = createResource(webhook);

    await resource.update('hook-01', request);

    expectRequest(fetchImplementation, 'PUT', 'webhooks/hook-01/', request);

    const [, init] = fetchImplementation.mock.calls[0] ?? [];

    if (typeof init?.body !== 'string') {
      throw new Error('Expected a JSON request body.');
    }

    const body = JSON.parse(init.body) as Record<string, unknown>;

    expect(body).not.toHaveProperty('eventos');
    expect(body['activo']).toBe(false);
  });

  it('exposes subscribed events in an individual webhook', async (): Promise<void> => {
    const { resource, fetchImplementation } = createResource(webhook);

    const response = await resource.get('hook-01');

    expect(response.return.codigo).toBe('hook-01');
    expect(response.return.eventos).toEqual(allEvents);

    expect(fetchImplementation).toHaveBeenCalledOnce();
  });

  it('exposes subscribed events when listing webhooks', async (): Promise<void> => {
    const { resource, fetchImplementation } = createResource([webhook]);

    const response = await resource.list();

    expect(response.return).toHaveLength(1);
    expect(response.return[0]?.eventos).toEqual(allEvents);

    expect(fetchImplementation).toHaveBeenCalledOnce();
  });

  it('supports older responses without the events property', async (): Promise<void> => {
    const webhookWithoutEvents: TicketBaiWsWebhook = {
      codigo: 'hook-02',
      url: 'https://example.com/legacy-webhook',
      entorno: 'test',
      secret: 'mock-secret',
      solo_errores: false,
      activo: true,
      fecha_creado: '2026-11-26T12:00:00+01:00',
      fecha_modificado: '2026-11-26T12:00:00+01:00',
    };

    const { resource } = createResource(webhookWithoutEvents);

    const response = await resource.get('hook-02');

    expect(response.return.codigo).toBe('hook-02');
    expect(response.return.eventos).toBeUndefined();
  });
});
