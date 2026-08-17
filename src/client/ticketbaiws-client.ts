import TicketBaiWsConfigurationError from '../errors/ticketbaiws-configuration-error.js';
import type TicketBaiWsClientOptions from '../model/common/ticketbaiws-client-options.model.js';
import TicketBaiWsBizkaiaResource from '../resources/bizkaia.resource.js';
import TicketBaiWsCompaniesResource from '../resources/companies.resource.js';
import TicketBaiWsInvoicesResource from '../resources/invoices.resource.js';
import TicketBaiWsLicensesResource from '../resources/licenses.resource.js';
import TicketBaiWsSystemResource from '../resources/system.resource.js';
import TicketBaiWsValidationResource from '../resources/validation.resource.js';
import TicketBaiWsVerifactuResource from '../resources/verifactu.resource.js';
import TicketBaiWsWebhooksResource from '../resources/webhooks.resource.js';
import TicketBaiWsHttpClient from './ticketbaiws-http-client.js';
import TICKETBAIWS_BASE_URLS from './ticketbaiws.constants.js';

class TicketBaiWsClient {
  readonly bizkaia: TicketBaiWsBizkaiaResource;
  readonly companies: TicketBaiWsCompaniesResource;
  readonly invoices: TicketBaiWsInvoicesResource;
  readonly licenses: TicketBaiWsLicensesResource;
  readonly system: TicketBaiWsSystemResource;
  readonly validation: TicketBaiWsValidationResource;
  readonly verifactu: TicketBaiWsVerifactuResource;
  readonly webhooks: TicketBaiWsWebhooksResource;

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

    const httpClient = new TicketBaiWsHttpClient(
      TICKETBAIWS_BASE_URLS[options.environment],
      options.token.trim(),
      options.issuerNif.trim(),
      fetchImplementation as typeof globalThis.fetch,
    );

    this.bizkaia = new TicketBaiWsBizkaiaResource(httpClient);
    this.companies = new TicketBaiWsCompaniesResource(httpClient);
    this.invoices = new TicketBaiWsInvoicesResource(httpClient);
    this.licenses = new TicketBaiWsLicensesResource(httpClient);
    this.system = new TicketBaiWsSystemResource(httpClient);
    this.validation = new TicketBaiWsValidationResource(httpClient);
    this.verifactu = new TicketBaiWsVerifactuResource(httpClient);
    this.webhooks = new TicketBaiWsWebhooksResource(httpClient);
  }
}

export default TicketBaiWsClient;
