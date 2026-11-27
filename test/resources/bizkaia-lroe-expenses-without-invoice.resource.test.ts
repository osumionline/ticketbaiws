import { describe, expect, it, vi } from 'vitest';

import TicketBaiWsApiError from '../../src/errors/ticketbaiws-api-error.js';
import { TicketBaiWsClient } from '../../src/index.js';

import type {
  TicketBaiWsCancelLroeExpensesWithoutInvoiceRequest,
  TicketBaiWsLroeExpenseWithoutInvoice,
  TicketBaiWsMutateLroeExpensesWithoutInvoiceRequest,
} from '../../src/index.js';

const expense: TicketBaiWsLroeExpenseWithoutInvoice = {
  fecha_operacion: '30/09/2026',
  concepto: '626',
  linea: 2,
  importe: 12.5,
  nif: 'B01000017',
  nombre_social: 'Banco de ejemplo S.A.',
};

function createClient(returnData: unknown): {
  readonly client: TicketBaiWsClient;
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

  return {
    client,
    fetchImplementation,
  };
}

function expectMutationRequest(
  fetchImplementation: ReturnType<typeof vi.fn<typeof globalThis.fetch>>,
  method: string,
  request: unknown,
): void {
  expect(fetchImplementation).toHaveBeenCalledOnce();

  const [input, init] = fetchImplementation.mock.calls[0] ?? [];

  expect(input).toBe(
    'https://api-test.ticketbaiws.eus/lroe-gastos-sinfactura/',
  );

  expect(init?.method).toBe(method);
  expect(init?.body).toBe(JSON.stringify(request));

  const headers = new Headers(init?.headers);

  expect(headers.get('Content-Type')).toBe('application/json');
  expect(headers.get('Token')).toBe('test-token');
  expect(headers.get('Nif')).toBe('00000014Z');
}

describe('TicketBaiWS Bizkaia LROE expenses without invoices', (): void => {
  it('exposes the four resource methods', (): void => {
    const { client } = createClient(null);

    const resource = client.bizkaia.lroe.expensesWithoutInvoice;

    expect(resource.create).toBeTypeOf('function');
    expect(resource.update).toBeTypeOf('function');
    expect(resource.list).toBeTypeOf('function');
    expect(resource.cancel).toBeTypeOf('function');
  });

  it('creates a batch of expenses', async (): Promise<void> => {
    const request: TicketBaiWsMutateLroeExpensesWithoutInvoiceRequest = {
      ejercicio: 2026,
      gastos: [
        {
          fecha_operacion: '30/09/2026',
          concepto: '64201',
          importe: 294,
        },
        expense,
      ],
    };

    const returnData = {
      response: [
        {
          fecha_operacion: '30/09/2026',
          epigrafe: '165140',
          concepto: '64201',
          linea: 1,
          estado: 'Correcto',
        },
        {
          fecha_operacion: '30/09/2026',
          epigrafe: '165140',
          concepto: '626',
          linea: 2,
          estado: 'Correcto',
          existe: true,
        },
      ],
      status: 'OK',
    };

    const { client, fetchImplementation } = createClient(returnData);

    const response =
      await client.bizkaia.lroe.expensesWithoutInvoice.create(request);

    expectMutationRequest(fetchImplementation, 'POST', request);

    expect(response.return.response).toHaveLength(2);
    expect(response.return.response[1]?.existe).toBe(true);
    expect(response.return.status).toBe('OK');
  });

  it('updates an existing expense', async (): Promise<void> => {
    const request: TicketBaiWsMutateLroeExpensesWithoutInvoiceRequest = {
      ejercicio: 2026,
      gastos: [
        {
          ...expense,
          importe: 15.25,
          criterio_cobros_pagos: false,
        },
      ],
    };

    const returnData = {
      response: [
        {
          fecha_operacion: '30/09/2026',
          epigrafe: '165140',
          concepto: '626',
          linea: 2,
          estado: 'Correcto',
        },
      ],
      status: 'OK',
    };

    const { client, fetchImplementation } = createClient(returnData);

    const response =
      await client.bizkaia.lroe.expensesWithoutInvoice.update(request);

    expectMutationRequest(fetchImplementation, 'PUT', request);
    expect(response.return.status).toBe('OK');
  });

  it('preserves individual errors in a batch result', async (): Promise<void> => {
    const request: TicketBaiWsMutateLroeExpensesWithoutInvoiceRequest = {
      ejercicio: 2026,
      gastos: [expense],
    };

    const returnData = {
      response: [
        {
          fecha_operacion: '30/09/2026',
          epigrafe: '165140',
          concepto: '626',
          linea: 2,
          estado: 'Incorrecto',
          codigo_error: 'B4_2000000',
          descripcion_error: 'Error de validación',
        },
      ],
      status: 'ERROR',
    };

    const { client } = createClient(returnData);

    const response =
      await client.bizkaia.lroe.expensesWithoutInvoice.create(request);

    expect(response.result).toBe('OK');
    expect(response.return.status).toBe('ERROR');

    expect(response.return.response[0]).toMatchObject({
      estado: 'Incorrecto',
      codigo_error: 'B4_2000000',
    });
  });

  it('queries expenses using URL search parameters', async (): Promise<void> => {
    const returnData = {
      response: [
        {
          fecha_operacion: '30/09/2026',
          epigrafe: '165140',
          concepto: '626',
          linea: 2,
          importe: 12.5,
          nif: 'B01000017',
          nombre_social: 'Banco de ejemplo S.A.',
          estado: 'Correcto',
          fecha_presentacion: '01/10/2026',
        },
      ],
    };

    const { client, fetchImplementation } = createClient(returnData);

    const response = await client.bizkaia.lroe.expensesWithoutInvoice.list({
      ejercicio: 2026,
      fecha_operacion_desde: '01/09/2026',
      nif: 'B01000017',
      estado: 'Correcto',
      pagina: 1,
    });

    expect(response.return.response[0]?.importe).toBe(12.5);
    expect(response.return.response[0]?.estado).toBe('Correcto');

    expect(fetchImplementation).toHaveBeenCalledOnce();

    const [input, init] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe(
      'https://api-test.ticketbaiws.eus/lroe-gastos-sinfactura/' +
        '?ejercicio=2026' +
        '&fecha_operacion_desde=01%2F09%2F2026' +
        '&nif=B01000017' +
        '&estado=Correcto' +
        '&pagina=1',
    );

    expect(init?.method).toBe('GET');
    expect(init?.body).toBeUndefined();

    const headers = new Headers(init?.headers);

    expect(headers.has('Content-Type')).toBe(false);
  });

  it('sends only ejercicio when optional query filters are omitted', async (): Promise<void> => {
    const { client, fetchImplementation } = createClient({
      response: [],
    });

    await client.bizkaia.lroe.expensesWithoutInvoice.list({
      ejercicio: 2026,
    });

    const [input] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe(
      'https://api-test.ticketbaiws.eus/lroe-gastos-sinfactura/?ejercicio=2026',
    );
  });

  it('cancels expenses using only their identifiers', async (): Promise<void> => {
    const request: TicketBaiWsCancelLroeExpensesWithoutInvoiceRequest = {
      ejercicio: 2026,
      gastos: [
        {
          fecha_operacion: '30/09/2026',
          concepto: '626',
          linea: 2,
        },
      ],
    };

    const { client, fetchImplementation } = createClient({
      response: [
        {
          fecha_operacion: '30/09/2026',
          epigrafe: '165140',
          concepto: '626',
          linea: 2,
          estado: 'Correcto',
        },
      ],
      status: 'OK',
    });

    const response =
      await client.bizkaia.lroe.expensesWithoutInvoice.cancel(request);

    expectMutationRequest(fetchImplementation, 'DELETE', request);

    expect(response.return.response[0]?.estado).toBe('Correcto');
  });

  it('throws TicketBaiWsApiError for API-level rejections', async (): Promise<void> => {
    const apiResponse = {
      result: 'ERROR',
      return: null,
      msg: 'Invalid fiscal year',
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

    await expect(
      client.bizkaia.lroe.expensesWithoutInvoice.list({
        ejercicio: 2026,
      }),
    ).rejects.toBeInstanceOf(TicketBaiWsApiError);

    expect(fetchImplementation).toHaveBeenCalledOnce();
  });
});
