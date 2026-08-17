import { describe, expect, it, vi } from 'vitest';
import TicketBaiWsClient from '../../src/client/ticketbaiws-client.js';

describe('TicketBaiWsClient companies', (): void => {
  it('creates a company', async (): Promise<void> => {
    const request = {
      id_licencia: 999,
      nombre_social: 'Empresa de ejemplo S.L.',
      nombre_comercial: 'Neumáticos Pepe',
      nif: 'B01000012',
      direccion: 'Calle de ejemplo 123',
      poblacion: 'Vitoria-Gasteiz',
      provincia: 'Álava',
      cp: '01001',
      email: 'info@ejemplo.com',
      web: 'www.ejemplo.com',
      diputacion: 1 as const,
      epigrafe: '301800',
    };

    const apiResponse = {
      result: 'OK',
      return: {
        id: '999',
        id_licencia: '999',
        epigrafe: '301800',
        nombre_social: 'Empresa de ejemplo S.L.',
        nombre_comercial: 'Neumáticos Pepe',
        nif: 'B01000012',
        direccion: 'Calle de ejemplo 123',
        poblacion: 'Vitoria-Gasteiz',
        provincia: 'Álava',
        cp: '01001',
        email: 'info@ejemplo.com',
        web: 'www.ejemplo.com',
        diputacion: 1,
        token: 'production-token',
        token_test: 'test-token',
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

    const result = await client.companies.create(request);

    expect(result).toEqual(apiResponse);

    const [input, init] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe('https://api-test.ticketbaiws.eus/empresas/');

    expect(init?.method).toBe('POST');

    expect(init?.body).toBe(JSON.stringify(request));
  });

  it('updates a company by NIF', async (): Promise<void> => {
    const request = {
      nombre_comercial: 'Nuevo nombre comercial',
      email: 'nuevo@ejemplo.com',
      autorenovacion: true,
    };

    const apiResponse = {
      result: 'OK',
      return: {
        id: '999',
        id_licencia: '999',
        epigrafe: '',
        nombre_social: 'Empresa de ejemplo S.L.',
        nombre_comercial: 'Nuevo nombre comercial',
        nif: 'B01000012',
        direccion: 'Calle de ejemplo 123',
        poblacion: 'Vitoria-Gasteiz',
        provincia: 'Álava',
        cp: '01001',
        email: 'nuevo@ejemplo.com',
        web: 'www.ejemplo.com',
        token: 'production-token',
        token_test: 'test-token',
        autorenovacion: true,
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

    const result = await client.companies.update('B01000012', request);

    expect(result).toEqual(apiResponse);

    const [input, init] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe('https://api-test.ticketbaiws.eus/empresas/B01000012/');

    expect(init?.method).toBe('PUT');

    expect(init?.body).toBe(JSON.stringify(request));
  });

  it('lists companies with filters', async (): Promise<void> => {
    const apiResponse = {
      result: 'OK',
      return: [
        {
          id: '999',
          id_licencia: '999',
          epigrafe: '',
          nombre_social: 'Empresa de ejemplo S.L.',
          nombre_comercial: 'Neumáticos Pepe',
          nif: 'B01000012',
          direccion: 'Calle de ejemplo 123',
          poblacion: 'Vitoria-Gasteiz',
          provincia: 'Álava',
          cp: '01001',
          email: 'info@ejemplo.com',
          web: 'www.ejemplo.com',
          diputacion: 1,
          token: 'production-token',
          token_test: 'test-token',
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

    const result = await client.companies.list({
      id_licencia: '999',
      nif: 'B01000012',
    });

    expect(result).toEqual(apiResponse);

    const [input, init] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe(
      'https://api-test.ticketbaiws.eus/empresas/?id_licencia=999&nif=B01000012',
    );

    expect(init?.method).toBe('GET');
    expect(init?.body).toBeUndefined();
  });

  it('lists all companies without filters', async (): Promise<void> => {
    const fetchImplementation = vi
      .fn<typeof globalThis.fetch>()
      .mockResolvedValue(
        new Response(
          JSON.stringify({
            result: 'OK',
            return: [],
            msg: null,
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

    await client.companies.list();

    const [input] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe('https://api-test.ticketbaiws.eus/empresas/');
  });
});
