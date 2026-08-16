import { describe, expect, it, vi } from 'vitest';
import TicketBaiWsHttpClient from '../../src/client/ticketbaiws-http-client.js';
import TicketBaiWsApiError from '../../src/errors/ticketbaiws-api-error.js';
import TicketBaiWsHttpError from '../../src/errors/ticketbaiws-http-error.js';
import TicketBaiWsNetworkError from '../../src/errors/ticketbaiws-network-error.js';
import TicketBaiWsResponseError from '../../src/errors/ticketbaiws-response-error.js';

function createSuccessResponse(returnValue: unknown = []): Response {
  return new Response(
    JSON.stringify({
      result: 'OK',
      return: returnValue,
      msg: null,
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}

describe('TicketBaiWsHttpClient', (): void => {
  it('sends a GET request with authentication headers', async (): Promise<void> => {
    const response = createSuccessResponse();
    const fetchImplementation = vi
      .fn<typeof globalThis.fetch>()
      .mockResolvedValue(response);

    const client = new TicketBaiWsHttpClient(
      'https://api-test.ticketbaiws.eus/',
      'test-token',
      '00000014Z',
      fetchImplementation,
    );

    const result = await client.request('GET', 'status/');

    expect(result).toEqual({
      result: 'OK',
      return: [],
      msg: null,
    });
    expect(fetchImplementation).toHaveBeenCalledOnce();

    const [input, init] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe('https://api-test.ticketbaiws.eus/status/');
    expect(init?.method).toBe('GET');

    const headers = new Headers(init?.headers);

    expect(headers.get('Accept')).toBe('application/json');
    expect(headers.get('Token')).toBe('test-token');
    expect(headers.get('Nif')).toBe('00000014Z');
    expect(headers.has('Content-Type')).toBe(false);
  });

  it('serializes query parameters', async (): Promise<void> => {
    const fetchImplementation = vi
      .fn<typeof globalThis.fetch>()
      .mockResolvedValue(createSuccessResponse());

    const client = new TicketBaiWsHttpClient(
      'https://api-test.ticketbaiws.eus/',
      'test-token',
      '00000014Z',
      fetchImplementation,
    );

    await client.request('GET', 'tbai/', {
      query: {
        serie: 'A',
        numero: 42,
        active: true,
        optional: undefined,
        empty: null,
      },
    });

    const [input] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe(
      'https://api-test.ticketbaiws.eus/tbai/?serie=A&numero=42&active=true',
    );
  });

  it('serializes JSON bodies', async (): Promise<void> => {
    const fetchImplementation = vi
      .fn<typeof globalThis.fetch>()
      .mockResolvedValue(createSuccessResponse());

    const client = new TicketBaiWsHttpClient(
      'https://api-test.ticketbaiws.eus/',
      'test-token',
      '00000014Z',
      fetchImplementation,
    );

    const body = {
      serie: 'A',
      numero: '42',
    };

    await client.request('POST', 'tbai/', {
      json: body,
    });

    const [, init] = fetchImplementation.mock.calls[0] ?? [];
    const headers = new Headers(init?.headers);

    expect(init?.method).toBe('POST');
    expect(init?.body).toBe(JSON.stringify(body));
    expect(headers.get('Content-Type')).toBe('application/json');
  });

  it('sends raw bodies without setting Content-Type', async (): Promise<void> => {
    const fetchImplementation = vi
      .fn<typeof globalThis.fetch>()
      .mockResolvedValue(createSuccessResponse());

    const client = new TicketBaiWsHttpClient(
      'https://api-test.ticketbaiws.eus/',
      'test-token',
      '00000014Z',
      fetchImplementation,
    );

    const formData = new FormData();

    formData.append(
      'file',
      new Blob(['test'], {
        type: 'application/pdf',
      }),
      'test.pdf',
    );

    await client.request('POST', 'doc-representante/', {
      body: formData,
    });

    const [, init] = fetchImplementation.mock.calls[0] ?? [];
    const headers = new Headers(init?.headers);

    expect(init?.body).toBe(formData);
    expect(headers.has('Content-Type')).toBe(false);
  });

  it('supports PUT requests', async (): Promise<void> => {
    const fetchImplementation = vi
      .fn<typeof globalThis.fetch>()
      .mockResolvedValue(createSuccessResponse());

    const client = new TicketBaiWsHttpClient(
      'https://api-test.ticketbaiws.eus/',
      'test-token',
      '00000014Z',
      fetchImplementation,
    );

    await client.request('PUT', 'resource/', {
      json: {
        id: 1,
      },
    });

    const [, init] = fetchImplementation.mock.calls[0] ?? [];

    expect(init?.method).toBe('PUT');
  });

  it('supports DELETE requests', async (): Promise<void> => {
    const fetchImplementation = vi
      .fn<typeof globalThis.fetch>()
      .mockResolvedValue(createSuccessResponse());

    const client = new TicketBaiWsHttpClient(
      'https://api-test.ticketbaiws.eus/',
      'test-token',
      '00000014Z',
      fetchImplementation,
    );

    await client.request('DELETE', 'tbai/', {
      json: {
        serie: 'A',
        numero: '42',
      },
    });

    const [, init] = fetchImplementation.mock.calls[0] ?? [];

    expect(init?.method).toBe('DELETE');
  });

  it('preserves additional TicketBaiWS response fields', async (): Promise<void> => {
    const response = new Response(
      JSON.stringify({
        result: 'OK',
        return: [],
        msg: 'Showing 1 to 250 of 292',
        count: '292',
      }),
      {
        status: 200,
      },
    );

    const fetchImplementation = vi
      .fn<typeof globalThis.fetch>()
      .mockResolvedValue(response);

    const client = new TicketBaiWsHttpClient(
      'https://api-test.ticketbaiws.eus/',
      'test-token',
      '00000014Z',
      fetchImplementation,
    );

    const result = await client.request('GET', 'tbai-list/');

    expect(result['count']).toBe('292');
  });

  it('throws a network error when fetch fails', async (): Promise<void> => {
    const fetchImplementation = vi
      .fn<typeof globalThis.fetch>()
      .mockRejectedValue(new TypeError('Failed to fetch'));

    const client = new TicketBaiWsHttpClient(
      'https://api-test.ticketbaiws.eus/',
      'test-token',
      '00000014Z',
      fetchImplementation,
    );

    await expect(client.request('GET', 'status/')).rejects.toBeInstanceOf(
      TicketBaiWsNetworkError,
    );
  });

  it('throws an HTTP error when the response is not successful', async (): Promise<void> => {
    const fetchImplementation = vi
      .fn<typeof globalThis.fetch>()
      .mockResolvedValue(
        new Response('Unauthorized', {
          status: 401,
          statusText: 'Unauthorized',
        }),
      );

    const client = new TicketBaiWsHttpClient(
      'https://api-test.ticketbaiws.eus/',
      'test-token',
      '00000014Z',
      fetchImplementation,
    );

    try {
      await client.request('GET', 'status/');

      expect.unreachable();
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(TicketBaiWsHttpError);

      expect(error).toMatchObject({
        status: 401,
        statusText: 'Unauthorized',
        responseBody: 'Unauthorized',
      });
    }
  });

  it('throws a response error when the response is not valid JSON', async (): Promise<void> => {
    const fetchImplementation = vi
      .fn<typeof globalThis.fetch>()
      .mockResolvedValue(
        new Response('not-json', {
          status: 200,
        }),
      );

    const client = new TicketBaiWsHttpClient(
      'https://api-test.ticketbaiws.eus/',
      'test-token',
      '00000014Z',
      fetchImplementation,
    );

    try {
      await client.request('GET', 'status/');

      expect.unreachable();
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(TicketBaiWsResponseError);

      expect(error).toMatchObject({
        responseBody: 'not-json',
      });
    }
  });

  it('throws a response error when the response structure is invalid', async (): Promise<void> => {
    const fetchImplementation = vi
      .fn<typeof globalThis.fetch>()
      .mockResolvedValue(
        new Response(
          JSON.stringify({
            result: 'OK',
            return: [],
          }),
          {
            status: 200,
          },
        ),
      );

    const client = new TicketBaiWsHttpClient(
      'https://api-test.ticketbaiws.eus/',
      'test-token',
      '00000014Z',
      fetchImplementation,
    );

    await expect(client.request('GET', 'status/')).rejects.toBeInstanceOf(
      TicketBaiWsResponseError,
    );
  });

  it('throws an API error when TicketBaiWS returns ERROR', async (): Promise<void> => {
    const apiResponse = {
      result: 'ERROR',
      return: [],
      msg: 'Invalid request',
    };

    const fetchImplementation = vi
      .fn<typeof globalThis.fetch>()
      .mockResolvedValue(
        new Response(JSON.stringify(apiResponse), {
          status: 200,
        }),
      );

    const client = new TicketBaiWsHttpClient(
      'https://api-test.ticketbaiws.eus/',
      'test-token',
      '00000014Z',
      fetchImplementation,
    );

    try {
      await client.request('POST', 'tbai/');

      expect.unreachable();
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(TicketBaiWsApiError);

      expect(error).toMatchObject({
        message: 'Invalid request',
        apiResponse,
      });
    }
  });
});
