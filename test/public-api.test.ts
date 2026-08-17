import { describe, expect, it, vi } from 'vitest';
import {
  TicketBaiWsApiError,
  TicketBaiWsClient,
  TicketBaiWsConfigurationError,
  TicketBaiWsError,
  TicketBaiWsHttpError,
  TicketBaiWsNetworkError,
  TicketBaiWsResponseError,
} from '../src/index.js';

describe('@osumi/ticketbaiws public API', (): void => {
  it('exposes the complete client resource hierarchy', (): void => {
    const fetchImplementation = vi.fn<typeof globalThis.fetch>();

    const client = new TicketBaiWsClient({
      token: 'test-token',
      issuerNif: '00000014Z',
      environment: 'test',
      fetch: fetchImplementation,
    });

    expect(client.system.status).toBeTypeOf('function');

    expect(client.invoices.create).toBeTypeOf('function');

    expect(client.invoices.completeSimplified).toBeTypeOf('function');

    expect(client.invoices.get).toBeTypeOf('function');

    expect(client.invoices.getXml).toBeTypeOf('function');

    expect(client.invoices.getPdf).toBeTypeOf('function');

    expect(client.invoices.getFacturaE).toBeTypeOf('function');

    expect(client.invoices.list).toBeTypeOf('function');

    expect(client.invoices.cancel).toBeTypeOf('function');

    expect(client.invoices.resend).toBeTypeOf('function');

    expect(client.validation.aeat).toBeTypeOf('function');

    expect(client.validation.vies).toBeTypeOf('function');

    expect(client.companies.create).toBeTypeOf('function');

    expect(client.companies.update).toBeTypeOf('function');

    expect(client.companies.list).toBeTypeOf('function');

    expect(client.licenses.create).toBeTypeOf('function');

    expect(client.licenses.list).toBeTypeOf('function');

    expect(client.webhooks.create).toBeTypeOf('function');

    expect(client.webhooks.update).toBeTypeOf('function');

    expect(client.webhooks.get).toBeTypeOf('function');

    expect(client.webhooks.list).toBeTypeOf('function');

    expect(client.verifactu.representation.getTemplate).toBeTypeOf('function');

    expect(client.verifactu.representation.upload).toBeTypeOf('function');

    expect(client.verifactu.representation.get).toBeTypeOf('function');

    expect(client.verifactu.representation.revoke).toBeTypeOf('function');

    expect(client.bizkaia.epigraphs.list).toBeTypeOf('function');

    expect(client.bizkaia.lroe.receivedInvoices.create).toBeTypeOf('function');

    expect(client.bizkaia.lroe.receivedInvoices.update).toBeTypeOf('function');

    expect(client.bizkaia.lroe.receivedInvoices.list).toBeTypeOf('function');

    expect(client.bizkaia.lroe.receivedInvoices.cancel).toBeTypeOf('function');

    expect(client.bizkaia.lroe.cashCollections.create).toBeTypeOf('function');

    expect(client.bizkaia.lroe.cashCollections.update).toBeTypeOf('function');

    expect(client.bizkaia.lroe.cashCollections.list).toBeTypeOf('function');

    expect(client.bizkaia.lroe.cashCollections.cancel).toBeTypeOf('function');

    expect(client.bizkaia.lroe.cashPayments.create).toBeTypeOf('function');

    expect(client.bizkaia.lroe.cashPayments.update).toBeTypeOf('function');

    expect(client.bizkaia.lroe.cashPayments.list).toBeTypeOf('function');

    expect(client.bizkaia.lroe.cashPayments.cancel).toBeTypeOf('function');
  });

  it('exposes the public error hierarchy', (): void => {
    expect(TicketBaiWsError).toBeTypeOf('function');

    expect(TicketBaiWsConfigurationError).toBeTypeOf('function');

    expect(TicketBaiWsApiError).toBeTypeOf('function');

    expect(TicketBaiWsHttpError).toBeTypeOf('function');

    expect(TicketBaiWsNetworkError).toBeTypeOf('function');

    expect(TicketBaiWsResponseError).toBeTypeOf('function');
  });
});
