import type { TicketBaiWsSuccessResponse } from '../common/ticketbaiws-response.model.js';

interface TicketBaiWsAeatValidationRequest {
  readonly nif: string;
  readonly nombre?: string;
}

type TicketBaiWsAeatValidationStatus =
  | 'IDENTIFICADO'
  | 'NO IDENTIFICADO-SIMILAR'
  | 'NO IDENTIFICADO'
  | 'IDENTIFICADO-BAJA'
  | 'IDENTIFICADO-REVOCADO';

interface TicketBaiWsAeatValidationResult {
  readonly nif: string;
  readonly nombre?: string;
  readonly resultado: TicketBaiWsAeatValidationStatus;
}

type TicketBaiWsAeatValidationResponse =
  TicketBaiWsSuccessResponse<TicketBaiWsAeatValidationResult>;

interface TicketBaiWsViesValidationRequest {
  readonly nif: string;
  readonly pais: string;
}

type TicketBaiWsViesValidationStatus = 'IDENTIFICADO' | 'NO IDENTIFICADO';

interface TicketBaiWsViesValidationResult {
  readonly nif: string;
  readonly nombre?: string;
  readonly resultado: TicketBaiWsViesValidationStatus;
}

type TicketBaiWsViesValidationResponse =
  TicketBaiWsSuccessResponse<TicketBaiWsViesValidationResult>;

export type {
  TicketBaiWsAeatValidationRequest,
  TicketBaiWsAeatValidationResponse,
  TicketBaiWsAeatValidationResult,
  TicketBaiWsAeatValidationStatus,
  TicketBaiWsViesValidationRequest,
  TicketBaiWsViesValidationResponse,
  TicketBaiWsViesValidationResult,
  TicketBaiWsViesValidationStatus,
};
