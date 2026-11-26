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

  /**
   * Whether SPFE B2B electronic invoicing is enabled
   * for this company.
   */
  readonly spfe?: boolean;
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

  /**
   * Enables or disables SPFE B2B electronic invoicing
   * when creating the company.
   *
   * Omit this property to use the API's default behavior.
   */
  readonly spfe?: boolean;
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

  /**
   * Enables or disables SPFE B2B electronic invoicing.
   *
   * Omit this property to leave the current setting unchanged.
   */
  readonly spfe?: boolean;
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
