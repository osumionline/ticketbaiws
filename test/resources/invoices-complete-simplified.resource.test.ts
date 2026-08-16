import { describe, expect, it, vi } from 'vitest';
import TicketBaiWsHttpClient from '../../src/client/ticketbaiws-http-client.js';
import type TicketBaiWsCompleteInvoiceRequest from '../../src/model/invoice/ticketbaiws-complete-invoice-request.model.js';
import TicketBaiWsInvoicesResource from '../../src/resources/invoices.resource.js';

describe('TicketBaiWsInvoicesResource completeSimplified', (): void => {
  it('completes simplified invoices', async (): Promise<void> => {
    const invoice: TicketBaiWsCompleteInvoiceRequest = {
      fecha: '17/08/2026',
      hora: '12:14:00',

      nif: 'B00000011',
      pais_cliente: 'ES',
      nombre: 'Empresa de ejemplo S.L.',
      direccion: 'Calle de ejemplo 123',
      cp: '28080',

      serie: 'A',
      numero: '2026000123',

      simplificadas: [
        {
          serie: 'A',
          numero: '2026000075',
          fecha: '16/08/2026',
        },
        {
          serie: 'A',
          numero: '2026000076',
          fecha: '16/08/2026',
        },
      ],

      intracomunitaria: false,
      exportacion: false,
    };

    const apiResponse = {
      result: 'OK',
      return: {
        huella_tbai: 'TBAI-B01000012-example',
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

    const result = await resource.completeSimplified(invoice);

    expect(result).toEqual(apiResponse);

    expect(fetchImplementation).toHaveBeenCalledOnce();

    const [input, init] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe('https://api-test.ticketbaiws.eus/tbai-completar/');

    expect(init?.method).toBe('POST');

    expect(init?.body).toBe(JSON.stringify(invoice));

    const headers = new Headers(init?.headers);

    expect(headers.get('Content-Type')).toBe('application/json');
  });
});
