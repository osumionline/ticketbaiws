import type { TicketBaiWsSuccessResponse } from '../common/ticketbaiws-response.model.js';
import type { TicketBaiWsDocumentType } from '../invoice/ticketbaiws-invoice.types.js';

/**
 * Customer fields accepted by the invoicing tool.
 */
interface TicketBaiWsBillingCustomerFields {
  readonly nombre?: string;
  readonly nombre_comercial?: string;
  readonly nif?: string;
  readonly tipo_documento?: TicketBaiWsDocumentType;
  readonly direccion?: string;
  readonly cp?: string;
  readonly poblacion?: string;
  readonly provincia?: string;

  /**
   * Country name or ISO-3166 alpha-2 country code.
   *
   * The API also documents pais_cliente as an alias.
   */
  readonly pais?: string;

  readonly email?: string;
  readonly telefono?: string;
  readonly web?: string;
}

/**
 * Creates a customer in the TicketBaiWS invoicing tool.
 *
 * The OpenAPI schema requires nombre.
 * The documented nombre_social alias is pending clarification.
 */
interface TicketBaiWsCreateBillingCustomerRequest extends TicketBaiWsBillingCustomerFields {
  readonly nombre: string;
}

/**
 * Updates an existing invoicing customer.
 *
 * Only provided fields are modified.
 */
type TicketBaiWsUpdateBillingCustomerRequest = TicketBaiWsBillingCustomerFields;

/**
 * Customer returned by the TicketBaiWS invoicing tool.
 */
interface TicketBaiWsBillingCustomer {
  readonly id: number;
  readonly nif: string;
  readonly tipo_documento: string;
  readonly nombre: string;
  readonly nombre_comercial: string;
  readonly direccion: string;
  readonly cp: string;
  readonly poblacion: string;
  readonly provincia: string;

  /**
   * Country as represented in the private invoicing panel.
   */
  readonly pais: string;

  /**
   * ISO-3166 alpha-2 country code for issuing invoices.
   */
  readonly pais_cliente: string;

  readonly email: string;
  readonly telefono: string;
  readonly web: string;
  readonly fecha_alta: string;
}

/**
 * Optional filters for searching invoicing customers.
 */
interface TicketBaiWsListBillingCustomersRequest {
  /**
   * Searches tax ID, name, trade name, email and telephone.
   */
  readonly buscar?: string;

  /**
   * Searches by exact tax identifier.
   */
  readonly nif?: string;

  /**
   * Zero-based page index.
   */
  readonly pagina?: number;

  /**
   * Results per page. Default: 50. Maximum: 250.
   */
  readonly cantidad?: number;
}

/**
 * Response containing a single invoicing customer.
 */
type TicketBaiWsBillingCustomerResponse =
  TicketBaiWsSuccessResponse<TicketBaiWsBillingCustomer>;

/**
 * Response containing a paginated customer list.
 *
 * TicketBaiWS may include count at the response root,
 * alongside result, return and msg.
 */
type TicketBaiWsListBillingCustomersResponse = TicketBaiWsSuccessResponse<
  readonly TicketBaiWsBillingCustomer[]
> & {
  readonly count?: number;
};

export type {
  TicketBaiWsBillingCustomer,
  TicketBaiWsBillingCustomerFields,
  TicketBaiWsBillingCustomerResponse,
  TicketBaiWsCreateBillingCustomerRequest,
  TicketBaiWsListBillingCustomersRequest,
  TicketBaiWsListBillingCustomersResponse,
  TicketBaiWsUpdateBillingCustomerRequest,
};
