import { describe, expect, expectTypeOf, it } from 'vitest';

import type {
  TicketBaiWsInvoiceStatusWebhookNotification,
  TicketBaiWsSpfeReceivedWebhookNotification,
  TicketBaiWsSpfeSentWebhookNotification,
  TicketBaiWsSpfeStatusWebhookNotification,
  TicketBaiWsWebhookNotification,
  TicketBaiWsWebhookNotificationByEvent,
  TicketBaiWsWebhookNotificationHeaders,
  TicketBaiWsWebhookSpfeError,
} from '../../src/index.js';

describe('TicketBaiWS webhook notification models', (): void => {
  it('represents a TicketBAI status notification without evento', (): void => {
    const notification = {
      codigo_webhook: 'hook-01',
      nif: 'B01000012',
      serie: 'A',
      numero: '2026000245',
      fecha_emision: '10/11/2026',
      estado: 'OK',
      avisos: '',
    } satisfies TicketBaiWsInvoiceStatusWebhookNotification;

    expect(notification.estado).toBe('OK');
    expect(notification.numero).toBe('2026000245');
    expect(notification).not.toHaveProperty('evento');

    expectTypeOf(notification).toExtend<TicketBaiWsWebhookNotification>();
  });

  it('represents a successful SPFE invoice submission', (): void => {
    const notification = {
      codigo_webhook: 'hook-01',
      nif: 'B01000012',
      evento: 'spfe_envio',
      serie: 'A',
      numero: '2026000245',
      fecha_emision: '10/11/2026',
      nif_cliente: 'B89670855',
      tipo: 'alta',
      estado: 'OK',
      errores: [],
      localizador: '0000000000000000000000',
    } satisfies TicketBaiWsSpfeSentWebhookNotification;

    expect(notification.evento).toBe('spfe_envio');
    expect(notification.estado).toBe('OK');
    expect(notification.errores).toEqual([]);

    expectTypeOf(notification).toExtend<TicketBaiWsWebhookNotification>();
  });

  it('represents structured SPFE submission errors', (): void => {
    const error: TicketBaiWsWebhookSpfeError = {
      codigo: 'E01',
      descripcion: 'Invoice rejected',
    };

    const notification: TicketBaiWsSpfeSentWebhookNotification = {
      evento: 'spfe_envio',
      estado: 'ERROR',
      errores: [error],
    };

    expect(notification.errores).toEqual([error]);
    expect(notification.estado).toBe('ERROR');
  });

  it('represents a reported SPFE payment status', (): void => {
    const notification = {
      codigo_webhook: 'hook-01',
      nif: 'B01000012',
      evento: 'spfe_estado',
      id: 128,
      estado: 'pago',
      baja: false,
      factura: 'F2026-0153',
      fecha_factura: '03/11/2026',
      nif_emisor: 'B01000012',
      fecha: '10/11/2026',
      vencimiento: '03/12/2026',
      result: 'OK',
      errores: [],
    } satisfies TicketBaiWsSpfeStatusWebhookNotification;

    expect(notification.estado).toBe('pago');
    expect(notification.baja).toBe(false);
    expect(notification.result).toBe('OK');

    expectTypeOf(notification).toExtend<TicketBaiWsWebhookNotification>();
  });

  it('supports cancellation and nullable dates in SPFE statuses', (): void => {
    const notification: TicketBaiWsSpfeStatusWebhookNotification = {
      evento: 'spfe_estado',
      id: 128,
      estado: 'impago',
      baja: true,
      fecha: null,
      vencimiento: null,
      result: 'PENDING',
    };

    expect(notification.baja).toBe(true);
    expect(notification.fecha).toBeNull();
    expect(notification.vencimiento).toBeNull();
    expect(notification.result).toBe('PENDING');
  });

  it('represents an invoice received through SPFE', (): void => {
    const notification = {
      codigo_webhook: 'hook-01',
      nif: 'B89670855',
      evento: 'spfe_recibida',
      id: 57,
      factura: 'F2026-0153',
      fecha_factura: '03/11/2026',
      tipo_factura: '380',
      copia: false,
      nif_emisor: 'B01000012',
      nombre_emisor: 'Empresa de ejemplo S.L.',
      base: 250,
      cuota: 52.5,
      total: 302.5,
      vencimiento: '03/12/2026',
      estado: 'pendiente',
      localizador: '0000000000000000000000',
      fecha_descarga: '04/11/2026 10:05:12',
    } satisfies TicketBaiWsSpfeReceivedWebhookNotification;

    expect(notification.estado).toBe('pendiente');
    expect(notification.total).toBe(302.5);
    expect(notification.tipo_factura).toBe('380');

    expectTypeOf(notification).toExtend<TicketBaiWsWebhookNotification>();
  });

  it('supports nullable received-invoice dates', (): void => {
    const notification: TicketBaiWsSpfeReceivedWebhookNotification = {
      evento: 'spfe_recibida',
      vencimiento: null,
      fecha_descarga: null,
    };

    expect(notification.vencimiento).toBeNull();
    expect(notification.fecha_descarga).toBeNull();
  });

  it('models the notification headers', (): void => {
    const headers: TicketBaiWsWebhookNotificationHeaders = {
      'X-TbaiWs-Id': 'hook-01',
      'X-TbaiWs-Environment': 'test',
      'X-TbaiWs-Topic': 'spfe_estado',
      'X-Tbaiws-Hmac-Sha256': 'mock-base64-signature',
    };

    expect(headers['X-TbaiWs-Id']).toBe('hook-01');
    expect(headers['X-TbaiWs-Environment']).toBe('test');
    expect(headers['X-TbaiWs-Topic']).toBe('spfe_estado');
  });

  it('allows the signature header to be absent', (): void => {
    const headers: TicketBaiWsWebhookNotificationHeaders = {
      'X-TbaiWs-Id': 'hook-01',
      'X-TbaiWs-Environment': 'real',
      'X-TbaiWs-Topic': 'cambio_estado',
    };

    expect(headers['X-Tbaiws-Hmac-Sha256']).toBeUndefined();
  });

  it('maps each event to its corresponding payload', (): void => {
    expectTypeOf<
      TicketBaiWsWebhookNotificationByEvent['cambio_estado']
    >().toEqualTypeOf<TicketBaiWsInvoiceStatusWebhookNotification>();

    expectTypeOf<
      TicketBaiWsWebhookNotificationByEvent['spfe_envio']
    >().toEqualTypeOf<TicketBaiWsSpfeSentWebhookNotification>();

    expectTypeOf<
      TicketBaiWsWebhookNotificationByEvent['spfe_estado']
    >().toEqualTypeOf<TicketBaiWsSpfeStatusWebhookNotification>();

    expectTypeOf<
      TicketBaiWsWebhookNotificationByEvent['spfe_recibida']
    >().toEqualTypeOf<TicketBaiWsSpfeReceivedWebhookNotification>();
  });
});
