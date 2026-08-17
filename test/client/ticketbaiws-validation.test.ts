import { describe, expect, it, vi } from 'vitest';
import TicketBaiWsClient from '../../src/client/ticketbaiws-client.js';

describe('TicketBaiWsClient validation', (): void => {
  it('validates a NIF against AEAT', async (): Promise<void> => {
    const request = {
      nif: '12345678Z',
      nombre: 'Juan Martínez',
    };

    const apiResponse = {
      result: 'OK',
      return: {
        nif: '12345678Z',
        nombre: 'MARTINEZ RODRIGUEZ JUAN',
        resultado: 'IDENTIFICADO',
      },
      msg: '',
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

    const result = await client.validation.aeat(request);

    expect(result).toEqual(apiResponse);

    expect(fetchImplementation).toHaveBeenCalledOnce();

    const [input, init] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe('https://api-test.ticketbaiws.eus/validar-nif/');

    expect(init?.method).toBe('POST');

    expect(init?.body).toBe(JSON.stringify(request));

    const headers = new Headers(init?.headers);

    expect(headers.get('Content-Type')).toBe('application/json');
  });

  it('validates a legal entity against AEAT without a name', async (): Promise<void> => {
    const request = {
      nif: 'B12345678',
    };

    const apiResponse = {
      result: 'OK',
      return: {
        nif: 'B12345678',
        nombre: 'EMPRESA DE EJEMPLO S.L.',
        resultado: 'IDENTIFICADO',
      },
      msg: '',
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

    await client.validation.aeat(request);

    const [, init] = fetchImplementation.mock.calls[0] ?? [];

    expect(init?.body).toBe(
      JSON.stringify({
        nif: 'B12345678',
      }),
    );
  });

  it('validates a NIF against VIES', async (): Promise<void> => {
    const request = {
      nif: 'B12345678',
      pais: 'ES',
    };

    const apiResponse = {
      result: 'OK',
      return: {
        nif: 'B12345678',
        nombre: 'EMPRESA DE EJEMPLO S.L.',
        resultado: 'IDENTIFICADO',
      },
      msg: '',
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

    const result = await client.validation.vies(request);

    expect(result).toEqual(apiResponse);

    expect(fetchImplementation).toHaveBeenCalledOnce();

    const [input, init] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe('https://api-test.ticketbaiws.eus/validar-nif-vies/');

    expect(init?.method).toBe('POST');

    expect(init?.body).toBe(
      JSON.stringify({
        nif: 'B12345678',
        pais: 'ES',
      }),
    );
  });

  it('preserves a negative VIES validation result', async (): Promise<void> => {
    const apiResponse = {
      result: 'OK',
      return: {
        nif: 'B12345678',
        resultado: 'NO IDENTIFICADO',
      },
      msg: '',
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

    const result = await client.validation.vies({
      nif: 'B12345678',
      pais: 'ES',
    });

    expect(result.return.resultado).toBe('NO IDENTIFICADO');
  });
});
