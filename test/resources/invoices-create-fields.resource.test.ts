import { describe, expect, it, vi } from 'vitest';

import TicketBaiWsHttpClient from '../../src/client/ticketbaiws-http-client.js';
import type TicketBaiWsCreateInvoiceRequest from '../../src/model/invoice/ticketbaiws-create-invoice-request.model.js';
import TicketBaiWsInvoicesResource from '../../src/resources/invoices.resource.js';

const baseInvoice: TicketBaiWsCreateInvoiceRequest = {
  fecha: '26/11/2026',
  hora: '12:00:00',
  nif: 'B01000012',
  nombre: 'Empresa de ejemplo S.L.',
  simplificada: false,
  serie: 'A',
  numero: '2026000123',
  rectificativa: false,
  retencion: 0,
  lineas: [
    {
      descripcion: 'Servicio de ejemplo',
      cantidad: 1,
      importe_unitario: 100,
      tipo_iva: 21,
      tipo_req: 0,
    },
  ],
  total_factura: 121,
};

function createResource(): {
  readonly resource: TicketBaiWsInvoicesResource;
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
          return: {
            huella_tbai: 'TBAI-TEST',
            qr: 'base64-qr',
            url: 'https://example.com/ticketbai',
          },
          msg: null,
        }),
        {
          status: 200,
        },
      ),
    );

  const httpClient = new TicketBaiWsHttpClient(
    'https://api-test.ticketbaiws.eus/',
    'test-token',
    '00000014Z',
    fetchImplementation,
  );

  return {
    resource: new TicketBaiWsInvoicesResource(httpClient),
    fetchImplementation,
  };
}

describe('TicketBaiWS invoice creation fields', (): void => {
  it('serializes customer location and IRPF fields', async (): Promise<void> => {
    const invoice: TicketBaiWsCreateInvoiceRequest = {
      ...baseInvoice,
      poblacion: 'Vitoria-Gasteiz',
      provincia: 'Álava',
      causa_ingreso_irpf: '01',
      importe_ingreso_irpf: 80,
    };

    const { resource, fetchImplementation } = createResource();

    await resource.create(invoice);

    expect(fetchImplementation).toHaveBeenCalledOnce();

    const [input, init] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe('https://api-test.ticketbaiws.eus/tbai/');
    expect(init?.method).toBe('POST');

    const headers = new Headers(init?.headers);

    expect(headers.get('Content-Type')).toBe('application/json');

    if (typeof init?.body !== 'string') {
      throw new Error('Expected a JSON request body.');
    }

    const body = JSON.parse(init.body) as Record<string, unknown>;

    expect(body).toEqual(invoice);

    expect(body['poblacion']).toBe('Vitoria-Gasteiz');
    expect(body['provincia']).toBe('Álava');
    expect(body['causa_ingreso_irpf']).toBe('01');
    expect(body['importe_ingreso_irpf']).toBe(80);
  });

  it('does not add new optional fields when omitted', async (): Promise<void> => {
    const { resource, fetchImplementation } = createResource();

    await resource.create(baseInvoice);

    const [, init] = fetchImplementation.mock.calls[0] ?? [];

    if (typeof init?.body !== 'string') {
      throw new Error('Expected a JSON request body.');
    }

    const body = JSON.parse(init.body) as Record<string, unknown>;

    expect(body).toEqual(baseInvoice);

    expect(body).not.toHaveProperty('poblacion');
    expect(body).not.toHaveProperty('provincia');
    expect(body).not.toHaveProperty('causa_ingreso_irpf');
    expect(body).not.toHaveProperty('importe_ingreso_irpf');
  });

  it('preserves a zero IRPF income amount', async (): Promise<void> => {
    const invoice: TicketBaiWsCreateInvoiceRequest = {
      ...baseInvoice,
      causa_ingreso_irpf: '01',
      importe_ingreso_irpf: 0,
    };

    const { resource, fetchImplementation } = createResource();

    await resource.create(invoice);

    const [, init] = fetchImplementation.mock.calls[0] ?? [];

    if (typeof init?.body !== 'string') {
      throw new Error('Expected a JSON request body.');
    }

    const body = JSON.parse(init.body) as Record<string, unknown>;

    expect(body['causa_ingreso_irpf']).toBe('01');
    expect(body['importe_ingreso_irpf']).toBe(0);
  });
});
