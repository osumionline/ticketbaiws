import { describe, expect, it, vi } from 'vitest';
import TicketBaiWsClient from '../../src/client/ticketbaiws-client.js';

describe('TicketBaiWsClient Bizkaia LROE received invoices', (): void => {
  it('creates received invoices', async (): Promise<void> => {
    const request = {
      ejercicio: 2023,
      facturas: [
        {
          fecha: '02/09/2023',
          nombre_social: 'Empresa de ejemplo S.L.',
          nif: 'B01000012',
          num_factura: '2023715273',
          descripcion: 'Factura móviles',
          importacion: false,
          tipo_factura: 'gasto' as const,
          importe_total: 121,
          bases: [
            {
              base_imponible: 100,
              tipo_iva: 21,
              tipo_req: 0,
              epigrafe: '197210',
              bien_afecto_irpf_iva: 'N' as const,
              importe_gasto_irpf: 121,
              concepto_contable: 600,
              referencia_bien: 'ABC',
              modo_recargo_simplificado: 'E' as const,
            },
          ],
          regimen_iva: 1,
          inversion_sujeto_pasivo: false,
          rectificativa: true,
          num_factura_rectificada: '2023015273',
          fecha_rectificada: '13/11/2023',
          clave_rectificativa: 'R1' as const,
          tipo_rectificativa: 'S' as const,
          base_rectificada: 80,
          cuota_rectificada: 16.8,
        },
      ],
    };

    const apiResponse = {
      result: 'OK',
      return: {
        response: [
          {
            fecha: '01-09-2023',
            num_factura: '9092',
            estado: 'Incorrecto',
            codigo_error: 'B4_2000000',
            descripcion_error: 'El campo es obligatorio.',
            nif: 'A88888888',
          },
          {
            fecha: '01-09-2023',
            num_factura: '9091',
            estado: 'Correcto',
            nif: 'A88888888',
          },
        ],
        status: 'ERROR',
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

    const client = new TicketBaiWsClient({
      token: 'test-token',
      issuerNif: '00000014Z',
      environment: 'test',
      fetch: fetchImplementation,
    });

    const result = await client.bizkaia.lroe.receivedInvoices.create(request);

    expect(result).toEqual(apiResponse);

    const [input, init] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe('https://api-test.ticketbaiws.eus/lroe-recibidas/');

    expect(init?.method).toBe('POST');

    expect(init?.body).toBe(JSON.stringify(request));
  });

  it('updates received invoices', async (): Promise<void> => {
    const request = {
      ejercicio: 2023,
      facturas: [
        {
          fecha: '02/09/2023',
          nombre_social: 'Empresa de ejemplo S.L.',
          nif: 'B01000012',
          num_factura: '2023715273',
          descripcion: 'Factura móviles actualizada',
          importacion: false,
          tipo_factura: 'gasto' as const,
          importe_total: 121,
          bases: [
            {
              base_imponible: 100,
              tipo_iva: 21,
              tipo_req: 0,
              epigrafe: '197210',
            },
          ],
          regimen_iva: 1,
          inversion_sujeto_pasivo: false,
          rectificativa: false,
        },
      ],
    };

    const apiResponse = {
      result: 'OK',
      return: {
        response: [
          {
            fecha: '01-09-2023',
            num_factura: '9091',
            estado: 'Correcto',
            nif: 'A88888888',
          },
        ],
        status: 'OK',
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

    const client = new TicketBaiWsClient({
      token: 'test-token',
      issuerNif: '00000014Z',
      environment: 'test',
      fetch: fetchImplementation,
    });

    const result = await client.bizkaia.lroe.receivedInvoices.update(request);

    expect(result).toEqual(apiResponse);

    const [input, init] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe('https://api-test.ticketbaiws.eus/lroe-recibidas/');

    expect(init?.method).toBe('PUT');

    expect(init?.body).toBe(JSON.stringify(request));
  });
});
