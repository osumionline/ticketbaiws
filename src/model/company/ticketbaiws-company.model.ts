import type { TicketBaiWsSuccessResponse } from '../common/ticketbaiws-response.model.js';

type TicketBaiWsCompanyTaxAuthority = 1 | 2 | 3 | 4;

interface TicketBaiWsCompany {
  readonly id: string;
  readonly id_licencia: string;
  readonly epigrafe: string;
  readonly nombre_social: string;
  readonly nombre_comercial: string;
  readonly nif: string;
  readonly direccion: string;
  readonly poblacion: string;
  readonly provincia: string;
  readonly cp: string;
  readonly email: string;
  readonly web: string;
  readonly diputacion?: TicketBaiWsCompanyTaxAuthority;
  readonly token: string;
  readonly token_test: string;
  readonly autorenovacion?: boolean;
}

interface TicketBaiWsCreateCompanyRequest {
  readonly id_licencia?: number;
  readonly nombre_social: string;
  readonly nombre_comercial?: string;
  readonly nif: string;
  readonly direccion: string;
  readonly poblacion: string;
  readonly provincia: string;
  readonly cp: string;
  readonly email?: string;
  readonly web?: string;
  readonly diputacion: TicketBaiWsCompanyTaxAuthority;
  readonly epigrafe?: string;
}

interface TicketBaiWsUpdateCompanyRequest {
  readonly nombre_social?: string;
  readonly nombre_comercial?: string;
  readonly direccion?: string;
  readonly poblacion?: string;
  readonly provincia?: string;
  readonly cp?: string;
  readonly email?: string;
  readonly web?: string;
  readonly epigrafe?: string;
  readonly autorenovacion?: boolean;
}

interface TicketBaiWsListCompaniesRequest {
  readonly id_licencia?: string;
  readonly nif?: string;
}

type TicketBaiWsCompanyResponse =
  TicketBaiWsSuccessResponse<TicketBaiWsCompany>;

type TicketBaiWsListCompaniesResponse = TicketBaiWsSuccessResponse<
  readonly TicketBaiWsCompany[]
>;

export type {
  TicketBaiWsCompany,
  TicketBaiWsCompanyResponse,
  TicketBaiWsCompanyTaxAuthority,
  TicketBaiWsCreateCompanyRequest,
  TicketBaiWsListCompaniesRequest,
  TicketBaiWsListCompaniesResponse,
  TicketBaiWsUpdateCompanyRequest,
};
