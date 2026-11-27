import { describe, expect, it, vi } from 'vitest';

import {
  TicketBaiWsApiError,
  TicketBaiWsClient,
  TicketBaiWsResponseError,
} from '../../src/index.js';

import type {
  TicketBaiWsBillingProduct,
  TicketBaiWsListBillingProductsRequest,
} from '../../src/index.js';

const product: TicketBaiWsBillingProduct = {
  codigo: '4512',
  referencia: 'MANT-H',
  descripcion: 'Hora de mantenimiento',
  nombre_en: 'Maintenance hour',
  nombre_eu: 'Mantentze-ordua',
  marca: '',
  familia: 'Servicios',
  codigo_familia: '12',
  hs_code: '',
  cantidad: 1,
  importe_unitario: 45,
  tipo_iva: 21,
  tipo_req: 0,
  tipo_retencion: 0,
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
  path: string,
): void {
  expect(fetchImplementation).toHaveBeenCalledOnce();

  const [input, init] = fetchImplementation.mock.calls[0] ?? [];

  expect(input).toBe(`https://api-test.ticketbaiws.eus/${path}`);
  expect(init?.method).toBe('GET');
  expect(init?.body).toBeUndefined();

  const headers = new Headers(init?.headers);

  expect(headers.get('Accept')).toBe('application/json');
  expect(headers.get('Token')).toBe('test-token');
  expect(headers.get('Nif')).toBe('00000014Z');
  expect(headers.has('Content-Type')).toBe(false);
}

describe('TicketBaiWS billing products resource', (): void => {
  it('exposes the two product methods', (): void => {
    const { client } = createClient({
      result: 'OK',
      return: [],
      msg: null,
    });

    expect(client.billing.products.list).toBeTypeOf('function');
    expect(client.billing.products.get).toBeTypeOf('function');
  });

  it('lists products and preserves pagination metadata', async (): Promise<void> => {
    const apiResponse = {
      result: 'OK',
      return: [product],
      msg: 'Showing 1 to 1 of 1',
      count: 1,
    };

    const { client, fetchImplementation } = createClient(apiResponse);

    const response = await client.billing.products.list();

    expect(response).toEqual(apiResponse);
    expect(response.return).toHaveLength(1);
    expect(response.count).toBe(1);
    expect(response.msg).toBe('Showing 1 to 1 of 1');

    expect(response.return[0]?.codigo).toBe('4512');
    expect(response.return[0]?.descripcion).toBe('Hora de mantenimiento');

    expectGetRequest(fetchImplementation, 'productos/');
  });

  it('serializes all supported search filters', async (): Promise<void> => {
    const filters: TicketBaiWsListBillingProductsRequest = {
      buscar: 'hora de mantenimiento',
      referencia: 'MANT-H',
      familia: '12',
      pagina: 0,
      cantidad: 250,
    };

    const { client, fetchImplementation } = createClient({
      result: 'OK',
      return: [product],
      msg: null,
      count: 1,
    });

    const response = await client.billing.products.list(filters);

    expect(response.return[0]?.referencia).toBe('MANT-H');

    expectGetRequest(
      fetchImplementation,
      'productos/' +
        '?buscar=hora+de+mantenimiento' +
        '&referencia=MANT-H' +
        '&familia=12' +
        '&pagina=0' +
        '&cantidad=250',
    );
  });

  it('preserves an explicit first page and zero results', async (): Promise<void> => {
    const { client, fetchImplementation } = createClient({
      result: 'OK',
      return: [],
      msg: 'Showing 0 to 0 of 0',
      count: 0,
    });

    const response = await client.billing.products.list({
      pagina: 0,
    });

    expect(response.return).toEqual([]);
    expect(response.count).toBe(0);

    expectGetRequest(fetchImplementation, 'productos/?pagina=0');
  });

  it('gets a product by its code', async (): Promise<void> => {
    const { client, fetchImplementation } = createClient({
      result: 'OK',
      return: product,
      msg: null,
    });

    const response = await client.billing.products.get('4512');

    expect(response.return).toEqual(product);
    expect(response.return.codigo).toBe('4512');
    expect(response.return.importe_unitario).toBe(45);
    expect(response.return.tipo_iva).toBe(21);
    expect(response.return.nombre_eu).toBe('Mantentze-ordua');

    expectGetRequest(fetchImplementation, 'productos/4512/');
  });

  it('preserves leading zeros in product codes', async (): Promise<void> => {
    const { client, fetchImplementation } = createClient({
      result: 'OK',
      return: {
        ...product,
        codigo: '004512',
      },
      msg: null,
    });

    const response = await client.billing.products.get('004512');

    expect(response.return.codigo).toBe('004512');

    expectGetRequest(fetchImplementation, 'productos/004512/');
  });

  it('encodes special characters in product codes', async (): Promise<void> => {
    const { client, fetchImplementation } = createClient({
      result: 'OK',
      return: {
        ...product,
        codigo: '45/12',
      },
      msg: null,
    });

    await client.billing.products.get('45/12');

    expectGetRequest(fetchImplementation, 'productos/45%2F12/');
  });

  it('preserves numeric amounts and tax rates', async (): Promise<void> => {
    const numericProduct: TicketBaiWsBillingProduct = {
      ...product,
      cantidad: 2.5,
      importe_unitario: 19.995,
      tipo_iva: 10,
      tipo_req: 1.4,
      tipo_retencion: 0,
    };

    const { client } = createClient({
      result: 'OK',
      return: numericProduct,
      msg: null,
    });

    const response = await client.billing.products.get('4512');

    expect(response.return.cantidad).toBe(2.5);
    expect(response.return.importe_unitario).toBe(19.995);
    expect(response.return.tipo_iva).toBe(10);
    expect(response.return.tipo_req).toBe(1.4);
    expect(response.return.tipo_retencion).toBe(0);
  });

  it('throws an API error when the product does not exist', async (): Promise<void> => {
    const apiResponse = {
      result: 'ERROR',
      return: null,
      msg: 'Product not found',
    };

    const { client, fetchImplementation } = createClient(apiResponse);

    try {
      await client.billing.products.get('missing');

      expect.unreachable();
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(TicketBaiWsApiError);

      if (error instanceof TicketBaiWsApiError) {
        expect(error.message).toContain('Product not found');
        expect(error.apiResponse).toEqual(apiResponse);
      }
    }

    expectGetRequest(fetchImplementation, 'productos/missing/');
  });

  it('rejects unexpected PENDING responses', async (): Promise<void> => {
    const { client, fetchImplementation } = createClient({
      result: 'PENDING',
      return: [],
      msg: null,
    });

    await expect(client.billing.products.list()).rejects.toBeInstanceOf(
      TicketBaiWsResponseError,
    );

    expectGetRequest(fetchImplementation, 'productos/');
  });
});
