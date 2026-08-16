import { describe, expect, it, vi } from 'vitest';
import TicketBaiWsHttpClient from '../../src/client/ticketbaiws-http-client.js';
import TicketBaiWsInvoicesResource from '../../src/resources/invoices.resource.js';

describe('TicketBaiWsInvoicesResource lifecycle', (): void => {
  it('gets an invoice', async (): Promise<void> => {
    const apiResponse = {
      result: 'OK',
      return: {
        status: 'OK',
        huella_tbai: 'TBAI-example',
        qr: 'base64-qr',
        url: 'https://example.com/ticketbai',
      },
      msg: null,
    };

    const fetchImplementation = vi
      .fn<typeof globalThis.fetch>()
      .mockResolvedValue(
        new Response(JSON.stringify(apiResponse), {
          status: 200,
        }),
      );

    const httpClient = new TicketBaiWsHttpClient(
      'https://api-test.ticketbaiws.eus/',
      'test-token',
      '00000014Z',
      fetchImplementation,
    );

    const resource = new TicketBaiWsInvoicesResource(httpClient);

    const result = await resource.get({
      serie: 'A',
      numero: '2026000001',
    });

    expect(result).toEqual(apiResponse);

    const [input, init] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe(
      'https://api-test.ticketbaiws.eus/tbai/?serie=A&numero=2026000001',
    );

    expect(init?.method).toBe('GET');
    expect(init?.body).toBeUndefined();
  });

  it('cancels an invoice', async (): Promise<void> => {
    const apiResponse = {
      result: 'OK',
      return: {},
      msg: 'TicketBAI anulado',
    };

    const fetchImplementation = vi
      .fn<typeof globalThis.fetch>()
      .mockResolvedValue(
        new Response(JSON.stringify(apiResponse), {
          status: 200,
        }),
      );

    const httpClient = new TicketBaiWsHttpClient(
      'https://api-test.ticketbaiws.eus/',
      'test-token',
      '00000014Z',
      fetchImplementation,
    );

    const resource = new TicketBaiWsInvoicesResource(httpClient);

    const invoice = {
      serie: 'A',
      numero: '2026000001',
      fecha: '17/08/2026',
    };

    const result = await resource.cancel(invoice);

    expect(result).toEqual(apiResponse);

    const [input, init] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe('https://api-test.ticketbaiws.eus/tbai/');

    expect(init?.method).toBe('DELETE');

    expect(init?.body).toBe(JSON.stringify(invoice));
  });

  it('cancels an invoice without an explicit date', async (): Promise<void> => {
    const apiResponse = {
      result: 'OK',
      return: {},
      msg: 'TicketBAI anulado',
    };

    const fetchImplementation = vi
      .fn<typeof globalThis.fetch>()
      .mockResolvedValue(
        new Response(JSON.stringify(apiResponse), {
          status: 200,
        }),
      );

    const httpClient = new TicketBaiWsHttpClient(
      'https://api-test.ticketbaiws.eus/',
      'test-token',
      '00000014Z',
      fetchImplementation,
    );

    const resource = new TicketBaiWsInvoicesResource(httpClient);

    const invoice = {
      serie: 'A',
      numero: '2026000001',
    };

    await resource.cancel(invoice);

    const [, init] = fetchImplementation.mock.calls[0] ?? [];

    expect(init?.body).toBe(JSON.stringify(invoice));
  });

  it('resends an invoice', async (): Promise<void> => {
    const apiResponse = {
      result: 'OK',
      return: {},
      msg: 'Status changed to PENDING',
    };

    const fetchImplementation = vi
      .fn<typeof globalThis.fetch>()
      .mockResolvedValue(
        new Response(JSON.stringify(apiResponse), {
          status: 200,
        }),
      );

    const httpClient = new TicketBaiWsHttpClient(
      'https://api-test.ticketbaiws.eus/',
      'test-token',
      '00000014Z',
      fetchImplementation,
    );

    const resource = new TicketBaiWsInvoicesResource(httpClient);

    const invoice = {
      serie: 'A',
      numero: '2026000001',
    };

    const result = await resource.resend(invoice);

    expect(result).toEqual(apiResponse);

    const [input, init] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe('https://api-test.ticketbaiws.eus/reset-tbai/');

    expect(init?.method).toBe('PUT');

    expect(init?.body).toBe(JSON.stringify(invoice));
  });
});
