import TicketBaiWsError from './ticketbaiws-error.js';

class TicketBaiWsNetworkError extends TicketBaiWsError {
  constructor(cause: unknown) {
    super('TicketBaiWS network request failed.', {
      cause,
    });
  }
}

export default TicketBaiWsNetworkError;
