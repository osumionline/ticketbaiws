import { describe, expect, it, vi } from 'vitest';

import TicketBaiWsHttpClient from '../../src/client/ticketbaiws-http-client.js';

import type {
  TicketBaiWsCancelLroeCashCollectionsRequest,
  TicketBaiWsCancelLroeCashPaymentsRequest,
  TicketBaiWsLroeCashCollectionWithInvoice,
  TicketBaiWsLroeCashCollectionWithoutInvoice,
  TicketBaiWsLroeCashPaymentWithInvoice,
  TicketBaiWsLroeCashPaymentWithoutInvoice,
  TicketBaiWsMutateLroeCashCollectionsRequest,
  TicketBaiWsMutateLroeCashPaymentsRequest,
} from '../../src/index.js';

import TicketBaiWsBizkaiaLroeCashCollectionsResource from '../../src/resources/bizkaia-lroe-cash-collections.resource.js';
import TicketBaiWsBizkaiaLroeCashPaymentsResource from '../../src/resources/bizkaia-lroe-cash-payments.resource.js';

const collectionWithInvoice: TicketBaiWsLroeCashCollectionWithInvoice = {
  tipo_operacion: 'con_factura',
  fecha_cobro: '26/11/2026',
  fecha_factura: '20/11/2026',
  serie: 'A',
  num_factura: '123',
  importe_cobrado: 121,
};

const collectionWithoutInvoice: TicketBaiWsLroeCashCollectionWithoutInvoice = {
  tipo_operacion: 'sin_factura',
  fecha_operacion: '20/11/2026',
  fecha_cobro: '26/11/2026',
  tipo_ingreso: '2',
  linea: 1,
  importe_cobrado: 100,
  ingreso_irpf: 100,
};

const paymentWithInvoice: TicketBaiWsLroeCashPaymentWithInvoice = {
  tipo_operacion: 'con_factura',
  fecha_pago: '26/11/2026',
  fecha_factura: '20/11/2026',
  serie: 'B',
  num_factura: '456',
  nif: 'FR123456789',
  pais: 'FR',
  tipo_documento: '02',
  nombre_social: 'Example Supplier',
  importe_pagado: 121,
};

const paymentWithoutInvoice: TicketBaiWsLroeCashPaymentWithoutInvoice = {
  tipo_operacion: 'sin_factura',
  fecha_operacion: '20/11/2026',
  fecha_pago: '26/11/2026',
  nif: 'B01000012',
  nombre_social: 'Example Bank',
  concepto: '626',
  linea: 1,
  importe_pagado: 12.5,
};

function createResources(): {
  readonly collections: TicketBaiWsBizkaiaLroeCashCollectionsResource;
  readonly payments: TicketBaiWsBizkaiaLroeCashPaymentsResource;
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
    collections: new TicketBaiWsBizkaiaLroeCashCollectionsResource(httpClient),
    payments: new TicketBaiWsBizkaiaLroeCashPaymentsResource(httpClient),
    fetchImplementation,
  };
}

function expectRequest(
  fetchImplementation: ReturnType<typeof vi.fn<typeof globalThis.fetch>>,
  method: string,
  resource: string,
  request: unknown,
): void {
  expect(fetchImplementation).toHaveBeenCalledOnce();

  const [input, init] = fetchImplementation.mock.calls[0] ?? [];

  expect(input).toBe(`https://api-test.ticketbaiws.eus/${resource}`);
  expect(init?.method).toBe(method);
  expect(init?.body).toBe(JSON.stringify(request));

  const headers = new Headers(init?.headers);

  expect(headers.get('Content-Type')).toBe('application/json');
}

describe('TicketBaiWS LROE cash collection fields', (): void => {
  it.each(['create', 'update'] as const)(
    'serializes operation dates on %s',
    async (operation): Promise<void> => {
      const request: TicketBaiWsMutateLroeCashCollectionsRequest = {
        ejercicio: 2026,
        cobros: [collectionWithInvoice, collectionWithoutInvoice],
      };

      const { collections, fetchImplementation } = createResources();

      await collections[operation](request);

      expectRequest(
        fetchImplementation,
        operation === 'create' ? 'POST' : 'PUT',
        'lroe-critcaja-cobros/',
        request,
      );
    },
  );

  it('allows an operation date on a collection with an invoice', async (): Promise<void> => {
    const request: TicketBaiWsMutateLroeCashCollectionsRequest = {
      ejercicio: 2026,
      cobros: [
        {
          ...collectionWithInvoice,
          fecha_operacion: '19/11/2026',
        },
      ],
    };

    const { collections, fetchImplementation } = createResources();

    await collections.create(request);

    expectRequest(
      fetchImplementation,
      'POST',
      'lroe-critcaja-cobros/',
      request,
    );
  });

  it('does not add an omitted operation date', async (): Promise<void> => {
    const request: TicketBaiWsMutateLroeCashCollectionsRequest = {
      ejercicio: 2026,
      cobros: [collectionWithInvoice],
    };

    const { collections, fetchImplementation } = createResources();

    await collections.create(request);

    expectRequest(
      fetchImplementation,
      'POST',
      'lroe-critcaja-cobros/',
      request,
    );

    const [, init] = fetchImplementation.mock.calls[0] ?? [];

    if (typeof init?.body !== 'string') {
      throw new Error('Expected a JSON request body.');
    }

    const body = JSON.parse(init.body) as {
      readonly cobros: readonly Record<string, unknown>[];
    };

    expect(body.cobros[0]).not.toHaveProperty('fecha_operacion');
  });

  it('preserves the existing cancellation request', async (): Promise<void> => {
    const request: TicketBaiWsCancelLroeCashCollectionsRequest = {
      ejercicio: 2026,
      cobros: [
        {
          tipo_operacion: 'sin_factura',
          fecha_cobro: '26/11/2026',
          tipo_ingreso: '2',
          linea: 1,
        },
      ],
    };

    const { collections, fetchImplementation } = createResources();

    await collections.cancel(request);

    expectRequest(
      fetchImplementation,
      'DELETE',
      'lroe-critcaja-cobros/',
      request,
    );
  });
});

describe('TicketBaiWS LROE cash payment fields', (): void => {
  it.each(['create', 'update'] as const)(
    'serializes operation dates and document types on %s',
    async (operation): Promise<void> => {
      const request: TicketBaiWsMutateLroeCashPaymentsRequest = {
        ejercicio: 2026,
        pagos: [paymentWithInvoice, paymentWithoutInvoice],
      };

      const { payments, fetchImplementation } = createResources();

      await payments[operation](request);

      expectRequest(
        fetchImplementation,
        operation === 'create' ? 'POST' : 'PUT',
        'lroe-critcaja-pagos/',
        request,
      );
    },
  );

  it('supports a foreign document type with an operation date', async (): Promise<void> => {
    const request: TicketBaiWsMutateLroeCashPaymentsRequest = {
      ejercicio: 2026,
      pagos: [
        {
          ...paymentWithInvoice,
          tipo_documento: '06',
          fecha_operacion: '19/11/2026',
        },
      ],
    };

    const { payments, fetchImplementation } = createResources();

    await payments.create(request);

    expectRequest(fetchImplementation, 'POST', 'lroe-critcaja-pagos/', request);
  });

  it('does not add optional fields automatically', async (): Promise<void> => {
    const payment: TicketBaiWsLroeCashPaymentWithInvoice = {
      tipo_operacion: 'con_factura',
      fecha_pago: '26/11/2026',
      fecha_factura: '20/11/2026',
      serie: 'B',
      num_factura: '456',
      nif: 'FR123456789',
      pais: 'FR',
      nombre_social: 'Example Supplier',
      importe_pagado: 121,
    };

    const request: TicketBaiWsMutateLroeCashPaymentsRequest = {
      ejercicio: 2026,
      pagos: [payment],
    };

    const { payments, fetchImplementation } = createResources();

    await payments.create(request);

    expectRequest(fetchImplementation, 'POST', 'lroe-critcaja-pagos/', request);

    const [, init] = fetchImplementation.mock.calls[0] ?? [];

    if (typeof init?.body !== 'string') {
      throw new Error('Expected a JSON request body.');
    }

    const body = JSON.parse(init.body) as {
      readonly pagos: readonly Record<string, unknown>[];
    };

    expect(body.pagos[0]).not.toHaveProperty('tipo_documento');
    expect(body.pagos[0]).not.toHaveProperty('fecha_operacion');
  });

  it('preserves the existing cancellation request', async (): Promise<void> => {
    const request: TicketBaiWsCancelLroeCashPaymentsRequest = {
      ejercicio: 2026,
      pagos: [
        {
          tipo_operacion: 'sin_factura',
          fecha_pago: '26/11/2026',
          nif: 'B01000012',
          nombre_social: 'Example Bank',
          concepto: '626',
          linea: 1,
        },
      ],
    };

    const { payments, fetchImplementation } = createResources();

    await payments.cancel(request);

    expectRequest(
      fetchImplementation,
      'DELETE',
      'lroe-critcaja-pagos/',
      request,
    );
  });
});
