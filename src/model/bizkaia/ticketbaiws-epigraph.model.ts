import type { TicketBaiWsSuccessResponse } from '../common/ticketbaiws-response.model.js';

interface TicketBaiWsEpigraph {
  readonly codigo: string;
  readonly nombre_es: string;
  readonly nombre_eu: string;
}

type TicketBaiWsListEpigraphsResponse = TicketBaiWsSuccessResponse<
  readonly TicketBaiWsEpigraph[]
>;

export type { TicketBaiWsEpigraph, TicketBaiWsListEpigraphsResponse };
