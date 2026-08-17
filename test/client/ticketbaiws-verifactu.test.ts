import { describe, expect, it, vi } from 'vitest';
import TicketBaiWsClient from '../../src/client/ticketbaiws-client.js';

describe('TicketBaiWsClient Verifactu representation', (): void => {
  it('downloads the representation document template', async (): Promise<void> => {
    const pdfBase64 = 'JVBERi0xLjcNJeLjz9MNCg';

    const apiResponse = {
      result: 'OK',
      return: pdfBase64,
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

    const result = await client.verifactu.representation.getTemplate({
      nombre_representante: 'Juan Martínez Pérez',
      nif_representante: '12345678Z',
      poblacion_representante: 'Madrid',
      direccion_representante: 'Calle Falsa 123',
    });

    expect(result).toEqual(apiResponse);

    expect(result.return).toBe(pdfBase64);

    expect(fetchImplementation).toHaveBeenCalledOnce();

    const [input, init] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe(
      'https://api-test.ticketbaiws.eus/doc-representante/modelo/?nombre_representante=Juan+Mart%C3%ADnez+P%C3%A9rez&nif_representante=12345678Z&poblacion_representante=Madrid&direccion_representante=Calle+Falsa+123',
    );

    expect(init?.method).toBe('GET');

    expect(init?.body).toBeUndefined();
  });

  it('downloads the representation document template without representative data', async (): Promise<void> => {
    const fetchImplementation = vi
      .fn<typeof globalThis.fetch>()
      .mockResolvedValue(
        new Response(
          JSON.stringify({
            result: 'OK',
            return: 'JVBERi0xLjcN',
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

    await client.verifactu.representation.getTemplate();

    const [input] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe(
      'https://api-test.ticketbaiws.eus/doc-representante/modelo/',
    );
  });
});
