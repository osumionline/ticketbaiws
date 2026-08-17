import type { TicketBaiWsSuccessResponse } from '../common/ticketbaiws-response.model.js';

interface TicketBaiWsRepresentationTemplateRequest {
  readonly nombre_representante?: string;
  readonly nif_representante?: string;
  readonly poblacion_representante?: string;
  readonly direccion_representante?: string;
}

interface TicketBaiWsRepresentationUploadRequest {
  readonly file: Blob;
  readonly filename?: string;
}

type TicketBaiWsRepresentationPdfResponse = TicketBaiWsSuccessResponse<string>;

type TicketBaiWsRepresentationUploadResponse =
  TicketBaiWsSuccessResponse<string>;

export type {
  TicketBaiWsRepresentationPdfResponse,
  TicketBaiWsRepresentationTemplateRequest,
  TicketBaiWsRepresentationUploadRequest,
  TicketBaiWsRepresentationUploadResponse,
};
