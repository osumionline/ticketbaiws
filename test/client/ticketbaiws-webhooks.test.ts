import { describe, expect, it, vi } from 'vitest';
import TicketBaiWsClient from '../../src/client/ticketbaiws-client.js';

describe('TicketBaiWsClient webhooks', (): void => {
  it('creates a webhook', async (): Promise<void> => {
    const request = {
      url: 'https://example.com/webhook',
      secret: 'test-secret',
      solo_errores: true,
      activo: true,
    };

    const apiResponse = {
      result: 'OK',
      return: {
        codigo: '6904a3501874e',
        url: 'https://example.com/webhook',
        entorno: 'test',
        secret: 'test-secret',
        solo_errores: true,
        activo: true,
        fecha_creado: '2025-10-31T12:53:52+01:00',
        fecha_modificado: '2025-11-03T10:16:15+01:00',
      },
      msg: '',
    };

    const fetchImplementation = vi
      .fn<typeof globalThis.fetch>()
      .mockResolvedValue(
        new Response(JSON.stringify(apiResponse), {
          status: 200,
        }),
      );

    const client = new TicketBaiWsClient({
      token: 'test-token',
      issuerNif: '00000014Z',
      environment: 'test',
      fetch: fetchImplementation,
    });

    const result = await client.webhooks.create(request);

    expect(result).toEqual(apiResponse);

    const [input, init] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe('https://api-test.ticketbaiws.eus/webhooks/');

    expect(init?.method).toBe('POST');

    expect(init?.body).toBe(JSON.stringify(request));
  });

  it('updates a webhook', async (): Promise<void> => {
    const request = {
      url: 'https://example.com/new-webhook',
      secret: 'new-secret',
      solo_errores: false,
      activo: true,
    };

    const apiResponse = {
      result: 'OK',
      return: {
        codigo: '6904a3501874e',
        url: 'https://example.com/new-webhook',
        entorno: 'test',
        secret: 'new-secret',
        solo_errores: false,
        activo: true,
        fecha_creado: '2025-10-31T12:53:52+01:00',
        fecha_modificado: '2025-11-03T10:16:15+01:00',
      },
      msg: '',
    };

    const fetchImplementation = vi
      .fn<typeof globalThis.fetch>()
      .mockResolvedValue(
        new Response(JSON.stringify(apiResponse), {
          status: 200,
        }),
      );

    const client = new TicketBaiWsClient({
      token: 'test-token',
      issuerNif: '00000014Z',
      environment: 'test',
      fetch: fetchImplementation,
    });

    const result = await client.webhooks.update('6904a3501874e', request);

    expect(result).toEqual(apiResponse);

    const [input, init] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe(
      'https://api-test.ticketbaiws.eus/webhooks/6904a3501874e/',
    );

    expect(init?.method).toBe('PUT');

    expect(init?.body).toBe(JSON.stringify(request));
  });

  it('gets a webhook by code', async (): Promise<void> => {
    const apiResponse = {
      result: 'OK',
      return: [
        {
          codigo: '6904a3501884e',
          url: 'https://example.com/webhook',
          entorno: 'test',
          secret: 'test-secret',
          solo_errores: true,
          activo: true,
          fecha_creado: '2025-10-31T12:53:52+01:00',
          fecha_modificado: '2025-11-03T10:16:15+01:00',
          nif: 'B12346789',
        },
      ],
      msg: '',
    };

    const fetchImplementation = vi
      .fn<typeof globalThis.fetch>()
      .mockResolvedValue(
        new Response(JSON.stringify(apiResponse), {
          status: 200,
        }),
      );

    const client = new TicketBaiWsClient({
      token: 'test-token',
      issuerNif: '00000014Z',
      environment: 'test',
      fetch: fetchImplementation,
    });

    const result = await client.webhooks.get('6904a3501884e');

    expect(result).toEqual(apiResponse);

    const [input, init] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe(
      'https://api-test.ticketbaiws.eus/webhooks/6904a3501884e/',
    );

    expect(init?.method).toBe('GET');
    expect(init?.body).toBeUndefined();
  });

  it('lists webhooks using filters', async (): Promise<void> => {
    const apiResponse = {
      result: 'OK',
      return: [
        {
          codigo: '6904a3501884e',
          url: 'https://example.com/webhook',
          entorno: 'test',
          secret: 'test-secret',
          solo_errores: true,
          activo: true,
          fecha_creado: '2025-10-31T12:53:52+01:00',
          fecha_modificado: '2025-11-03T10:16:15+01:00',
          nif: 'B12346789',
        },
      ],
      msg: '',
    };

    const fetchImplementation = vi
      .fn<typeof globalThis.fetch>()
      .mockResolvedValue(
        new Response(JSON.stringify(apiResponse), {
          status: 200,
        }),
      );

    const client = new TicketBaiWsClient({
      token: 'test-token',
      issuerNif: '00000014Z',
      environment: 'test',
      fetch: fetchImplementation,
    });

    const result = await client.webhooks.list({
      solo_errores: true,
      activo: true,
    });

    expect(result).toEqual(apiResponse);

    const [input, init] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe(
      'https://api-test.ticketbaiws.eus/webhooks/?solo_errores=true&activo=true',
    );

    expect(init?.method).toBe('GET');
    expect(init?.body).toBeUndefined();
  });

  it('lists all webhooks without filters', async (): Promise<void> => {
    const fetchImplementation = vi
      .fn<typeof globalThis.fetch>()
      .mockResolvedValue(
        new Response(
          JSON.stringify({
            result: 'OK',
            return: [],
            msg: '',
          }),
          {
            status: 200,
          },
        ),
      );

    const client = new TicketBaiWsClient({
      token: 'test-token',
      issuerNif: '00000014Z',
      environment: 'test',
      fetch: fetchImplementation,
    });

    await client.webhooks.list();

    const [input] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe('https://api-test.ticketbaiws.eus/webhooks/');
  });
});
