type TicketBaiWsResult = 'OK' | 'ERROR';

interface TicketBaiWsResponse<T = unknown> {
  readonly result: TicketBaiWsResult;
  readonly return: T;
  readonly msg: string | null;
  readonly [key: string]: unknown;
}

interface TicketBaiWsSuccessResponse<
  T = unknown,
> extends TicketBaiWsResponse<T> {
  readonly result: 'OK';
}

interface TicketBaiWsErrorResponse extends TicketBaiWsResponse<unknown> {
  readonly result: 'ERROR';
}

export type {
  TicketBaiWsErrorResponse,
  TicketBaiWsResponse,
  TicketBaiWsResult,
  TicketBaiWsSuccessResponse,
};
