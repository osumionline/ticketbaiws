import TicketBaiWsError from './ticketbaiws-error.js';

class TicketBaiWsHttpError extends TicketBaiWsError {
  readonly status: number;
  readonly statusText: string;
  readonly responseBody: string;

  constructor(status: number, statusText: string, responseBody: string) {
    const statusDescription: string =
      statusText.trim() === '' ? String(status) : `${status} ${statusText}`;

    super(`TicketBaiWS HTTP request failed with status ${statusDescription}.`);

    this.status = status;
    this.statusText = statusText;
    this.responseBody = responseBody;
  }
}

export default TicketBaiWsHttpError;
