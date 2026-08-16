import { describe, expect, it, vi } from 'vitest';
import TicketBaiWsHttpClient from '../../src/client/ticketbaiws-http-client.js';

describe('TicketBaiWsHttpClient', (): void => {
  it('sends a GET request with authentication headers', async (): Promise<void> => {
    const response = new Response();
    const fetchImplementation = vi
      .fn<typeof globalThis.fetch>()
      .mockResolvedValue(response);

    const client = new TicketBaiWsHttpClient(
      'https://api-test.ticketbaiws.eus/',
      'test-token',
      '00000014Z',
      fetchImplementation,
    );

    const result: Response = await client.request('GET', 'status/');

    expect(result).toBe(response);
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
      .mockResolvedValue(new Response());

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
      .mockResolvedValue(new Response());

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
      .mockResolvedValue(new Response());

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
      .mockResolvedValue(new Response());

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
      .mockResolvedValue(new Response());

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
});
