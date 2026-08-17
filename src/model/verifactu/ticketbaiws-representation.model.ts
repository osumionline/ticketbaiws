import type { TicketBaiWsSuccessResponse } from '../common/ticketbaiws-response.model.js';

interface TicketBaiWsRepresentationTemplateRequest {
  readonly nombre_representante?: string;
  readonly nif_representante?: string;
  readonly poblacion_representante?: string;
  readonly direccion_representante?: string;
}

type TicketBaiWsRepresentationPdfResponse = TicketBaiWsSuccessResponse<string>;

export type {
  TicketBaiWsRepresentationPdfResponse,
  TicketBaiWsRepresentationTemplateRequest,
};
