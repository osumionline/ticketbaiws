import { describe, expect, it, vi } from 'vitest';
import TicketBaiWsHttpClient from '../../src/client/ticketbaiws-http-client.js';
import type TicketBaiWsCreateInvoiceRequest from '../../src/model/invoice/ticketbaiws-create-invoice-request.model.js';
import TicketBaiWsInvoicesResource from '../../src/resources/invoices.resource.js';

const invoice: TicketBaiWsCreateInvoiceRequest = {
  fecha: '17/08/2026',
  hora: '12:00:00',
  nif: 'B00000011',
  nombre: 'Empresa de ejemplo S.L.',
  direccion: 'Calle de ejemplo 123',
  cp: '01013',
  serie: 'A',
  numero: '2026000001',
  simplificada: false,
  rectificativa: false,
  retencion: 0,
  lineas: [
    {
      descripcion: 'Producto normal',
      cantidad: 1,
      importe_unitario: 100,
      tipo_iva: 21,
      tipo_req: 0,
    },
  ],
  total_factura: 121,
};

describe('TicketBaiWsInvoicesResource', (): void => {
  it('creates a TicketBAI invoice', async (): Promise<void> => {
    const apiResponse = {
      result: 'OK',
      return: {
        huella_tbai: 'TBAI-B01000012-170826-example',
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

    const result = await resource.create(invoice);

    expect(result).toEqual(apiResponse);

    expect(fetchImplementation).toHaveBeenCalledOnce();

    const [input, init] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe('https://api-test.ticketbaiws.eus/tbai/');

    expect(init?.method).toBe('POST');

    expect(init?.body).toBe(JSON.stringify(invoice));

    const headers = new Headers(init?.headers);

    expect(headers.get('Content-Type')).toBe('application/json');
  });

  it('creates a Verifactu invoice', async (): Promise<void> => {
    const apiResponse = {
      result: 'OK',
      return: {
        huella: '8FA696A615A750A9EC04A273013F05EB',
        qr: 'base64-qr',
        url: 'https://example.com/verifactu',
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

    const result = await resource.create(invoice);

    expect(result).toEqual(apiResponse);

    expect(result.return).toEqual({
      huella: '8FA696A615A750A9EC04A273013F05EB',
      qr: 'base64-qr',
      url: 'https://example.com/verifactu',
    });
  });
});
