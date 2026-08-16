import { describe, expect, it, vi } from 'vitest';
import TicketBaiWsHttpClient from '../../src/client/ticketbaiws-http-client.js';
import TicketBaiWsSystemResource from '../../src/resources/system.resource.js';

describe('TicketBaiWsSystemResource', (): void => {
  it('gets the TicketBaiWS system status', async (): Promise<void> => {
    const apiResponse = {
      result: 'OK',
      return: [],
      msg: 'Ready',
    };

    const fetchImplementation = vi
      .fn<typeof globalThis.fetch>()
      .mockResolvedValue(
        new Response(JSON.stringify(apiResponse), {
          status: 200,
        }),
      );

    const httpClient = new TicketBaiWsHttpClient(
      'https://api-test.ticketbaiws.eus/',
      'test-token',
      '00000014Z',
      fetchImplementation,
    );

    const resource = new TicketBaiWsSystemResource(httpClient);

    const result = await resource.status();

    expect(result).toEqual(apiResponse);

    expect(fetchImplementation).toHaveBeenCalledOnce();

    const [input, init] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe('https://api-test.ticketbaiws.eus/status/');

    expect(init?.method).toBe('GET');
  });
});
