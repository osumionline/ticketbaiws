import { describe, expect, it, vi } from 'vitest';

import TicketBaiWsApiError from '../../src/errors/ticketbaiws-api-error.js';
import { TicketBaiWsClient } from '../../src/index.js';

import type {
  TicketBaiWsSpfeStatusRecord,
  TicketBaiWsSpfeStatusRequest,
} from '../../src/index.js';

const statusRecord: TicketBaiWsSpfeStatusRecord = {
  id: 128,
  estado: 'pago',
  baja: false,
  factura: 'F2026-0153',
  fecha_factura: '03/11/2026',
  nif_emisor: 'B01000012',
  fecha: '10/11/2026',
  vencimiento: '03/12/2026',
  result: 'OK',
  errores: [],
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

function expectRequest(
  fetchImplementation: ReturnType<typeof vi.fn<typeof globalThis.fetch>>,
  method: string,
  expectedBody?: unknown,
): void {
  expect(fetchImplementation).toHaveBeenCalledOnce();

  const [input, init] = fetchImplementation.mock.calls[0] ?? [];

  expect(input).toBe('https://api-test.ticketbaiws.eus/spfe-estados/');

  expect(init?.method).toBe(method);

  if (expectedBody === undefined) {
    expect(init?.body).toBeUndefined();
  } else {
    expect(init?.body).toBe(JSON.stringify(expectedBody));
  }
}

describe('TicketBaiWS SPFE statuses resource', (): void => {
  it('exposes the resource methods', (): void => {
    const { client } = createClient({
      result: 'OK',
      return: [],
      msg: null,
    });

    expect(client.spfe.statuses.create).toBeTypeOf('function');
    expect(client.spfe.statuses.list).toBeTypeOf('function');
  });

  it('accepts PENDING when reporting a received invoice payment', async (): Promise<void> => {
    const request: TicketBaiWsSpfeStatusRequest = {
      estado: 'pago',
      factura: 'F2026-0153',
      fecha_factura: '03/11/2026',
      nif_emisor: 'B01000012',
      nombre_emisor: 'Empresa de ejemplo S.L.',
      fecha: '10/11/2026',
      vencimiento: '03/12/2026',
    };

    const pendingRecord: TicketBaiWsSpfeStatusRecord = {
      ...statusRecord,
      id: 129,
      result: 'PENDING',
    };

    const { client, fetchImplementation } = createClient({
      result: 'PENDING',
      return: pendingRecord,
      msg: null,
    });

    const response = await client.spfe.statuses.create(request);

    expect(response.result).toBe('PENDING');
    expect(response.return.result).toBe('PENDING');
    expect(response.return.id).toBe(129);

    expectRequest(fetchImplementation, 'POST', request);
  });

  it('supports synchronous status reporting', async (): Promise<void> => {
    const request: TicketBaiWsSpfeStatusRequest = {
      estado: 'cobro',
      serie: 'A',
      numero: '2026000245',
      fecha: '10/11/2026',
      financiacion: false,
      sincrono: true,
    };

    const { client, fetchImplementation } = createClient({
      result: 'OK',
      return: {
        ...statusRecord,
        estado: 'cobro',
      },
      msg: null,
    });

    const response = await client.spfe.statuses.create(request);

    expect(response.result).toBe('OK');
    expect(response.return.estado).toBe('cobro');

    expectRequest(fetchImplementation, 'POST', request);
  });

  it('supports reporting non-payment', async (): Promise<void> => {
    const request: TicketBaiWsSpfeStatusRequest = {
      estado: 'impago',
      serie: 'A',
      numero: '2026000245',
      vencimiento: '27/11/2026',
    };

    const { client, fetchImplementation } = createClient({
      result: 'PENDING',
      return: {
        ...statusRecord,
        estado: 'impago',
        result: 'PENDING',
      },
      msg: null,
    });

    await client.spfe.statuses.create(request);

    expectRequest(fetchImplementation, 'POST', request);
  });

  it('supports rejecting a received invoice', async (): Promise<void> => {
    const request: TicketBaiWsSpfeStatusRequest = {
      estado: 'rechazo',
      factura: 'F2026-0153',
      fecha_factura: '03/11/2026',
      nif_emisor: 'B01000012',
      nombre_emisor: 'Empresa de ejemplo S.L.',
      motivo_rechazo: '02',
    };

    const { client, fetchImplementation } = createClient({
      result: 'PENDING',
      return: {
        ...statusRecord,
        estado: 'rechazo',
        result: 'PENDING',
      },
      msg: null,
    });

    await client.spfe.statuses.create(request);

    expectRequest(fetchImplementation, 'POST', request);
  });

  it('supports cancelling a previously reported status', async (): Promise<void> => {
    const request: TicketBaiWsSpfeStatusRequest = {
      estado: 'pago',
      factura: 'F2026-0153',
      fecha_factura: '03/11/2026',
      nif_emisor: 'B01000012',
      nombre_emisor: 'Empresa de ejemplo S.L.',
      vencimiento: '03/12/2026',
      baja: true,
    };

    const { client, fetchImplementation } = createClient({
      result: 'PENDING',
      return: {
        ...statusRecord,
        baja: true,
        result: 'PENDING',
      },
      msg: null,
    });

    const response = await client.spfe.statuses.create(request);

    expect(response.return.baja).toBe(true);

    expectRequest(fetchImplementation, 'POST', request);
  });

  it('preserves AEAT errors in TicketBaiWsApiError', async (): Promise<void> => {
    const apiResponse = {
      result: 'ERROR',
      return: {
        ...statusRecord,
        id: 130,
        result: 'ERROR',
        errores: [
          {
            codigo: 'SPFE-ACTION-01',
            descripcion: 'No existe factura sobre la que actuar',
          },
        ],
      },
      msg: 'SPFE-ACTION-01: No existe factura sobre la que actuar',
    };

    const request: TicketBaiWsSpfeStatusRequest = {
      estado: 'pago',
      factura: 'F2026-0153',
      fecha_factura: '03/11/2026',
      nif_emisor: 'B01000012',
      nombre_emisor: 'Empresa de ejemplo S.L.',
      vencimiento: '03/12/2026',
      sincrono: true,
    };

    const { client, fetchImplementation } = createClient(apiResponse);

    try {
      await client.spfe.statuses.create(request);

      expect.unreachable();
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(TicketBaiWsApiError);

      if (error instanceof TicketBaiWsApiError) {
        expect(error.apiResponse).toEqual(apiResponse);
        expect(error.apiResponse.return).toEqual(apiResponse.return);
      }
    }

    expectRequest(fetchImplementation, 'POST', request);
  });

  it('lists reported SPFE statuses with filters', async (): Promise<void> => {
    const { client, fetchImplementation } = createClient({
      result: 'OK',
      return: [statusRecord],
      msg: null,
    });

    const response = await client.spfe.statuses.list({
      factura: 'F2026-0153',
      nif_emisor: 'B01000012',
    });

    expect(response.return).toHaveLength(1);
    expect(response.return[0]?.result).toBe('OK');
    expect(response.return[0]?.id).toBe(128);

    const [input, init] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe(
      'https://api-test.ticketbaiws.eus/spfe-estados/' +
        '?factura=F2026-0153&nif_emisor=B01000012',
    );

    expect(init?.method).toBe('GET');
    expect(init?.body).toBeUndefined();

    const headers = new Headers(init?.headers);

    expect(headers.has('Content-Type')).toBe(false);
  });

  it('supports querying an issued invoice', async (): Promise<void> => {
    const { client, fetchImplementation } = createClient({
      result: 'OK',
      return: [],
      msg: null,
    });

    await client.spfe.statuses.list({
      serie: 'A',
      numero: '2026000245',
    });

    const [input] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe(
      'https://api-test.ticketbaiws.eus/spfe-estados/' +
        '?serie=A&numero=2026000245',
    );
  });

  it('does not add filters when listing all statuses', async (): Promise<void> => {
    const { client, fetchImplementation } = createClient({
      result: 'OK',
      return: [],
      msg: null,
    });

    const response = await client.spfe.statuses.list();

    expect(response.return).toEqual([]);

    expectRequest(fetchImplementation, 'GET');
  });
});
