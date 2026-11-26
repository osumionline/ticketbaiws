import { describe, expect, it, vi } from 'vitest';

import TicketBaiWsHttpClient from '../../src/client/ticketbaiws-http-client.js';
import TicketBaiWsApiError from '../../src/errors/ticketbaiws-api-error.js';
import TicketBaiWsResponseError from '../../src/errors/ticketbaiws-response-error.js';

function createClient(apiResponse: unknown): TicketBaiWsHttpClient {
  const fetchImplementation = vi
    .fn<typeof globalThis.fetch>()
    .mockResolvedValue(
      new Response(JSON.stringify(apiResponse), {
        status: 200,
      }),
    );

  return new TicketBaiWsHttpClient(
    'https://api-test.ticketbaiws.eus/',
    'test-token',
    '00000014Z',
    fetchImplementation,
  );
}

describe('TicketBaiWS response messages', (): void => {
  it('accepts message arrays in OK responses', async (): Promise<void> => {
    const apiResponse = {
      result: 'OK',
      return: { id: 1 },
      msg: ['Warning 1', 'Warning 2'],
    };

    const response = await createClient(apiResponse).request('GET', 'status/');

    expect(response).toEqual(apiResponse);
    expect(response.msg).toEqual(['Warning 1', 'Warning 2']);
  });

  it('accepts message arrays in allowed PENDING responses', async (): Promise<void> => {
    const apiResponse = {
      result: 'PENDING',
      return: { id: 1 },
      msg: ['Processing started'],
    };

    const response = await createClient(apiResponse).request('POST', 'tbai/', {
      allowPending: true,
    });

    expect(response).toEqual(apiResponse);
    expect(response.result).toBe('PENDING');
  });

  it('converts error message arrays into readable text', async (): Promise<void> => {
    const apiResponse = {
      result: 'ERROR',
      return: null,
      msg: ['Invalid invoice', 'Missing customer data'],
    };

    try {
      await createClient(apiResponse).request('POST', 'tbai/');
      expect.unreachable();
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(TicketBaiWsApiError);

      if (error instanceof TicketBaiWsApiError) {
        expect(error.message).toBe('Invalid invoice\nMissing customer data');

        expect(error.apiResponse).toEqual(apiResponse);
      }
    }
  });

  it('preserves structured error messages', async (): Promise<void> => {
    const structuredError = {
      codigo: 'E01',
      descripcion: 'Invalid fiscal data',
    };

    const apiResponse = {
      result: 'ERROR',
      return: null,
      msg: ['Invoice rejected', structuredError],
    };

    try {
      await createClient(apiResponse).request('POST', 'tbai/');
      expect.unreachable();
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(TicketBaiWsApiError);

      if (error instanceof TicketBaiWsApiError) {
        expect(error.message).toBe(
          ['Invoice rejected', JSON.stringify(structuredError)].join('\n'),
        );

        expect(error.apiResponse.msg).toEqual(apiResponse.msg);
      }
    }
  });

  it.each([null, '', '   ', [], [''], ['   ']])(
    'uses the fallback message when msg is %j',
    async (msg: unknown): Promise<void> => {
      try {
        await createClient({
          result: 'ERROR',
          return: null,
          msg,
        }).request('GET', 'status/');

        expect.unreachable();
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(TicketBaiWsApiError);

        if (error instanceof TicketBaiWsApiError) {
          expect(error.message).toBe('TicketBaiWS API returned an error.');
        }
      }
    },
  );

  it.each([123, true, { message: 'Invalid shape' }])(
    'rejects unsupported message values: %j',
    async (msg: unknown): Promise<void> => {
      await expect(
        createClient({
          result: 'OK',
          return: null,
          msg,
        }).request('GET', 'status/'),
      ).rejects.toBeInstanceOf(TicketBaiWsResponseError);
    },
  );
});
