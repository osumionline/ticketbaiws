import { describe, expect, it, vi } from 'vitest';
import TicketBaiWsClient from '../../src/client/ticketbaiws-client.js';

describe('TicketBaiWsClient Bizkaia epigraphs', (): void => {
  it('lists IAE epigraphs', async (): Promise<void> => {
    const apiResponse = {
      result: 'OK',
      return: [
        {
          codigo: '101100',
          nombre_es: 'EXPLOTACION EXTENSIVA DE GANADO BOVINO',
          nombre_eu: 'BETABEREEN USTIAPEN ESTENSIBOA ',
        },
        {
          codigo: '101200',
          nombre_es: 'EXPLOTACION INTENSIVA DE GANADO BOVINO DE LECHE',
          nombre_eu: 'ESNETARAKO BETABEREEN USTIAPEN SARRIA ',
        },
      ],
      msg: 'Ready',
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

    const result = await client.bizkaia.epigraphs.list();

    expect(result).toEqual(apiResponse);

    expect(result.return[0]).toEqual({
      codigo: '101100',
      nombre_es: 'EXPLOTACION EXTENSIVA DE GANADO BOVINO',
      nombre_eu: 'BETABEREEN USTIAPEN ESTENSIBOA ',
    });

    expect(fetchImplementation).toHaveBeenCalledOnce();

    const [input, init] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe('https://api-test.ticketbaiws.eus/epigrafes/');

    expect(init?.method).toBe('GET');

    expect(init?.body).toBeUndefined();

    const headers = new Headers(init?.headers);

    expect(headers.has('Content-Type')).toBe(false);
  });
});
