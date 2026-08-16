import { describe, expect, it, vi } from 'vitest';

import TicketBaiWsClient from '../../src/client/ticketbaiws-client.js';
import TicketBaiWsConfigurationError from '../../src/errors/ticketbaiws-configuration-error.js';
import type TicketBaiWsClientOptions from '../../src/model/common/ticketbaiws-client-options.model.js';
import type TicketBaiWsEnvironment from '../../src/model/common/ticketbaiws-environment.type.js';

describe('TicketBaiWsClient', (): void => {
  it('creates a client with valid options', (): void => {
    const fetchImplementation = vi.fn<typeof globalThis.fetch>();

    expect(
      (): TicketBaiWsClient =>
        new TicketBaiWsClient({
          token: 'test-token',
          issuerNif: '00000014Z',
          environment: 'test',
          fetch: fetchImplementation,
        }),
    ).not.toThrow();
  });

  it('throws when options are missing', (): void => {
    expect(
      (): TicketBaiWsClient =>
        new TicketBaiWsClient(undefined as unknown as TicketBaiWsClientOptions),
    ).toThrow(
      new TicketBaiWsConfigurationError(
        'TicketBaiWsClient options are required.',
      ),
    );
  });

  it('throws when token is empty', (): void => {
    expect(
      (): TicketBaiWsClient =>
        new TicketBaiWsClient({
          token: '   ',
          issuerNif: '00000014Z',
          environment: 'test',
        }),
    ).toThrow(
      new TicketBaiWsConfigurationError('TicketBaiWsClient token is required.'),
    );
  });

  it('throws when issuerNif is empty', (): void => {
    expect(
      (): TicketBaiWsClient =>
        new TicketBaiWsClient({
          token: 'test-token',
          issuerNif: '   ',
          environment: 'test',
        }),
    ).toThrow(
      new TicketBaiWsConfigurationError(
        'TicketBaiWsClient issuerNif is required.',
      ),
    );
  });

  it('throws when environment is invalid', (): void => {
    expect(
      (): TicketBaiWsClient =>
        new TicketBaiWsClient({
          token: 'test-token',
          issuerNif: '00000014Z',
          environment: 'invalid' as TicketBaiWsEnvironment,
        }),
    ).toThrow(
      new TicketBaiWsConfigurationError(
        'TicketBaiWsClient environment must be "test" or "production".',
      ),
    );
  });

  it('throws when fetch is invalid', (): void => {
    expect(
      (): TicketBaiWsClient =>
        new TicketBaiWsClient({
          token: 'test-token',
          issuerNif: '00000014Z',
          environment: 'test',
          fetch: 'invalid' as unknown as typeof globalThis.fetch,
        }),
    ).toThrow(
      new TicketBaiWsConfigurationError(
        'No fetch implementation is available.',
      ),
    );
  });
});
