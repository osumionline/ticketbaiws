import type { TicketBaiWsSuccessResponse } from '../common/ticketbaiws-response.model.js';

type TicketBaiWsLicenseModality = 'mensual' | 'anual';

interface TicketBaiWsCreateLicenseRequest {
  readonly plan: number;
  readonly cantidad: number;
  readonly meses_anos: number;
  readonly modalidad: TicketBaiWsLicenseModality;
}

interface TicketBaiWsCreateLicenseResult {
  readonly ids_licencias: readonly string[];
}

type TicketBaiWsCreateLicenseResponse =
  TicketBaiWsSuccessResponse<TicketBaiWsCreateLicenseResult>;

interface TicketBaiWsListLicensesRequest {
  readonly id_licencia?: number;
}

interface TicketBaiWsLicense {
  readonly id: string;
  readonly id_plan: string;
  readonly fecha_alta: string;
  readonly fecha_fin: string;
  readonly renovacion_auto: string;
  readonly anual: string;
  readonly nombre_es: string;
  readonly nombre_eu: string;
  readonly precio_mensual: string;
  readonly precio_anual: string;
  readonly max_tickets_mes: string;
  readonly max_empresas: string;
  readonly max_facturacion: string;
  readonly n_empresas: string;
}

type TicketBaiWsListLicensesResponse = TicketBaiWsSuccessResponse<
  readonly TicketBaiWsLicense[]
>;

export type {
  TicketBaiWsCreateLicenseRequest,
  TicketBaiWsCreateLicenseResponse,
  TicketBaiWsCreateLicenseResult,
  TicketBaiWsLicense,
  TicketBaiWsLicenseModality,
  TicketBaiWsListLicensesRequest,
  TicketBaiWsListLicensesResponse,
};
