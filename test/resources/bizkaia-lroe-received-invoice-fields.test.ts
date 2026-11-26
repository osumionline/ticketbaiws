import { describe, expect, it, vi } from 'vitest';

import TicketBaiWsHttpClient from '../../src/client/ticketbaiws-http-client.js';

import type {
  TicketBaiWsCreateLroeReceivedInvoicesRequest,
  TicketBaiWsLroeReceivedInvoice,
  TicketBaiWsLroeReceivedInvoiceUpdate,
  TicketBaiWsUpdateLroeReceivedInvoicesRequest,
} from '../../src/index.js';

import TicketBaiWsBizkaiaLroeReceivedInvoicesResource from '../../src/resources/bizkaia-lroe-received-invoices.resource.js';

const invoice: TicketBaiWsLroeReceivedInvoice = {
  fecha: '26/11/2026',
  nif: 'B01000012',
  nombre_social: 'Proveedor de ejemplo S.L.',
  num_factura: '2026000123',
  descripcion: 'Compra de material',
  importacion: false,
  tipo_factura: 'compras',
  importe_total: 121,
  bases: [
    {
      base_imponible: 100,
      tipo_iva: 21,
      tipo_req: 0,
    },
  ],
  rectificativa: false,
};

const updatedInvoice: TicketBaiWsLroeReceivedInvoiceUpdate = {
  fecha: '26/11/2026',
  nif: 'B01000012',
  nombre_social: 'Proveedor de ejemplo S.L.',
  num_factura: '2026000123',
  descripcion: 'Compra de material actualizada',
  importacion: false,
  tipo_factura: 'compras',
  importe_total: 121,
  bases: [
    {
      base_imponible: 100,
      tipo_iva: 21,
      tipo_req: 0,
    },
  ],
  rectificativa: false,
};

function createResource(): {
  readonly resource: TicketBaiWsBizkaiaLroeReceivedInvoicesResource;
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
            response: [],
            status: 'OK',
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
    resource: new TicketBaiWsBizkaiaLroeReceivedInvoicesResource(httpClient),
    fetchImplementation,
  };
}

function getRequestBody(
  fetchImplementation: ReturnType<typeof vi.fn<typeof globalThis.fetch>>,
): Record<string, unknown> {
  const [, init] = fetchImplementation.mock.calls[0] ?? [];

  if (typeof init?.body !== 'string') {
    throw new Error('Expected a JSON request body.');
  }

  return JSON.parse(init.body) as Record<string, unknown>;
}

describe('TicketBaiWS LROE received invoice fields', (): void => {
  it.each([
    { simplificada: true, intracomunitaria: false },
    { simplificada: false, intracomunitaria: true },
  ])(
    'serializes create fields: %j',
    async ({ simplificada, intracomunitaria }): Promise<void> => {
      const request: TicketBaiWsCreateLroeReceivedInvoicesRequest = {
        ejercicio: 2026,
        facturas: [
          {
            ...invoice,
            simplificada,
            intracomunitaria,
          },
        ],
      };

      const { resource, fetchImplementation } = createResource();

      await resource.create(request);

      expect(fetchImplementation).toHaveBeenCalledOnce();

      const [input, init] = fetchImplementation.mock.calls[0] ?? [];

      expect(input).toBe('https://api-test.ticketbaiws.eus/lroe-recibidas/');
      expect(init?.method).toBe('POST');

      const body = getRequestBody(fetchImplementation);

      expect(body).toEqual(request);
    },
  );

  it.each([
    { simplificada: true, intracomunitaria: false },
    { simplificada: false, intracomunitaria: true },
  ])(
    'serializes update fields: %j',
    async ({ simplificada, intracomunitaria }): Promise<void> => {
      const request: TicketBaiWsUpdateLroeReceivedInvoicesRequest = {
        ejercicio: 2026,
        facturas: [
          {
            ...updatedInvoice,
            simplificada,
            intracomunitaria,
          },
        ],
      };

      const { resource, fetchImplementation } = createResource();

      await resource.update(request);

      expect(fetchImplementation).toHaveBeenCalledOnce();

      const [input, init] = fetchImplementation.mock.calls[0] ?? [];

      expect(input).toBe('https://api-test.ticketbaiws.eus/lroe-recibidas/');
      expect(init?.method).toBe('PUT');

      const body = getRequestBody(fetchImplementation);

      expect(body).toEqual(request);
    },
  );

  it('does not add optional fields during creation', async (): Promise<void> => {
    const request: TicketBaiWsCreateLroeReceivedInvoicesRequest = {
      ejercicio: 2026,
      facturas: [invoice],
    };

    const { resource, fetchImplementation } = createResource();

    await resource.create(request);

    const body = getRequestBody(fetchImplementation);
    const facturas = body['facturas'];

    expect(Array.isArray(facturas)).toBe(true);

    if (!Array.isArray(facturas)) {
      throw new Error('Expected an invoice array.');
    }

    const firstInvoice = facturas[0] as Record<string, unknown>;

    expect(firstInvoice).not.toHaveProperty('simplificada');
    expect(firstInvoice).not.toHaveProperty('intracomunitaria');
  });

  it('does not add optional fields during updates', async (): Promise<void> => {
    const request: TicketBaiWsUpdateLroeReceivedInvoicesRequest = {
      ejercicio: 2026,
      facturas: [updatedInvoice],
    };

    const { resource, fetchImplementation } = createResource();

    await resource.update(request);

    const body = getRequestBody(fetchImplementation);
    const facturas = body['facturas'];

    expect(Array.isArray(facturas)).toBe(true);

    if (!Array.isArray(facturas)) {
      throw new Error('Expected an invoice array.');
    }

    const firstInvoice = facturas[0] as Record<string, unknown>;

    expect(firstInvoice).not.toHaveProperty('simplificada');
    expect(firstInvoice).not.toHaveProperty('intracomunitaria');
  });
});
