import { describe, expect, it, vi } from 'vitest';
import TicketBaiWsClient from '../../src/client/ticketbaiws-client.js';

describe('TicketBaiWsClient licenses', (): void => {
  it('creates licenses', async (): Promise<void> => {
    const request = {
      plan: 3,
      cantidad: 3,
      meses_anos: 1,
      modalidad: 'mensual' as const,
    };

    const apiResponse = {
      result: 'OK',
      return: {
        ids_licencias: ['999', '1000', '1001'],
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

    const result = await client.licenses.create(request);

    expect(result).toEqual(apiResponse);

    expect(result.return.ids_licencias).toEqual(['999', '1000', '1001']);

    const [input, init] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe('https://api-test.ticketbaiws.eus/licencias/');

    expect(init?.method).toBe('POST');

    expect(init?.body).toBe(JSON.stringify(request));

    const headers = new Headers(init?.headers);

    expect(headers.get('Content-Type')).toBe('application/json');
  });

  it('lists all licenses', async (): Promise<void> => {
    const apiResponse = {
      result: 'OK',
      return: [
        {
          id: '1',
          id_plan: '3',
          fecha_alta: '1648120433',
          fecha_fin: '1679656433',
          renovacion_auto: '1',
          anual: '1',
          nombre_es: 'Plan básico',
          nombre_eu: 'Oinarrizko plana',
          precio_mensual: '5.99',
          precio_anual: '59.88',
          max_tickets_mes: '30',
          max_empresas: '1',
          max_facturacion: '6000',
          n_empresas: '1',
        },
      ],
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

    const result = await client.licenses.list();

    expect(result).toEqual(apiResponse);

    const [input, init] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe('https://api-test.ticketbaiws.eus/licencias/');

    expect(init?.method).toBe('GET');

    expect(init?.body).toBeUndefined();
  });

  it('lists licenses filtered by id', async (): Promise<void> => {
    const apiResponse = {
      result: 'OK',
      return: [],
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

    await client.licenses.list({
      id_licencia: 999,
    });

    const [input, init] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe(
      'https://api-test.ticketbaiws.eus/licencias/?id_licencia=999',
    );

    expect(init?.method).toBe('GET');
  });
});
