import TicketBaiWsConfigurationError from '../errors/ticketbaiws-configuration-error.js';
import type TicketBaiWsClientOptions from '../model/common/ticketbaiws-client-options.model.js';
import TicketBaiWsHttpClient from './ticketbaiws-http-client.js';
import TICKETBAIWS_BASE_URLS from './ticketbaiws.constants.js';

class TicketBaiWsClient {
  private readonly httpClient: TicketBaiWsHttpClient;

  constructor(options: TicketBaiWsClientOptions) {
    if (typeof options !== 'object' || options === null) {
      throw new TicketBaiWsConfigurationError(
        'TicketBaiWsClient options are required.',
      );
    }

    if (typeof options.token !== 'string' || options.token.trim() === '') {
      throw new TicketBaiWsConfigurationError(
        'TicketBaiWsClient token is required.',
      );
    }

    if (
      typeof options.issuerNif !== 'string' ||
      options.issuerNif.trim() === ''
    ) {
      throw new TicketBaiWsConfigurationError(
        'TicketBaiWsClient issuerNif is required.',
      );
    }

    if (
      options.environment !== 'test' &&
      options.environment !== 'production'
    ) {
      throw new TicketBaiWsConfigurationError(
        'TicketBaiWsClient environment must be "test" or "production".',
      );
    }

    const configuredFetch: unknown = options.fetch;

    const fetchImplementation: unknown =
      configuredFetch ??
      (typeof globalThis.fetch === 'function'
        ? globalThis.fetch.bind(globalThis)
        : undefined);

    if (typeof fetchImplementation !== 'function') {
      throw new TicketBaiWsConfigurationError(
        'No fetch implementation is available.',
      );
    }

    this.httpClient = new TicketBaiWsHttpClient(
      TICKETBAIWS_BASE_URLS[options.environment],
      options.token.trim(),
      options.issuerNif.trim(),
      fetchImplementation as typeof globalThis.fetch,
    );
  }
}

export default TicketBaiWsClient;
