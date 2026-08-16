import TicketBaiWsApiError from '../errors/ticketbaiws-api-error.js';
import TicketBaiWsHttpError from '../errors/ticketbaiws-http-error.js';
import TicketBaiWsNetworkError from '../errors/ticketbaiws-network-error.js';
import TicketBaiWsResponseError from '../errors/ticketbaiws-response-error.js';
import type TicketBaiWsHttpMethod from '../model/common/ticketbaiws-http-method.type.js';
import type TicketBaiWsHttpRequestOptions from '../model/common/ticketbaiws-http-request-options.model.js';
import type {
  TicketBaiWsErrorResponse,
  TicketBaiWsResponse,
  TicketBaiWsSuccessResponse,
} from '../model/common/ticketbaiws-response.model.js';

class TicketBaiWsHttpClient {
  constructor(
    private readonly baseUrl: string,
    private readonly token: string,
    private readonly issuerNif: string,
    private readonly fetchImplementation: typeof globalThis.fetch,
  ) {}

  async request<T = unknown>(
    method: TicketBaiWsHttpMethod,
    resource: string,
    options: TicketBaiWsHttpRequestOptions = {},
  ): Promise<TicketBaiWsSuccessResponse<T>> {
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

    let response: Response;

    try {
      response = await this.fetchImplementation(url.toString(), requestInit);
    } catch (cause: unknown) {
      throw new TicketBaiWsNetworkError(cause);
    }

    return this.processResponse<T>(response);
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

  private async processResponse<T>(
    response: Response,
  ): Promise<TicketBaiWsSuccessResponse<T>> {
    let responseBody: string;

    try {
      responseBody = await response.text();
    } catch (cause: unknown) {
      throw new TicketBaiWsResponseError(
        'Unable to read the TicketBaiWS response body.',
        '',
        {
          cause,
        },
      );
    }

    if (!response.ok) {
      throw new TicketBaiWsHttpError(
        response.status,
        response.statusText,
        responseBody,
      );
    }

    let parsedResponse: unknown;

    try {
      parsedResponse = JSON.parse(responseBody);
    } catch (cause: unknown) {
      throw new TicketBaiWsResponseError(
        'TicketBaiWS returned an invalid JSON response.',
        responseBody,
        {
          cause,
        },
      );
    }

    if (!this.isTicketBaiWsResponse(parsedResponse)) {
      throw new TicketBaiWsResponseError(
        'TicketBaiWS returned an invalid response structure.',
        responseBody,
      );
    }

    if (parsedResponse.result === 'ERROR') {
      throw new TicketBaiWsApiError(parsedResponse as TicketBaiWsErrorResponse);
    }

    return parsedResponse as TicketBaiWsSuccessResponse<T>;
  }

  private isTicketBaiWsResponse(
    value: unknown,
  ): value is TicketBaiWsResponse<unknown> {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      return false;
    }

    const response: Record<string, unknown> = value as Record<string, unknown>;

    if (
      !Object.hasOwn(response, 'result') ||
      (response['result'] !== 'OK' && response['result'] !== 'ERROR')
    ) {
      return false;
    }

    if (!Object.hasOwn(response, 'return')) {
      return false;
    }

    if (!Object.hasOwn(response, 'msg')) {
      return false;
    }

    return response['msg'] === null || typeof response['msg'] === 'string';
  }
}

export default TicketBaiWsHttpClient;
