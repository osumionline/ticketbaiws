type TicketBaiWsResult = 'OK' | 'PENDING' | 'ERROR';

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

interface TicketBaiWsPendingResponse<
  T = unknown,
> extends TicketBaiWsResponse<T> {
  readonly result: 'PENDING';
}

type TicketBaiWsNonErrorResponse<T = unknown> =
  | TicketBaiWsSuccessResponse<T>
  | TicketBaiWsPendingResponse<T>;

interface TicketBaiWsErrorResponse extends TicketBaiWsResponse<unknown> {
  readonly result: 'ERROR';
}

export type {
  TicketBaiWsErrorResponse,
  TicketBaiWsNonErrorResponse,
  TicketBaiWsPendingResponse,
  TicketBaiWsResponse,
  TicketBaiWsResult,
  TicketBaiWsSuccessResponse,
};
