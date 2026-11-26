import type { TicketBaiWsErrorResponse } from '../model/common/ticketbaiws-response.model.js';
import TicketBaiWsError from './ticketbaiws-error.js';

class TicketBaiWsApiError extends TicketBaiWsError {
  readonly apiResponse: TicketBaiWsErrorResponse;

  constructor(apiResponse: TicketBaiWsErrorResponse) {
    const messages: readonly unknown[] =
      typeof apiResponse.msg === 'string'
        ? [apiResponse.msg]
        : (apiResponse.msg ?? []);

    const messageText: string = messages
      .map((entry: unknown): string => {
        if (entry === null) {
          return '';
        }

        if (typeof entry === 'string') {
          return entry;
        }

        return JSON.stringify(entry) ?? String(entry);
      })
      .filter((entry: string): boolean => entry.trim() !== '')
      .join('\n');

    const message: string =
      messageText !== '' ? messageText : 'TicketBaiWS API returned an error.';

    super(message);

    this.apiResponse = apiResponse;
  }
}

export default TicketBaiWsApiError;
