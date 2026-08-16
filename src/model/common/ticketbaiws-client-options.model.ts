import type TicketBaiWsEnvironment from './ticketbaiws-environment.type.js';

export default interface TicketBaiWsClientOptions {
  readonly token: string;
  readonly issuerNif: string;
  readonly environment: TicketBaiWsEnvironment;
  readonly fetch?: typeof globalThis.fetch;
}
