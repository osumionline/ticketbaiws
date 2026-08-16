import { describe, expect, it, vi } from 'vitest';

import TicketBaiWsClient from '../../src/client/ticketbaiws-client.js';
import type TicketBaiWsCreateInvoiceRequest from '../../src/model/invoice/ticketbaiws-create-invoice-request.model.js';

describe('TicketBaiWsClient invoices', (): void => {
  it('creates an invoice through the public client API', async (): Promise<void> => {
    const invoice: TicketBaiWsCreateInvoiceRequest = {
      fecha: '17/08/2026',
      hora: '12:00:00',
      serie: 'A',
      numero: '1',
      simplificada: true,
      rectificativa: false,
      retencion: 0,
      lineas: [
        {
          descripcion: 'Producto',
          cantidad: 1,
          importe_unitario: 10,
          tipo_iva: 21,
          tipo_req: 0,
        },
      ],
      total_factura: 12.1,
    };

    const apiResponse = {
      result: 'OK',
      return: {
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

    const client = new TicketBaiWsClient({
      token: 'test-token',
      issuerNif: '00000014Z',
      environment: 'test',
      fetch: fetchImplementation,
    });

    const result = await client.invoices.create(invoice);

    expect(result).toEqual(apiResponse);

    expect(fetchImplementation).toHaveBeenCalledOnce();

    const [input, init] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe('https://api-test.ticketbaiws.eus/tbai/');

    expect(init?.body).toBe(JSON.stringify(invoice));
  });
});
