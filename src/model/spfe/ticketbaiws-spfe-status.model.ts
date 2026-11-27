import type {
  TicketBaiWsNonErrorResponse,
  TicketBaiWsSuccessResponse,
} from '../common/ticketbaiws-response.model.js';

/**
 * States that can be reported to the AEAT SPFE.
 */
type TicketBaiWsSpfeStatusKind = 'pago' | 'cobro' | 'rechazo' | 'impago';

type TicketBaiWsSpfeStatusResult = 'PENDING' | 'OK' | 'ERROR';

type TicketBaiWsSpfeRejectionReason = '01' | '02';

/**
 * Common fields for reporting an SPFE invoice status.
 */
interface TicketBaiWsSpfeStatusRequestBase {
  /**
   * Cancels a previously reported status when true.
   */
  readonly baja?: boolean;

  /**
   * Date of the reported event in dd/mm/yyyy format.
   * TicketBaiWS uses the current date when omitted.
   */
  readonly fecha?: string;

  readonly fecha_recepcion_mercancia?: string;
  readonly fecha_recepcion_factura?: string;

  /**
   * Requests immediate processing by the AEAT.
   * Asynchronous processing is the default.
   */
  readonly sincrono?: boolean;
}

/**
 * Identifies an invoice issued through TicketBaiWS.
 */
interface TicketBaiWsSpfeIssuedInvoiceStatus extends TicketBaiWsSpfeStatusRequestBase {
  readonly serie: string;
  readonly numero: string;
  readonly fecha_factura?: string;
}

/**
 * Identifies an invoice received from a supplier.
 */
interface TicketBaiWsSpfeReceivedInvoiceStatus extends TicketBaiWsSpfeStatusRequestBase {
  readonly factura: string;
  readonly fecha_factura: string;
  readonly nif_emisor: string;
  readonly nombre_emisor: string;
}

/**
 * Reports the collection of an issued invoice.
 */
interface TicketBaiWsSpfeCollectionRequest extends TicketBaiWsSpfeIssuedInvoiceStatus {
  readonly estado: 'cobro';
  readonly vencimiento?: string;
  readonly financiacion?: boolean;
}

/**
 * Reports non-payment of an issued invoice.
 */
interface TicketBaiWsSpfeNonPaymentRequest extends TicketBaiWsSpfeIssuedInvoiceStatus {
  readonly estado: 'impago';
  readonly vencimiento: string;
}

/**
 * Reports payment of a received invoice.
 */
interface TicketBaiWsSpfePaymentRequest extends TicketBaiWsSpfeReceivedInvoiceStatus {
  readonly estado: 'pago';
  readonly vencimiento: string;
  readonly rectificada?: boolean;
  readonly rectificativa_negativa?: boolean;
}

/**
 * Reports rejection of a received invoice.
 */
interface TicketBaiWsSpfeRejectionRequest extends TicketBaiWsSpfeReceivedInvoiceStatus {
  readonly estado: 'rechazo';
  readonly vencimiento?: string;

  /**
   * 01: commercial rejection.
   * 02: private consumption or unrelated to the business.
   */
  readonly motivo_rechazo?: TicketBaiWsSpfeRejectionReason;
}

/**
 * Request for reporting an SPFE payment, collection,
 * rejection or non-payment.
 */
type TicketBaiWsSpfeStatusRequest =
  | TicketBaiWsSpfeCollectionRequest
  | TicketBaiWsSpfeNonPaymentRequest
  | TicketBaiWsSpfePaymentRequest
  | TicketBaiWsSpfeRejectionRequest;

/**
 * Error returned by the AEAT for an SPFE status.
 */
interface TicketBaiWsSpfeStatusError {
  readonly codigo: string;
  readonly descripcion: string;
}

/**
 * Status record returned by TicketBaiWS.
 */
interface TicketBaiWsSpfeStatusRecord {
  readonly id: number;
  readonly estado: TicketBaiWsSpfeStatusKind;
  readonly baja: boolean;
  readonly factura: string;
  readonly fecha_factura?: string;
  readonly nif_emisor?: string;
  readonly fecha?: string | null;
  readonly vencimiento?: string | null;
  readonly result: TicketBaiWsSpfeStatusResult;
  readonly errores: readonly TicketBaiWsSpfeStatusError[];
  readonly [key: string]: unknown;
}

/**
 * Reporting an SPFE status can return OK or PENDING.
 *
 * API-level ERROR responses are converted into
 * TicketBaiWsApiError by the HTTP client.
 */
type TicketBaiWsSpfeStatusResponse =
  TicketBaiWsNonErrorResponse<TicketBaiWsSpfeStatusRecord>;

/**
 * Optional filters for querying reported SPFE statuses.
 */
interface TicketBaiWsListSpfeStatusesRequest {
  readonly id?: number;
  readonly serie?: string;
  readonly numero?: string;
  readonly factura?: string;
  readonly nif_emisor?: string;
}

/**
 * Returns the matching SPFE status records.
 */
type TicketBaiWsListSpfeStatusesResponse = TicketBaiWsSuccessResponse<
  readonly TicketBaiWsSpfeStatusRecord[]
>;

export type {
  TicketBaiWsListSpfeStatusesRequest,
  TicketBaiWsListSpfeStatusesResponse,
  TicketBaiWsSpfeCollectionRequest,
  TicketBaiWsSpfeIssuedInvoiceStatus,
  TicketBaiWsSpfeNonPaymentRequest,
  TicketBaiWsSpfePaymentRequest,
  TicketBaiWsSpfeReceivedInvoiceStatus,
  TicketBaiWsSpfeRejectionReason,
  TicketBaiWsSpfeRejectionRequest,
  TicketBaiWsSpfeStatusError,
  TicketBaiWsSpfeStatusKind,
  TicketBaiWsSpfeStatusRecord,
  TicketBaiWsSpfeStatusRequest,
  TicketBaiWsSpfeStatusResponse,
  TicketBaiWsSpfeStatusResult,
};
