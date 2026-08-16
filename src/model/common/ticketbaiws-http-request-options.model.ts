import type { TicketBaiWsQueryParams } from './ticketbaiws-query-params.model.js';

export default interface TicketBaiWsHttpRequestOptions {
  readonly query?: TicketBaiWsQueryParams;
  readonly json?: unknown;
  readonly body?: BodyInit;
}
