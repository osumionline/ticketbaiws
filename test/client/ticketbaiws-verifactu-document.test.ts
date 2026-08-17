import { describe, expect, it, vi } from 'vitest';
import TicketBaiWsClient from '../../src/client/ticketbaiws-client.js';

describe('TicketBaiWsClient Verifactu representation document', (): void => {
  it('downloads the uploaded representation document', async (): Promise<void> => {
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

    const result = await client.verifactu.representation.get();

    expect(result).toEqual(apiResponse);

    expect(result.return).toBe(pdfBase64);

    expect(fetchImplementation).toHaveBeenCalledOnce();

    const [input, init] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe('https://api-test.ticketbaiws.eus/doc-representante/');

    expect(init?.method).toBe('GET');

    expect(init?.body).toBeUndefined();

    const headers = new Headers(init?.headers);

    expect(headers.has('Content-Type')).toBe(false);
  });

  it('revokes the uploaded representation document', async (): Promise<void> => {
    const apiResponse = {
      result: 'OK',
      return: null,
      msg: 'Document voided',
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

    const result = await client.verifactu.representation.revoke();

    expect(result).toEqual(apiResponse);

    expect(result.return).toBeNull();

    const [input, init] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe('https://api-test.ticketbaiws.eus/doc-representante/');

    expect(init?.method).toBe('DELETE');

    expect(init?.body).toBeUndefined();

    const headers = new Headers(init?.headers);

    expect(headers.has('Content-Type')).toBe(false);
  });
});
