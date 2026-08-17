import { describe, expect, it, vi } from 'vitest';
import TicketBaiWsClient from '../../src/client/ticketbaiws-client.js';

describe('TicketBaiWsClient Verifactu representation upload', (): void => {
  it('uploads a signed representation document', async (): Promise<void> => {
    const apiResponse = {
      result: 'OK',
      return: 'Documento procesado correctamente',
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

    const document = new Blob(['signed-pdf-content'], {
      type: 'application/pdf',
    });

    const result = await client.verifactu.representation.upload({
      file: document,
      filename: 'documento-firmado.pdf',
    });

    expect(result).toEqual(apiResponse);

    expect(fetchImplementation).toHaveBeenCalledOnce();

    const [input, init] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe('https://api-test.ticketbaiws.eus/doc-representante/');

    expect(init?.method).toBe('POST');

    const headers = new Headers(init?.headers);

    expect(headers.has('Content-Type')).toBe(false);

    expect(init?.body).toBeInstanceOf(FormData);

    if (!(init?.body instanceof FormData)) {
      expect.unreachable();
    }

    const uploadedFile = init.body.get('file');

    expect(uploadedFile).toBeInstanceOf(Blob);

    expect(uploadedFile).toMatchObject({
      name: 'documento-firmado.pdf',
      type: 'application/pdf',
    });

    if (uploadedFile instanceof Blob) {
      expect(await uploadedFile.text()).toBe('signed-pdf-content');
    }
  });

  it('uploads a Blob without an explicit filename', async (): Promise<void> => {
    const fetchImplementation = vi
      .fn<typeof globalThis.fetch>()
      .mockResolvedValue(
        new Response(
          JSON.stringify({
            result: 'OK',
            return: 'Documento procesado correctamente',
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

    const document = new Blob(['signed-pdf-content'], {
      type: 'application/pdf',
    });

    await client.verifactu.representation.upload({
      file: document,
    });

    const [, init] = fetchImplementation.mock.calls[0] ?? [];

    expect(init?.body).toBeInstanceOf(FormData);

    if (!(init?.body instanceof FormData)) {
      expect.unreachable();
    }

    expect(init.body.get('file')).toBeInstanceOf(Blob);
  });
});
