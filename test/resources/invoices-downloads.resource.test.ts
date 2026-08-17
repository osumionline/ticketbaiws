import { describe, expect, it, vi } from 'vitest';
import TicketBaiWsHttpClient from '../../src/client/ticketbaiws-http-client.js';
import TicketBaiWsInvoicesResource from '../../src/resources/invoices.resource.js';

describe('TicketBaiWsInvoicesResource downloads', (): void => {
  it('gets the invoice XML files', async (): Promise<void> => {
    const apiResponse = {
      result: 'OK',
      return: {
        xml_request: '<?xml version="1.0"?><TicketBai>request</TicketBai>',
        xml_response: '<?xml version="1.0"?><Response>OK</Response>',
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

    const httpClient = new TicketBaiWsHttpClient(
      'https://api-test.ticketbaiws.eus/',
      'test-token',
      '00000014Z',
      fetchImplementation,
    );

    const resource = new TicketBaiWsInvoicesResource(httpClient);

    const result = await resource.getXml({
      serie: 'A',
      numero: '2026000123',
    });

    expect(result).toEqual(apiResponse);

    expect(result.return.xml_request).toContain('<TicketBai>');

    const [input, init] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe(
      'https://api-test.ticketbaiws.eus/tbai-xml/?serie=A&numero=2026000123',
    );

    expect(init?.method).toBe('GET');

    expect(init?.body).toBeUndefined();
  });

  it('gets the invoice PDF as Base64', async (): Promise<void> => {
    const pdfBase64 = 'JVBERi0xLjcKJeLjz9MK';

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

    const httpClient = new TicketBaiWsHttpClient(
      'https://api-test.ticketbaiws.eus/',
      'test-token',
      '00000014Z',
      fetchImplementation,
    );

    const resource = new TicketBaiWsInvoicesResource(httpClient);

    const result = await resource.getPdf({
      serie: 'A',
      numero: '2026000123',
    });

    expect(result).toEqual(apiResponse);

    expect(result.return).toBe(pdfBase64);

    const [input, init] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe(
      'https://api-test.ticketbaiws.eus/tbai-pdf/?serie=A&numero=2026000123',
    );

    expect(init?.method).toBe('GET');
  });

  it('gets the invoice in FacturaE format', async (): Promise<void> => {
    const facturaEBase64 = 'PD94bWwgdmVyc2lvbj0iMS4wIj8+';

    const apiResponse = {
      result: 'OK',
      return: facturaEBase64,
      msg: null,
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

    const resource = new TicketBaiWsInvoicesResource(httpClient);

    const result = await resource.getFacturaE({
      serie: 'A',
      numero: '2026000123',
      cod_organo_gestor: 'A01021700',
      cod_unidad_tramitadora: 'A01021701',
      cod_oficina_contable: 'A01021702',
    });

    expect(result).toEqual(apiResponse);

    expect(result.return).toBe(facturaEBase64);

    const [input, init] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe(
      'https://api-test.ticketbaiws.eus/facturae/?serie=A&numero=2026000123&cod_organo_gestor=A01021700&cod_unidad_tramitadora=A01021701&cod_oficina_contable=A01021702',
    );

    expect(init?.method).toBe('GET');
  });

  it('omits optional FacturaE codes', async (): Promise<void> => {
    const fetchImplementation = vi
      .fn<typeof globalThis.fetch>()
      .mockResolvedValue(
        new Response(
          JSON.stringify({
            result: 'OK',
            return: 'PD94bWwg',
            msg: null,
          }),
          {
            status: 200,
          },
        ),
      );

    const httpClient = new TicketBaiWsHttpClient(
      'https://api-test.ticketbaiws.eus/',
      'test-token',
      '00000014Z',
      fetchImplementation,
    );

    const resource = new TicketBaiWsInvoicesResource(httpClient);

    await resource.getFacturaE({
      serie: 'A',
      numero: '2026000123',
    });

    const [input] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe(
      'https://api-test.ticketbaiws.eus/facturae/?serie=A&numero=2026000123',
    );
  });
});
