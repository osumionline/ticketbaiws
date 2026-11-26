import TicketBaiWsError from './ticketbaiws-error.js';

class TicketBaiWsHttpError extends TicketBaiWsError {
  readonly status: number;
  readonly statusText: string;
  readonly responseBody: string;
  readonly retryAfter: string | null;

  constructor(
    status: number,
    statusText: string,
    responseBody: string,
    retryAfter: string | null = null,
  ) {
    const statusDescription: string =
      statusText.trim() === '' ? String(status) : `${status} ${statusText}`;

    super(`TicketBaiWS HTTP request failed with status ${statusDescription}.`);

    this.status = status;
    this.statusText = statusText;
    this.responseBody = responseBody;
    this.retryAfter = retryAfter;
  }
}

export default TicketBaiWsHttpError;
