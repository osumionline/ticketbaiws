import type { TicketBaiWsSuccessResponse } from '../common/ticketbaiws-response.model.js';

/**
 * Processing states of an invoice received through SPFE.
 */
type TicketBaiWsSpfeReceivedInvoiceState = 'pendiente' | 'pagada' | 'rechazada';

/**
 * Optional filters for querying invoices received through SPFE.
 */
interface TicketBaiWsListSpfeReceivedInvoicesRequest {
  /**
   * Returns only invoices with an ID greater than this value.
   *
   * Results are ordered by ascending ID.
   * Useful for incremental synchronization.
   */
  readonly desde_id?: number;

  /**
   * Identifier of a specific received invoice.
   */
  readonly id?: number;

  readonly estado?: TicketBaiWsSpfeReceivedInvoiceState;
  readonly nif_emisor?: string;
  readonly factura?: string;

  /**
   * Invoice issue date range in dd/mm/yyyy format.
   */
  readonly desde?: string;
  readonly hasta?: string;

  /**
   * Maximum number of invoices to return.
   *
   * TicketBaiWS defaults to 100 and documents a maximum of 500.
   */
  readonly limite?: number;

  /**
   * Includes the original UBL XML in each returned invoice.
   *
   * Defaults to false on the TicketBaiWS side.
   */
  readonly ubl?: boolean;
}

/**
 * Invoice received from a supplier through the AEAT SPFE.
 */
interface TicketBaiWsSpfeReceivedInvoice {
  readonly id: number;

  /**
   * Supplier invoice series and number.
   */
  readonly factura: string;

  /**
   * Issue date in dd/mm/yyyy format.
   */
  readonly fecha_factura: string;

  /**
   * UBL invoice type code.
   *
   * Documented values include 380, 381, 384, 386 and 389.
   * Kept as string to support additional UBL codes.
   */
  readonly tipo_factura: string;

  readonly copia: boolean;

  readonly nif_emisor: string;
  readonly nombre_emisor: string;

  readonly base: number;
  readonly cuota: number;
  readonly total: number;

  /**
   * Due date in dd/mm/yyyy format, or null.
   */
  readonly vencimiento: string | null;

  readonly estado: TicketBaiWsSpfeReceivedInvoiceState;

  /**
   * Invoice locator in the AEAT SPFE.
   */
  readonly localizador: string;

  /**
   * Date and time when TicketBaiWS downloaded the invoice.
   */
  readonly fecha_descarga: string;

  /**
   * Original UBL XML document.
   *
   * Included only when requested using ubl: true.
   * The SDK does not parse or transform this XML.
   */
  readonly ubl?: string;

  readonly [key: string]: unknown;
}

/**
 * Response containing invoices received through SPFE.
 *
 * The msg field must be checked because TicketBaiWS may
 * return OK with an empty array and an authorization warning.
 */
type TicketBaiWsListSpfeReceivedInvoicesResponse = TicketBaiWsSuccessResponse<
  readonly TicketBaiWsSpfeReceivedInvoice[]
>;

export type {
  TicketBaiWsListSpfeReceivedInvoicesRequest,
  TicketBaiWsListSpfeReceivedInvoicesResponse,
  TicketBaiWsSpfeReceivedInvoice,
  TicketBaiWsSpfeReceivedInvoiceState,
};
