import { describe, expect, it, vi } from 'vitest';
import TicketBaiWsClient from '../../src/client/ticketbaiws-client.js';

describe('TicketBaiWsClient Bizkaia LROE cash payments', (): void => {
  it('creates cash payments with and without invoice', async (): Promise<void> => {
    const request = {
      ejercicio: 2023,
      pagos: [
        {
          nombre_social: 'Berein Internet S.L.',
          nif: 'B01489350',
          fecha_factura: '29/11/2023',
          fecha_pago: '30/12/2023',
          serie: 'A',
          num_factura: '2023000699',
          importe_pagado: 100,
          iva_soportado: 21,
          iva_deducible: 21,
          forma_pago: '01' as const,
          descripcion_fpago: 'Transferencia',
        },
        {
          epigrafe: '197210',
          fecha_pago: '30/12/2023',
          nombre_social: 'Proveedor S.L.',
          nif: 'B01000012',
          tipo_operacion: 'sin_factura' as const,
          concepto: '600' as const,
          linea: 1,
          importe_pagado: 250,
          gasto_irpf: 250,
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
            fecha_pago: '04-12-2023',
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

    const result = await client.bizkaia.lroe.cashPayments.create(request);

    expect(result).toEqual(apiResponse);

    const [input, init] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe('https://api-test.ticketbaiws.eus/lroe-critcaja-pagos/');

    expect(init?.method).toBe('POST');

    expect(init?.body).toBe(JSON.stringify(request));
  });

  it('updates cash payments', async (): Promise<void> => {
    const request = {
      ejercicio: 2023,
      pagos: [
        {
          tipo_operacion: 'con_factura' as const,
          nombre_social: 'Berein Internet S.L.',
          nif: 'B01489350',
          fecha_factura: '29/11/2023',
          fecha_pago: '01/12/2023',
          serie: 'A',
          num_factura: '2023000699',
          importe_pagado: 50,
          iva_soportado: 10.5,
          iva_deducible: 10.5,
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
            fecha_pago: '01-12-2023',
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

    const result = await client.bizkaia.lroe.cashPayments.update(request);

    expect(result).toEqual(apiResponse);

    const [input, init] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe('https://api-test.ticketbaiws.eus/lroe-critcaja-pagos/');

    expect(init?.method).toBe('PUT');

    expect(init?.body).toBe(JSON.stringify(request));
  });

  it('lists cash payments using query parameters', async (): Promise<void> => {
    const apiResponse = {
      result: 'OK',
      return: {
        response: [
          {
            fecha_factura: '29/11/2023',
            fecha_pago: '30/12/2023',
            serie: 'A',
            num_factura: '2023000699',
            importe_pagado: '100.00',
            iva_soportado: '21.00',
            iva_deducible: '21.00',
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

    const result = await client.bizkaia.lroe.cashPayments.list({
      ejercicio: 2023,
      fecha_pago_desde: '01/12/2023',
      concepto: '600',
      epigrafe: '197210',
      estado: 'Correcto',
      pagina: 1,
    });

    expect(result).toEqual(apiResponse);

    expect(result.return.response[0]?.importe_pagado).toBe('100.00');

    const [input, init] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe(
      'https://api-test.ticketbaiws.eus/lroe-critcaja-pagos/?ejercicio=2023&fecha_pago_desde=01%2F12%2F2023&concepto=600&epigrafe=197210&estado=Correcto&pagina=1',
    );

    expect(init?.method).toBe('GET');

    expect(init?.body).toBeUndefined();
  });

  it('cancels cash payments', async (): Promise<void> => {
    const request = {
      ejercicio: 2023,
      pagos: [
        {
          nombre_social: 'Berein Internet S.L.',
          nif: 'B01489350',
          fecha_factura: '29/11/2023',
          fecha_pago: '30/12/2023',
          serie: 'A',
          num_factura: '2023000699',
          importe_pagado: 100,
        },
      ],
    };

    const apiResponse = {
      result: 'OK',
      return: {
        response: [
          {
            fecha_factura: '29-11-2023',
            fecha_pago: '04-12-2023',
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

    const result = await client.bizkaia.lroe.cashPayments.cancel(request);

    expect(result).toEqual(apiResponse);

    const [input, init] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe('https://api-test.ticketbaiws.eus/lroe-critcaja-pagos/');

    expect(init?.method).toBe('DELETE');

    expect(init?.body).toBe(JSON.stringify(request));
  });
});
