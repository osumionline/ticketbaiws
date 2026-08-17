import { describe, expect, it, vi } from 'vitest';

import TicketBaiWsHttpClient from '../../src/client/ticketbaiws-http-client.js';
import TicketBaiWsInvoicesResource from '../../src/resources/invoices.resource.js';

describe('TicketBaiWsInvoicesResource list', (): void => {
  it('lists invoices using query parameters', async (): Promise<void> => {
    const apiResponse = {
      result: 'OK',
      return: [
        {
          status: 'OK',
          serie: 'A',
          numero: '2026000123',
          fecha: '01/08/2026',
          fecha_factura: '01/08/2026',
          nif: 'B01000012',
          importe: 132.1,
          zuzendu: false,
        },
        {
          status: 'PENDING',
          serie: 'A',
          numero: '2026000124',
          fecha: '02/08/2026',
          fecha_factura: '02/08/2026',
          nif: 'B01000012',
          importe: 50,
          zuzendu: true,
        },
      ],
      msg: 'Showing 1 to 250 of 292',
      count: '292',
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

    const result = await resource.list({
      fecha_inicio: '01/08/2026',
      fecha_fin: '31/08/2026',
      serie: 'A',
      pagina: 2,
      json_orig: true,
      xml_request: false,
      pedido: true,
    });

    expect(result).toEqual(apiResponse);

    expect(result.count).toBe('292');

    expect(result.return).toHaveLength(2);

    const [input, init] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe(
      'https://api-test.ticketbaiws.eus/tbai-list/?fecha_inicio=01%2F08%2F2026&fecha_fin=31%2F08%2F2026&serie=A&pagina=2&json_orig=true&xml_request=false&pedido=true',
    );

    expect(init?.method).toBe('GET');

    expect(init?.body).toBeUndefined();
  });

  it('omits optional filters when they are not provided', async (): Promise<void> => {
    const apiResponse = {
      result: 'OK',
      return: [],
      msg: 'Showing 0 to 0 of 0',
      count: '0',
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

    await resource.list({
      fecha_inicio: '01/08/2026',
      fecha_fin: '31/08/2026',
    });

    const [input] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe(
      'https://api-test.ticketbaiws.eus/tbai-list/?fecha_inicio=01%2F08%2F2026&fecha_fin=31%2F08%2F2026',
    );
  });
});
