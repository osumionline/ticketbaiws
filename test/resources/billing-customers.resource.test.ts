import { describe, expect, it, vi } from 'vitest';

import { TicketBaiWsApiError, TicketBaiWsClient } from '../../src/index.js';

import type {
  TicketBaiWsBillingCustomer,
  TicketBaiWsCreateBillingCustomerRequest,
  TicketBaiWsUpdateBillingCustomerRequest,
} from '../../src/index.js';

const customer: TicketBaiWsBillingCustomer = {
  id: 123,
  nif: 'B89670855',
  tipo_documento: '02',
  nombre: 'Construcciones Uribe S.L.',
  nombre_comercial: 'Construcciones Uribe',
  direccion: 'Calle Mayor 1',
  cp: '48001',
  poblacion: 'Bilbao',
  provincia: 'Bizkaia',
  pais: 'España',
  pais_cliente: 'ES',
  email: 'facturas@uribe.example',
  telefono: '944000000',
  web: '',
  fecha_alta: '13/11/2026',
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
  path: string,
  body?: unknown,
): void {
  expect(fetchImplementation).toHaveBeenCalledOnce();

  const [input, init] = fetchImplementation.mock.calls[0] ?? [];

  expect(input).toBe(`https://api-test.ticketbaiws.eus/${path}`);
  expect(init?.method).toBe(method);

  const headers = new Headers(init?.headers);

  expect(headers.get('Accept')).toBe('application/json');
  expect(headers.get('Token')).toBe('test-token');
  expect(headers.get('Nif')).toBe('00000014Z');

  if (body === undefined) {
    expect(init?.body).toBeUndefined();
    expect(headers.has('Content-Type')).toBe(false);
  } else {
    expect(init?.body).toBe(JSON.stringify(body));
    expect(headers.get('Content-Type')).toBe('application/json');
  }
}

describe('TicketBaiWS billing customers resource', (): void => {
  it('exposes the four customer methods', (): void => {
    const { client } = createClient({
      result: 'OK',
      return: [],
      msg: null,
    });

    expect(client.billing.customers.list).toBeTypeOf('function');
    expect(client.billing.customers.get).toBeTypeOf('function');
    expect(client.billing.customers.create).toBeTypeOf('function');
    expect(client.billing.customers.update).toBeTypeOf('function');
  });

  it('lists customers and preserves pagination metadata', async (): Promise<void> => {
    const apiResponse = {
      result: 'OK',
      return: [customer],
      msg: 'Showing 1 to 1 of 1',
      count: 1,
    };

    const { client, fetchImplementation } = createClient(apiResponse);

    const response = await client.billing.customers.list({
      buscar: 'Uribe',
      nif: 'B89670855',
      pagina: 0,
      cantidad: 25,
    });

    expect(response).toEqual(apiResponse);
    expect(response.return).toHaveLength(1);
    expect(response.return[0]?.id).toBe(123);
    expect(response.count).toBe(1);
    expect(response.msg).toBe('Showing 1 to 1 of 1');

    expectRequest(
      fetchImplementation,
      'GET',
      'clientes/' +
        '?buscar=Uribe' +
        '&nif=B89670855' +
        '&pagina=0' +
        '&cantidad=25',
    );
  });

  it('does not add filters when listing customers', async (): Promise<void> => {
    const { client, fetchImplementation } = createClient({
      result: 'OK',
      return: [],
      msg: 'Showing 0 to 0 of 0',
      count: 0,
    });

    const response = await client.billing.customers.list();

    expect(response.return).toEqual([]);
    expect(response.count).toBe(0);

    expectRequest(fetchImplementation, 'GET', 'clientes/');
  });

  it('preserves an explicit first page', async (): Promise<void> => {
    const { client, fetchImplementation } = createClient({
      result: 'OK',
      return: [],
      msg: null,
      count: 0,
    });

    await client.billing.customers.list({
      pagina: 0,
    });

    expectRequest(fetchImplementation, 'GET', 'clientes/?pagina=0');
  });

  it('gets a customer by its identifier', async (): Promise<void> => {
    const { client, fetchImplementation } = createClient({
      result: 'OK',
      return: customer,
      msg: null,
    });

    const response = await client.billing.customers.get(123);

    expect(response.return.id).toBe(123);
    expect(response.return.nombre).toBe('Construcciones Uribe S.L.');
    expect(response.return.pais).toBe('España');
    expect(response.return.pais_cliente).toBe('ES');

    expectRequest(fetchImplementation, 'GET', 'clientes/123/');
  });

  it('creates a customer using the invoicing field names', async (): Promise<void> => {
    const request: TicketBaiWsCreateBillingCustomerRequest = {
      nombre: 'Construcciones Uribe S.L.',
      nombre_comercial: 'Construcciones Uribe',
      nif: 'B89670855',
      direccion: 'Calle Mayor 1',
      cp: '48001',
      poblacion: 'Bilbao',
      provincia: 'Bizkaia',
      pais: 'ES',
      email: 'facturas@uribe.example',
    };

    const { client, fetchImplementation } = createClient({
      result: 'OK',
      return: customer,
      msg: null,
    });

    const response = await client.billing.customers.create(request);

    expect(response.result).toBe('OK');
    expect(response.return.id).toBe(123);

    expectRequest(fetchImplementation, 'POST', 'clientes/', request);
  });

  it('supports creating a customer with only a name', async (): Promise<void> => {
    const request: TicketBaiWsCreateBillingCustomerRequest = {
      nombre: 'Cliente sin NIF',
    };

    const { client, fetchImplementation } = createClient({
      result: 'OK',
      return: {
        ...customer,
        nif: '',
        nombre: 'Cliente sin NIF',
      },
      msg: null,
    });

    await client.billing.customers.create(request);

    expectRequest(fetchImplementation, 'POST', 'clientes/', request);
  });

  it('partially updates an existing customer', async (): Promise<void> => {
    const request: TicketBaiWsUpdateBillingCustomerRequest = {
      nombre_comercial: 'Uribe Construcciones',
      email: 'administracion@uribe.example',
    };

    const { client, fetchImplementation } = createClient({
      result: 'OK',
      return: {
        ...customer,
        ...request,
      },
      msg: null,
    });

    const response = await client.billing.customers.update(123, request);

    expect(response.return.nombre_comercial).toBe('Uribe Construcciones');

    expect(response.return.email).toBe('administracion@uribe.example');

    expectRequest(fetchImplementation, 'PUT', 'clientes/123/', request);
  });

  it('does not add omitted properties during updates', async (): Promise<void> => {
    const request: TicketBaiWsUpdateBillingCustomerRequest = {
      telefono: '944111111',
    };

    const { client, fetchImplementation } = createClient({
      result: 'OK',
      return: {
        ...customer,
        telefono: '944111111',
      },
      msg: null,
    });

    await client.billing.customers.update(123, request);

    expectRequest(fetchImplementation, 'PUT', 'clientes/123/', request);

    const [, init] = fetchImplementation.mock.calls[0] ?? [];

    if (typeof init?.body !== 'string') {
      throw new Error('Expected a JSON request body.');
    }

    const body = JSON.parse(init.body) as Record<string, unknown>;

    expect(body).toEqual({
      telefono: '944111111',
    });

    expect(body).not.toHaveProperty('nombre');
    expect(body).not.toHaveProperty('nif');
  });

  it('throws an API error for a duplicate customer', async (): Promise<void> => {
    const apiResponse = {
      result: 'ERROR',
      return: null,
      msg: 'Customer already exists with id 123',
    };

    const { client, fetchImplementation } = createClient(apiResponse);

    const request: TicketBaiWsCreateBillingCustomerRequest = {
      nombre: 'Construcciones Uribe S.L.',
      nif: 'B89670855',
    };

    try {
      await client.billing.customers.create(request);

      expect.unreachable();
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(TicketBaiWsApiError);

      if (error instanceof TicketBaiWsApiError) {
        expect(error.apiResponse).toEqual(apiResponse);
        expect(error.message).toContain('Customer already exists');
      }
    }

    expectRequest(fetchImplementation, 'POST', 'clientes/', request);
  });
});
