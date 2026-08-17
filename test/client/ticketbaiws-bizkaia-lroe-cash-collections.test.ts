import { describe, expect, it, vi } from 'vitest';
import TicketBaiWsClient from '../../src/client/ticketbaiws-client.js';

describe('TicketBaiWsClient Bizkaia LROE cash collections', (): void => {
  it('creates cash collections with and without invoice', async (): Promise<void> => {
    const request = {
      ejercicio: 2023,
      cobros: [
        {
          fecha_factura: '29/11/2023',
          fecha_cobro: '30/12/2023',
          serie: 'A',
          num_factura: '2023000699',
          importe_cobrado: 100,
          iva_devengado: 21,
          forma_pago: '01' as const,
          descripcion_fpago: 'Transferencia',
        },
        {
          epigrafe: '197210',
          fecha_cobro: '30/12/2023',
          tipo_operacion: 'sin_factura' as const,
          tipo_ingreso: '2' as const,
          linea: 1,
          importe_cobrado: 250,
          ingreso_irpf: 250,
          forma_pago: '04' as const,
          descripcion_fpago: 'Otros medios',
        },
      ],
    };

    const apiResponse = {
      result: 'OK',
      return: {
        response: [
          {
            fecha_factura: '29-11-2023',
            fecha_cobro: '04-12-2023',
            serie: 'A',
            num_factura: '2023000699',
            estado: 'Correcto',
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

    const result = await client.bizkaia.lroe.cashCollections.create(request);

    expect(result).toEqual(apiResponse);

    const [input, init] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe(
      'https://api-test.ticketbaiws.eus/lroe-critcaja-cobros/',
    );

    expect(init?.method).toBe('POST');

    expect(init?.body).toBe(JSON.stringify(request));
  });

  it('updates cash collections', async (): Promise<void> => {
    const request = {
      ejercicio: 2023,
      cobros: [
        {
          tipo_operacion: 'con_factura' as const,
          fecha_factura: '29/11/2023',
          fecha_cobro: '01/12/2023',
          serie: 'A',
          num_factura: '2023000699',
          importe_cobrado: 50,
          iva_devengado: 10.5,
          forma_pago: '04' as const,
          descripcion_fpago: 'Otros medios de cobro o de pago',
        },
      ],
    };

    const apiResponse = {
      result: 'OK',
      return: {
        response: [
          {
            fecha_factura: '29-11-2023',
            fecha_cobro: '01-12-2023',
            serie: 'A',
            num_factura: '2023000699',
            estado: 'Correcto',
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

    const result = await client.bizkaia.lroe.cashCollections.update(request);

    expect(result).toEqual(apiResponse);

    const [input, init] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe(
      'https://api-test.ticketbaiws.eus/lroe-critcaja-cobros/',
    );

    expect(init?.method).toBe('PUT');

    expect(init?.body).toBe(JSON.stringify(request));
  });

  it('lists cash collections using query parameters', async (): Promise<void> => {
    const apiResponse = {
      result: 'OK',
      return: {
        response: [
          {
            fecha_factura: '29/11/2023',
            fecha_cobro: '29/11/2023',
            serie: 'A',
            num_factura: '2023000699',
            importe_cobrado: '250.00',
            iva_devengado: '52.50',
            forma_pago: '01',
            descripcion_fpago: 'Transferencia',
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

    const result = await client.bizkaia.lroe.cashCollections.list({
      ejercicio: 2023,
      fecha_cobro_desde: '01/12/2023',
      tipo_ingreso: '2',
      epigrafe: '197210',
      estado: 'Correcto',
      pagina: 1,
    });

    expect(result).toEqual(apiResponse);

    expect(result.return.response[0]?.importe_cobrado).toBe('250.00');

    const [input, init] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe(
      'https://api-test.ticketbaiws.eus/lroe-critcaja-cobros/?ejercicio=2023&fecha_cobro_desde=01%2F12%2F2023&tipo_ingreso=2&epigrafe=197210&estado=Correcto&pagina=1',
    );

    expect(init?.method).toBe('GET');

    expect(init?.body).toBeUndefined();
  });

  it('cancels cash collections', async (): Promise<void> => {
    const request = {
      ejercicio: 2023,
      cobros: [
        {
          fecha_factura: '29/11/2023',
          fecha_cobro: '04/12/2023',
          serie: 'A',
          num_factura: '2023000699',
          importe_cobrado: 100,
        },
      ],
    };

    const apiResponse = {
      result: 'OK',
      return: {
        response: [
          {
            fecha_factura: '29-11-2023',
            fecha_cobro: '04-12-2023',
            serie: 'A',
            num_factura: '2023000699',
            estado: 'Correcto',
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

    const result = await client.bizkaia.lroe.cashCollections.cancel(request);

    expect(result).toEqual(apiResponse);

    const [input, init] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe(
      'https://api-test.ticketbaiws.eus/lroe-critcaja-cobros/',
    );

    expect(init?.method).toBe('DELETE');

    expect(init?.body).toBe(JSON.stringify(request));
  });
});
