import { describe, expect, it, vi } from 'vitest';

import TicketBaiWsHttpClient from '../../src/client/ticketbaiws-http-client.js';
import TicketBaiWsApiError from '../../src/errors/ticketbaiws-api-error.js';

import type {
  TicketBaiWsInvoiceXmlData,
  TicketBaiWsInvoiceXmlResult,
} from '../../src/index.js';

import TicketBaiWsInvoicesResource from '../../src/resources/invoices.resource.js';

function createResource(apiResponse: unknown): {
  resource: TicketBaiWsInvoicesResource;
  fetchImplementation: ReturnType<typeof vi.fn<typeof globalThis.fetch>>;
} {
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

  return {
    resource: new TicketBaiWsInvoicesResource(httpClient),
    fetchImplementation,
  };
}

describe('TicketBaiWsInvoicesResource getXml', (): void => {
  it('returns a single XML document record', async (): Promise<void> => {
    const document: TicketBaiWsInvoiceXmlResult = {
      serie: 'A',
      numero: '123',
      xml_request: '<TicketBai />',
      xml_response: '<Response />',
    };

    const { resource, fetchImplementation } = createResource({
      result: 'OK',
      return: document,
      msg: null,
    });

    const response = await resource.getXml({
      serie: 'A',
      numero: '123',
    });

    const data: TicketBaiWsInvoiceXmlData = response.return;

    expect(response.result).toBe('OK');
    expect(data).toEqual(document);

    expect(fetchImplementation).toHaveBeenCalledWith(
      'https://api-test.ticketbaiws.eus/tbai-xml/?serie=A&numero=123',
      expect.objectContaining({
        method: 'GET',
      }),
    );

    expect(fetchImplementation).toHaveBeenCalledOnce();
  });

  it('returns multiple XML records for Zuzendu corrections', async (): Promise<void> => {
    const documents: readonly TicketBaiWsInvoiceXmlResult[] = [
      {
        serie: 'A',
        numero: '123',
        xml_request: '<Original />',
        xml_response: '<OriginalResponse />',
      },
      {
        serie: 'A',
        numero: '123',
        xml_request: '<Correction />',
        xml_response: '<CorrectionResponse />',
        zuzendu: 1,
      },
    ];

    const { resource } = createResource({
      result: 'OK',
      return: documents,
      msg: null,
    });

    const response = await resource.getXml({
      serie: 'A',
      numero: '123',
    });

    expect(response.return).toEqual(documents);
    expect(Array.isArray(response.return)).toBe(true);
  });

  it('preserves a null XML response when the remote reply is unavailable', async (): Promise<void> => {
    const document: TicketBaiWsInvoiceXmlResult = {
      serie: 'A',
      numero: '123',
      xml_request: '<TicketBai />',
      xml_response: null,
    };

    const { resource } = createResource({
      result: 'OK',
      return: document,
      msg: null,
    });

    const response = await resource.getXml({
      serie: 'A',
      numero: '123',
    });

    expect(response.return).toEqual(document);
  });

  it('throws an API error when the invoice is not found', async (): Promise<void> => {
    const apiResponse = {
      result: 'ERROR',
      return: null,
      msg: 'TBAI Not Found',
    };

    const { resource } = createResource(apiResponse);

    try {
      await resource.getXml({
        serie: 'A',
        numero: '999',
      });

      expect.unreachable();
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(TicketBaiWsApiError);

      if (error instanceof TicketBaiWsApiError) {
        expect(error.message).toBe('TBAI Not Found');
        expect(error.apiResponse).toEqual(apiResponse);
      }
    }
  });
});
