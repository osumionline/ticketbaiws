import { describe, expect, it, vi } from 'vitest';
import TicketBaiWsClient from '../../src/client/ticketbaiws-client.js';

describe('TicketBaiWsClient Bizkaia LROE received invoices read', (): void => {
  it('lists received invoices using query parameters', async (): Promise<void> => {
    const apiResponse = {
      result: 'OK',
      return: {
        response: [
          {
            fecha: '31/08/2023',
            fecha_operacion: '',
            fecha_recepcion: '31/08/2023',
            num_factura: '8064',
            descripcion: '21312',
            nif: 'A88888888',
            nombre_social: 'EMPRESA EJEMPLO S.A.',
            bases: [
              {
                base_imponible: '400.72',
                tipo_iva: '21.00',
              },
            ],
            importe_total: '484.87',
            inversion_sujeto_pasivo: false,
            regimen_iva: '01',
            fecha_presentacion: '15/11/2023 11:16:56',
            fecha_modificacion: '15/11/2023 11:16:56',
            estado: 'Correcto',
          },
        ],
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

    const result = await client.bizkaia.lroe.receivedInvoices.list({
      ejercicio: 2023,
      fecha_factura_desde: '01/06/2023',
      fecha_factura_hasta: '01/10/2023',
      nif: 'IT123895890',
      epigrafe: '197210',
      estado: 'Correcto',
      pagina: 1,
    });

    expect(result).toEqual(apiResponse);

    expect(result.return.response[0]?.importe_total).toBe('484.87');

    expect(result.return.response[0]?.regimen_iva).toBe('01');

    const [input, init] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe(
      'https://api-test.ticketbaiws.eus/lroe-recibidas/?ejercicio=2023&fecha_factura_desde=01%2F06%2F2023&fecha_factura_hasta=01%2F10%2F2023&nif=IT123895890&epigrafe=197210&estado=Correcto&pagina=1',
    );

    expect(init?.method).toBe('GET');

    expect(init?.body).toBeUndefined();
  });

  it('cancels received invoices', async (): Promise<void> => {
    const request = {
      ejercicio: 2023,
      facturas: [
        {
          nif: 'B01489350',
          num_factura: '2023/3/075',
        },
        {
          nif: 'B01489350',
          pais: 'ES',
          num_factura: '2023/3/076',
        },
      ],
    };

    const apiResponse = {
      result: 'OK',
      return: {
        response: [
          {
            fecha: '02-09-2023',
            num_factura: '2023/3/075',
            estado: 'Correcto',
            nif: 'B01489350',
          },
          {
            fecha: '02-09-2023',
            num_factura: '2023/3/076',
            estado: 'Correcto',
            nif: 'B01489350',
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

    const result = await client.bizkaia.lroe.receivedInvoices.cancel(request);

    expect(result).toEqual(apiResponse);

    const [input, init] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe('https://api-test.ticketbaiws.eus/lroe-recibidas/');

    expect(init?.method).toBe('DELETE');

    expect(init?.body).toBe(JSON.stringify(request));
  });
});
