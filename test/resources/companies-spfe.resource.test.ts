import { describe, expect, it, vi } from 'vitest';

import TicketBaiWsHttpClient from '../../src/client/ticketbaiws-http-client.js';
import type {
  TicketBaiWsCompany,
  TicketBaiWsCreateCompanyRequest,
  TicketBaiWsUpdateCompanyRequest,
} from '../../src/index.js';
import TicketBaiWsCompaniesResource from '../../src/resources/companies.resource.js';

const company: TicketBaiWsCompany = {
  id: '100',
  id_licencia: '200',
  epigrafe: '123456',
  nombre_social: 'Example Company S.L.',
  nombre_comercial: 'Example Company',
  nif: 'B01000012',
  direccion: 'Example Street 1',
  poblacion: 'Vitoria-Gasteiz',
  provincia: 'Álava',
  cp: '01001',
  email: 'example@example.com',
  web: 'https://example.com',
  diputacion: 1,
  token: 'mock-production-token',
  token_test: 'mock-test-token',
  autorenovacion: false,
  spfe: true,
};

const baseRequest: TicketBaiWsCreateCompanyRequest = {
  nombre_social: 'Example Company S.L.',
  nif: 'B01000012',
  direccion: 'Example Street 1',
  poblacion: 'Vitoria-Gasteiz',
  provincia: 'Álava',
  cp: '01001',
  diputacion: 1,
};

function createResource(returnData: unknown): {
  readonly resource: TicketBaiWsCompaniesResource;
  readonly fetchImplementation: ReturnType<
    typeof vi.fn<typeof globalThis.fetch>
  >;
} {
  const fetchImplementation = vi
    .fn<typeof globalThis.fetch>()
    .mockResolvedValue(
      new Response(
        JSON.stringify({
          result: 'OK',
          return: returnData,
          msg: null,
        }),
        {
          status: 200,
        },
      ),
    );

  const httpClient = new TicketBaiWsHttpClient(
    'https://api.ticketbaiws.eus/',
    'mock-developer-token',
    '00000014Z',
    fetchImplementation,
  );

  return {
    resource: new TicketBaiWsCompaniesResource(httpClient),
    fetchImplementation,
  };
}

describe('TicketBaiWS companies SPFE', (): void => {
  it.each([true, false])(
    'serializes spfe=%s when creating a company',
    async (spfe: boolean): Promise<void> => {
      const request: TicketBaiWsCreateCompanyRequest = {
        ...baseRequest,
        spfe,
      };

      const { resource, fetchImplementation } = createResource(company);

      await resource.create(request);

      expect(fetchImplementation).toHaveBeenCalledOnce();

      const [input, init] = fetchImplementation.mock.calls[0] ?? [];

      expect(input).toBe('https://api.ticketbaiws.eus/empresas/');
      expect(init?.method).toBe('POST');
      expect(init?.body).toBe(JSON.stringify(request));
    },
  );

  it.each([true, false])(
    'serializes spfe=%s when updating a company',
    async (spfe: boolean): Promise<void> => {
      const request: TicketBaiWsUpdateCompanyRequest = {
        spfe,
      };

      const { resource, fetchImplementation } = createResource(company);

      await resource.update('B01000012', request);

      expect(fetchImplementation).toHaveBeenCalledOnce();

      const [input, init] = fetchImplementation.mock.calls[0] ?? [];

      expect(input).toBe('https://api.ticketbaiws.eus/empresas/B01000012/');

      expect(init?.method).toBe('PUT');
      expect(init?.body).toBe(JSON.stringify(request));
    },
  );

  it('does not add spfe when creating a company without it', async (): Promise<void> => {
    const { resource, fetchImplementation } = createResource(company);

    await resource.create(baseRequest);

    const [, init] = fetchImplementation.mock.calls[0] ?? [];

    if (typeof init?.body !== 'string') {
      throw new Error('Expected a JSON request body.');
    }

    const body = JSON.parse(init.body) as Record<string, unknown>;

    expect(body).not.toHaveProperty('spfe');
    expect(body).toEqual(baseRequest);
  });

  it('does not add spfe when updating unrelated fields', async (): Promise<void> => {
    const request: TicketBaiWsUpdateCompanyRequest = {
      nombre_comercial: 'Updated Example',
    };

    const { resource, fetchImplementation } = createResource(company);

    await resource.update('B01000012', request);

    const [, init] = fetchImplementation.mock.calls[0] ?? [];

    if (typeof init?.body !== 'string') {
      throw new Error('Expected a JSON request body.');
    }

    const body = JSON.parse(init.body) as Record<string, unknown>;

    expect(body).not.toHaveProperty('spfe');
    expect(body).toEqual(request);
  });

  it('exposes the SPFE setting in the company response', async (): Promise<void> => {
    const { resource } = createResource(company);

    const response = await resource.create({
      ...baseRequest,
      spfe: true,
    });

    expect(response.return.spfe).toBe(true);
    expect(response.return.nif).toBe('B01000012');
  });

  it('exposes the SPFE setting when listing companies', async (): Promise<void> => {
    const { resource, fetchImplementation } = createResource([company]);

    const response = await resource.list({
      nif: 'B01000012',
    });

    expect(response.return).toHaveLength(1);
    expect(response.return[0]?.spfe).toBe(true);

    const [input, init] = fetchImplementation.mock.calls[0] ?? [];

    expect(input).toBe('https://api.ticketbaiws.eus/empresas/?nif=B01000012');
    expect(init?.method).toBe('GET');
  });
});
