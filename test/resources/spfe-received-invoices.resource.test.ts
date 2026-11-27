import { describe, expect, it, vi } from 'vitest';

import TicketBaiWsApiError from '../../src/errors/ticketbaiws-api-error.js';
import TicketBaiWsResponseError from '../../src/errors/ticketbaiws-response-error.js';
import { TicketBaiWsClient } from '../../src/index.js';

import type {
  TicketBaiWsListSpfeReceivedInvoicesRequest,
  TicketBaiWsSpfeReceivedInvoice,
} from '../../src/index.js';

const invoice: TicketBaiWsSpfeReceivedInvoice = {
  id: 57,
  factura: 'F2026-0153',
  fecha_factura: '03/11/2026',
  tipo_factura: '380',
  copia: false,
  nif_emisor: 'B01000012',
  nombre_emisor: 'Empresa de ejemplo S.L.',
  base: 250,
  cuota: 52.5,
  total: 302.5,
  vencimiento: '03/12/2026',
  estado: 'pendiente',
  localizador: 'LOCGENV1:EXAMPLE',
  fecha_descarga: '04/11/2026 10:05:12',
};

const secondInvoice: TicketBaiWsSpfeReceivedInvoice = {
  id: 58,
  factura: '2026/0098',
  fecha_factura: '05/11/2026',
  tipo_factura: '380',
  copia: false,
  nif_emisor: 'A48000016',
  nombre_emisor: 'Suministros del Norte S.A.',
  base: 1200,
  cuota: 252,
  total: 1452,
  vencimiento: null,
  estado: 'pagada',
  localizador: 'LOCGENV1:SECOND',
  fecha_descarga: '06/11/2026 09:15:40',
};

function createClient(apiResponse: unknown): {
  readonly client: TicketBaiWsClient;
  readonly fetchImplementation: ReturnType<
    typeof vi.fn<typeof globalThis.fetch>
  >;
} {
  const fetchImplementation = vi
    .fn<typeof globalThis.fetch>()
    .mockResolvedValue(
      new Response(JSON.stringify(apiResponse), {
        status: 200,
      }),
    );

  return {
    client: new TicketBaiWsClient({
      token: 'test-token',
      issuerNif: '00000014Z',
      environment: 'test',
      fetch: fetchImplementation,
    }),
    fetchImplementation,
  };
}

function expectGetRequest(
  fetchImplementation: ReturnType<typeof vi.fn<typeof globalThis.fetch>>,
  expectedUrl: string,
): void {
  expect(fetchImplementation).toHaveBeenCalledOnce();

  const [input, init] = fetchImplementation.mock.calls[0] ?? [];

  expect(input).toBe(expectedUrl);
  expect(init?.method).toBe('GET');
  expect(init?.body).toBeUndefined();

  const headers = new Headers(init?.headers);

  expect(headers.get('Accept')).toBe('application/json');
  expect(headers.get('Token')).toBe('test-token');
  expect(headers.get('Nif')).toBe('00000014Z');
  expect(headers.has('Content-Type')).toBe(false);
}

describe('TicketBaiWS SPFE received invoices resource', (): void => {
  it('exposes the list method', (): void => {
    const { client } = createClient({
      result: 'OK',
      return: [],
      msg: null,
    });

    expect(client.spfe.receivedInvoices.list).toBeTypeOf('function');
  });

  it('lists received invoices without filters', async (): Promise<void> => {
    const apiResponse = {
      result: 'OK',
      return: [invoice],
      msg: null,
    };

    const { client, fetchImplementation } = createClient(apiResponse);

    const response = await client.spfe.receivedInvoices.list();

    expect(response).toEqual(apiResponse);

    expect(response.return).toHaveLength(1);
    expect(response.return[0]?.factura).toBe('F2026-0153');
    expect(response.return[0]?.total).toBe(302.5);

    expect(response.return[0]?.ubl).toBeUndefined();

    expectGetRequest(
      fetchImplementation,
      'https://api-test.ticketbaiws.eus/spfe-recibidas/',
    );
  });

  it('supports incremental synchronization with desde_id', async (): Promise<void> => {
    const { client, fetchImplementation } = createClient({
      result: 'OK',
      return: [invoice, secondInvoice],
      msg: null,
    });

    const response = await client.spfe.receivedInvoices.list({
      desde_id: 56,
      limite: 500,
    });

    expect(response.return.map((item) => item.id)).toEqual([57, 58]);
    expect(response.return[1]?.vencimiento).toBeNull();

    expectGetRequest(
      fetchImplementation,
      'https://api-test.ticketbaiws.eus/spfe-recibidas/' +
        '?desde_id=56&limite=500',
    );
  });

  it('preserves a zero desde_id', async (): Promise<void> => {
    const { client, fetchImplementation } = createClient({
      result: 'OK',
      return: [],
      msg: null,
    });

    await client.spfe.receivedInvoices.list({
      desde_id: 0,
    });

    expectGetRequest(
      fetchImplementation,
      'https://api-test.ticketbaiws.eus/spfe-recibidas/?desde_id=0',
    );
  });

  it('serializes all supported query filters', async (): Promise<void> => {
    const filters: TicketBaiWsListSpfeReceivedInvoicesRequest = {
      desde_id: 56,
      id: 57,
      estado: 'pendiente',
      nif_emisor: 'B01000012',
      factura: 'F2026-0153',
      desde: '01/11/2026',
      hasta: '30/11/2026',
      limite: 100,
      ubl: false,
    };

    const { client, fetchImplementation } = createClient({
      result: 'OK',
      return: [invoice],
      msg: null,
    });

    await client.spfe.receivedInvoices.list(filters);

    expectGetRequest(
      fetchImplementation,
      'https://api-test.ticketbaiws.eus/spfe-recibidas/' +
        '?desde_id=56' +
        '&id=57' +
        '&estado=pendiente' +
        '&nif_emisor=B01000012' +
        '&factura=F2026-0153' +
        '&desde=01%2F11%2F2026' +
        '&hasta=30%2F11%2F2026' +
        '&limite=100' +
        '&ubl=false',
    );
  });

  it('preserves original UBL XML when requested', async (): Promise<void> => {
    const originalUbl =
      '<?xml version="1.0" encoding="UTF-8"?>' +
      '<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2">' +
      '</Invoice>';

    const invoiceWithUbl: TicketBaiWsSpfeReceivedInvoice = {
      ...invoice,
      ubl: originalUbl,
    };

    const { client, fetchImplementation } = createClient({
      result: 'OK',
      return: [invoiceWithUbl],
      msg: null,
    });

    const response = await client.spfe.receivedInvoices.list({
      id: 57,
      ubl: true,
    });

    expect(response.return[0]?.ubl).toBe(originalUbl);

    expectGetRequest(
      fetchImplementation,
      'https://api-test.ticketbaiws.eus/spfe-recibidas/' + '?id=57&ubl=true',
    );
  });

  it('preserves an authorization warning with an empty list', async (): Promise<void> => {
    const warning =
      'SPFE: not authorized to query received invoices. ' +
      'Upload the company certificate or grant power of attorney.';

    const apiResponse = {
      result: 'OK',
      return: [],
      msg: warning,
    };

    const { client, fetchImplementation } = createClient(apiResponse);

    const response = await client.spfe.receivedInvoices.list();

    expect(response.result).toBe('OK');
    expect(response.return).toEqual([]);
    expect(response.msg).toBe(warning);

    expectGetRequest(
      fetchImplementation,
      'https://api-test.ticketbaiws.eus/spfe-recibidas/',
    );
  });

  it('throws TicketBaiWsApiError on an API error', async (): Promise<void> => {
    const apiResponse = {
      result: 'ERROR',
      return: null,
      msg: 'Invalid received invoice query',
    };

    const { client, fetchImplementation } = createClient(apiResponse);

    try {
      await client.spfe.receivedInvoices.list({
        id: 57,
      });

      expect.unreachable();
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(TicketBaiWsApiError);

      if (error instanceof TicketBaiWsApiError) {
        expect(error.apiResponse).toEqual(apiResponse);
      }
    }

    expectGetRequest(
      fetchImplementation,
      'https://api-test.ticketbaiws.eus/spfe-recibidas/?id=57',
    );
  });

  it('rejects unexpected PENDING responses for a GET request', async (): Promise<void> => {
    const { client } = createClient({
      result: 'PENDING',
      return: [],
      msg: null,
    });

    await expect(client.spfe.receivedInvoices.list()).rejects.toBeInstanceOf(
      TicketBaiWsResponseError,
    );
  });
});
