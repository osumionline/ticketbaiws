import type TicketBaiWsHttpMethod from '../model/common/ticketbaiws-http-method.type.js';
import type TicketBaiWsHttpRequestOptions from '../model/common/ticketbaiws-http-request-options.model.js';

class TicketBaiWsHttpClient {
  constructor(
    private readonly baseUrl: string,
    private readonly token: string,
    private readonly issuerNif: string,
    private readonly fetchImplementation: typeof globalThis.fetch,
  ) {}

  async request(
    method: TicketBaiWsHttpMethod,
    resource: string,
    options: TicketBaiWsHttpRequestOptions = {},
  ): Promise<Response> {
    const url: URL = this.createUrl(resource, options);
    const headers: Headers = this.createHeaders();
    const requestInit: RequestInit = {
      method,
      headers,
    };

    if (options.json !== undefined) {
      headers.set('Content-Type', 'application/json');
      requestInit.body = JSON.stringify(options.json);
    } else if (options.body !== undefined) {
      requestInit.body = options.body;
    }

    return this.fetchImplementation(url.toString(), requestInit);
  }

  private createUrl(
    resource: string,
    options: TicketBaiWsHttpRequestOptions,
  ): URL {
    const url: URL = new URL(resource, this.baseUrl);

    if (options.query === undefined) {
      return url;
    }

    for (const [key, value] of Object.entries(options.query)) {
      if (value === null || value === undefined) {
        continue;
      }

      url.searchParams.set(key, String(value));
    }

    return url;
  }

  private createHeaders(): Headers {
    return new Headers({
      Accept: 'application/json',
      Token: this.token,
      Nif: this.issuerNif,
    });
  }
}

export default TicketBaiWsHttpClient;
